import zipfile, os, json, glob, re

# Load all server script content
server_scripts = glob.glob('kubejs/server_scripts/**/*.js', recursive=True)
all_js = ''
for s in server_scripts:
    with open(s, 'r', encoding='utf-8', errors='ignore') as f:
        all_js += '\n// FILE: ' + s + '\n' + f.read()

mods = {
    'ae2': 'mods/appliedenergistics2-forge-15.4.10.jar',
    'expatternprovider': 'mods/ExtendedAE-1.20-1.4.15-forge.jar',
    'expandedae': 'mods/expandedae-1.4.1.b.jar',
    'advanced_ae': 'mods/AdvancedAE-1.2.5-1.20.1.jar'
}

for modid, jar in mods.items():
    print('====================================================')
    print(f'ANALYZING: {modid} ({os.path.basename(jar)})')
    print('====================================================')
    
    items = set()
    default_recipes = {}
    with zipfile.ZipFile(jar) as z:
        for name in z.namelist():
            if name.startswith(f'assets/{modid}/models/item/') and name.endswith('.json'):
                item_name = os.path.basename(name)[:-5]
                items.add(f'{modid}:{item_name}')
            elif name.startswith(f'data/{modid}/recipes/') and name.endswith('.json'):
                try:
                    data = json.loads(z.read(name).decode('utf-8'))
                    out = None
                    if 'result' in data:
                        if isinstance(data['result'], str):
                            out = data['result']
                        elif isinstance(data['result'], dict) and 'item' in data['result']:
                            out = data['result']['item']
                    elif 'output' in data:
                        if isinstance(data['output'], str):
                            out = data['output']
                        elif isinstance(data['output'], dict) and 'item' in data['output']:
                            out = data['output']['item']
                    if out:
                        default_recipes.setdefault(out, []).append(name)
                except Exception:
                    pass

    blocked_items = []
    custom_items = []
    default_only = []
    no_recipe_at_all = []
    
    for item in sorted(items):
        # Check if item has a custom recipe
        has_custom = bool(re.search(r'(itemOutputs|shaped|shapeless|canner|packer|assembler)\s*\([^\)]*[\'\"`]' + re.escape(item), all_js))
        
        # Check explicit removal
        is_explicitly_removed = False
        if re.search(r'[\'\"`]' + re.escape(item) + r'[\'\"`][^;]*event\.remove', all_js) or \
           re.search(r'event\.remove\([^\)]*[\'\"`]' + re.escape(item) + r'[\'\"`]', all_js) or \
           (item in all_js and re.search(r'\[[^\]]*[\'\"`]' + re.escape(item) + r'[\'\"`][^\]]*\]\s*\.\s*forEach[^\}]*event\.remove', all_js)):
            is_explicitly_removed = True
            
        has_default = item in default_recipes
            
        if is_explicitly_removed and not has_custom:
            blocked_items.append(item)
        elif has_custom:
            custom_items.append(item)
        elif has_default:
            default_only.append(item)
        else:
            no_recipe_at_all.append(item)
            
    print(f'Total items checked: {len(items)}')
    print(f'Items with Custom GTCEu/KubeJS recipe: {len(custom_items)}')
    print(f'Items keeping default recipe (untouched): {len(default_only)}')
    print(f'Items EXPLICITLY REMOVED / BLOCKED with NO recipe: {len(blocked_items)}')
    for b in blocked_items:
        print(f'  [BLOCKED] {b}')
    print(f'Items with NO default recipe and NO KubeJS recipe: {len(no_recipe_at_all)}')
    for n in no_recipe_at_all:
        print(f'  [NO RECIPE] {n}')
