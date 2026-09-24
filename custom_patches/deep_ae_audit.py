import zipfile, os, json, glob, re

server_scripts = glob.glob('kubejs/server_scripts/**/*.js', recursive=True)
all_js = ''
for s in server_scripts:
    with open(s, 'r', encoding='utf-8', errors='ignore') as f:
        all_js += f'\n// FILE: {s}\n' + f.read()

mods = {
    'ae2': 'mods/appliedenergistics2-forge-15.4.10.jar',
    'expatternprovider': 'mods/ExtendedAE-1.20-1.4.15-forge.jar',
    'expandedae': 'mods/expandedae-1.4.1.b.jar',
    'advanced_ae': 'mods/AdvancedAE-1.2.5-1.20.1.jar'
}

# 1. Collect all recipes defined in KubeJS
# Check all recipes by output
kube_outputs = set()
for m in re.finditer(r'itemOutputs\(\s*[\'\"]([^\'\"]+)[\'\"]', all_js):
    item = m.group(1).split()[-1] # handle '4x ae2:...'
    kube_outputs.add(item)
for m in re.finditer(r'event\.(?:shaped|shapeless)\(\s*(?:Item\.of\()?\s*[\'\"]([^\'\"]+)[\'\"]', all_js):
    item = m.group(1).split()[-1]
    kube_outputs.add(item)

# Also check assembler / assemblerFluid / assembler_rem / assemblerFluidRem in machinery.js
for m in re.finditer(r'assembler(?:Fluid)?(?:Rem)?\([^,]+,\s*[\'\"]([^\'\"]+)[\'\"]', all_js):
    item = m.group(1).split()[-1]
    kube_outputs.add(item)

# Also check shapedRecipeRem
for m in re.finditer(r'shapedRecipeRem\(\s*[\'\"]([^\'\"]+)[\'\"]', all_js):
    item = m.group(1).split()[-1]
    kube_outputs.add(item)

# 2. Check disabled recipe types
disabled_types = set()
for m in re.finditer(r'event\.remove\(\s*\{\s*type:\s*[\'\"]([^\'\"]+)[\'\"]\s*\}\s*\)', all_js):
    disabled_types.add(m.group(1))

# Check removals in array
# [ ... ].forEach(element => { event.remove({ type: element}); })
for m in re.finditer(r'\[([^\]]+)\]\s*\.\s*forEach\(\s*\w+\s*=>\s*\{\s*event\.remove\(\s*\{\s*type:\s*\w+\s*\}\s*\)', all_js):
    for t in re.findall(r'[\'\"]([^\'\"]+)[\'\"]', m.group(1)):
        disabled_types.add(t)

print("Disabled recipe types:", disabled_types)

# 3. Check items explicitly removed by output
removed_outputs = set()
for m in re.finditer(r'event\.remove\(\s*\{\s*output:\s*[\'\"]([^\'\"]+)[\'\"]\s*\}\s*\)', all_js):
    removed_outputs.add(m.group(1))
for m in re.finditer(r'\[([^\]]+)\]\s*\.\s*forEach\(\s*\w+\s*=>\s*\{\s*event\.remove\(\s*\{\s*output:\s*\w+\s*\}\s*\)', all_js):
    for t in re.findall(r'[\'\"]([^\'\"]+)[\'\"]', m.group(1)):
        removed_outputs.add(t)

# 4. Check recipe IDs removed
removed_ids = set()
for m in re.finditer(r'event\.remove\(\s*\{\s*id:\s*[\'\"]([^\'\"]+)[\'\"]\s*\}\s*\)', all_js):
    removed_ids.add(m.group(1))
for m in re.finditer(r'\[([^\]]+)\]\s*\.\s*forEach\(\s*\w+\s*=>\s*\{\s*event\.remove\(\s*\{\s*id:\s*\w+\s*\}\s*\)', all_js):
    for t in re.findall(r'[\'\"]([^\'\"]+)[\'\"]', m.group(1)):
        removed_ids.add(t)

results = {}

for modid, jar in mods.items():
    results[modid] = {
        'completely_blocked': [], # removed output or all recipes removed, and NO custom recipe
        'crafting_replaced': [],  # removed default, but has custom GTCEu recipe
        'unusable_indirectly': [],# has recipe, but requires a blocked item or disabled recipe type
        'untouched': [],          # keeps default recipe
        'no_recipe_in_mod': []    # items without recipe in mod jar (e.g. creative, debug, base/parts)
    }
    
    with zipfile.ZipFile(jar) as z:
        # Load all recipes in jar
        jar_recipes = {} # out_item -> list of (recipe_id, recipe_type, recipe_json)
        for name in z.namelist():
            if name.startswith(f'data/{modid}/recipes/') and name.endswith('.json'):
                recipe_id = f"{modid}:{os.path.basename(name)[:-5]}"
                # full recipe path without data/ and .json
                # in 1.20, id is modid:path under data/modid/recipes/
                rel = name[len(f'data/{modid}/recipes/'):-5]
                full_id = f"{modid}:{rel}"
                try:
                    data = json.loads(z.read(name).decode('utf-8'))
                    rtype = data.get('type', '')
                    out = None
                    if 'result' in data:
                        if isinstance(data['result'], str):
                            out = data['result']
                        elif isinstance(data['result'], dict):
                            out = data['result'].get('item')
                    elif 'output' in data:
                        if isinstance(data['output'], str):
                            out = data['output']
                        elif isinstance(data['output'], dict):
                            out = data['output'].get('item')
                    if out:
                        jar_recipes.setdefault(out, []).append((full_id, rtype, data))
                except:
                    pass
                    
        # Load all item models
        items = set()
        for name in z.namelist():
            if name.startswith(f'assets/{modid}/models/item/') and name.endswith('.json'):
                items.add(f'{modid}:{os.path.basename(name)[:-5]}')

    for item in sorted(items):
        recipes_for_item = jar_recipes.get(item, [])
        has_custom = item in kube_outputs or bool(re.search(r'[\'\"`]' + re.escape(item) + r'[\'\"`]', all_js) and re.search(r'(itemOutputs|canner|assembler|packer|shaped|shapeless)', all_js))
        
        # Check if item output was explicitly removed
        out_removed = item in removed_outputs
        
        # Check if all recipes for this item were removed by id or disabled type
        valid_jar_recipes = []
        for rid, rtype, rdata in recipes_for_item:
            if rid in removed_ids:
                continue
            if rtype in disabled_types:
                continue
            # Also check if ingredients contain a blocked item
            valid_jar_recipes.append((rid, rtype, rdata))
            
        if has_custom:
            results[modid]['crafting_replaced'].append(item)
        elif out_removed or (recipes_for_item and len(valid_jar_recipes) == 0):
            results[modid]['completely_blocked'].append(item)
        elif len(valid_jar_recipes) > 0:
            # Check if any ingredient is blocked
            # e.g., requires ae2:vibration_chamber or ae2:inscriber
            blocked_ing = []
            for rid, rtype, rdata in valid_jar_recipes:
                # search for ingredient items
                text_data = json.dumps(rdata)
                for bl in ['ae2:inscriber', 'ae2:charger', 'ae2:vibration_chamber', 'expatternprovider:ex_inscriber', 'expatternprovider:ex_charger']:
                    if f'"{bl}"' in text_data:
                        blocked_ing.append((rid, bl))
            if blocked_ing:
                results[modid]['unusable_indirectly'].append((item, blocked_ing))
            else:
                results[modid]['untouched'].append(item)
        else:
            results[modid]['no_recipe_in_mod'].append(item)

# Print clean report
for modid in mods:
    print('========================================================================')
    print(f'MOD: {modid.upper()}')
    print('========================================================================')
    print(f"1. COMPLETAMENTE BLOCCATI / RIMOSSI SENZA RICETTA ALTERNATIVA: {len(results[modid]['completely_blocked'])}")
    for x in results[modid]['completely_blocked']:
        print(f"   - {x}")
    print(f"\n2. INDIRETAMENTE BLOCCATI (Hanno ricetta, ma richiede un blocco rimosso o tipo disabilitato): {len(results[modid]['unusable_indirectly'])}")
    for x, reason in results[modid]['unusable_indirectly']:
        print(f"   - {x} (richiede: {set(r[1] for r in reason)})")
    print(f"\n3. RICETTA SOSTITUITA CON GREGTECH (KubeJS / Assembler): {len(results[modid]['crafting_replaced'])}")
    for x in results[modid]['crafting_replaced']:
        print(f"   - {x}")
    print(f"\n4. INALTERATI (Funzionano con ricetta standard del mod): {len(results[modid]['untouched'])}")
    print(f"   Total: {len(results[modid]['untouched'])} items")
    print(f"\n5. NESSUNA RICETTA NEL MOD (Creative, debug, parti interne, ecc.): {len(results[modid]['no_recipe_in_mod'])}")
    for x in results[modid]['no_recipe_in_mod']:
        print(f"   - {x}")
