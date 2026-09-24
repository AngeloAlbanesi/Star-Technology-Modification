#!/usr/bin/env python3
import os, sys, shutil, json, glob, subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MC_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))

print(f'=== Star Technology Custom Patches Installer ===')
print(f'Minecraft Directory: {MC_DIR}')

# 1. Copy backup files to kubejs
backup_dir = os.path.join(BASE_DIR, 'backup_files')
if os.path.exists(backup_dir):
    for root, dirs, files in os.walk(backup_dir):
        for f in files:
            src = os.path.join(root, f)
            rel = os.path.relpath(src, backup_dir)
            dst = os.path.join(MC_DIR, 'kubejs', rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
            print(f'[OK] Restored: kubejs/{rel}')

# 2. Merge language additions
lang_additions_path = os.path.join(BASE_DIR, 'lang_additions.json')
en_us_path = os.path.join(MC_DIR, 'kubejs', 'assets', 'gtceu', 'lang', 'en_us.json')
if os.path.exists(lang_additions_path) and os.path.exists(en_us_path):
    with open(lang_additions_path) as f:
        additions = json.load(f)
    with open(en_us_path) as f:
        en_us = json.load(f)
    en_us.update(additions)
    with open(en_us_path, 'w') as f:
        json.dump(en_us, f, indent=2)
    print(f'[OK] Merged {len(additions)} custom translations into en_us.json')

# 3. Run converter assets generator
gen_script = os.path.join(BASE_DIR, 'generate_converter_assets.py')
if os.path.exists(gen_script):
    subprocess.run([sys.executable, gen_script], cwd=MC_DIR, check=True)
    print('[OK] Regenerated all converter blockstates and models')

# 4. Patch gtceu jar with single-block energy container classes
jars = glob.glob(os.path.join(MC_DIR, 'mods', 'gtceu-st-*.jar'))
jars = [j for j in jars if not j.endswith('.bak')]
patch_dir = os.path.join(BASE_DIR, 'gtceu_singleblock_energy_patch')

if jars and os.path.exists(patch_dir):
    gtceu_jar = jars[0]
    bak_jar = gtceu_jar + '.bak'
    if not os.path.exists(bak_jar):
        shutil.copy2(gtceu_jar, bak_jar)
        print(f'[OK] Created backup: {os.path.basename(bak_jar)}')
    cmd = ['jar', 'uf', gtceu_jar, '-C', patch_dir, 'com']
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f'[OK] Injected energy patches into {os.path.basename(gtceu_jar)}')
    else:
        print(f'[ERROR] Failed to patch jar: {res.stderr}')

# 5. Patch expandedae jar with AdvancedAE compatibility
exp_jars = glob.glob(os.path.join(MC_DIR, 'mods', 'expandedae-*.jar'))
exp_jars = [j for j in exp_jars if not j.endswith('.bak')]
exp_patch_dir = os.path.join(BASE_DIR, 'expandedae_patch')

if exp_jars and os.path.exists(exp_patch_dir):
    exp_jar = exp_jars[0]
    bak_jar = exp_jar + '.bak'
    if not os.path.exists(bak_jar):
        shutil.copy2(exp_jar, bak_jar)
        print(f'[OK] Created backup: {os.path.basename(bak_jar)}')
    cmd = ['jar', 'uf', exp_jar, '-C', exp_patch_dir, 'lu']
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f'[OK] Injected AdvancedAE compat patch into {os.path.basename(exp_jar)}')
    else:
        print(f'[ERROR] Failed to patch expandedae jar: {res.stderr}')

# 6. Enforce COPPER_MULTIPLIER = 64 in Functional Storage config
fs_config_path = os.path.join(MC_DIR, 'config', 'functionalstorage', 'functionalstorage-common.toml')
fs_backup_config = os.path.join(BASE_DIR, 'config', 'functionalstorage', 'functionalstorage-common.toml')

if not os.path.exists(fs_config_path) and os.path.exists(fs_backup_config):
    os.makedirs(os.path.dirname(fs_config_path), exist_ok=True)
    shutil.copy2(fs_backup_config, fs_config_path)
    print('[OK] Restored functionalstorage-common.toml from backup')

if os.path.exists(fs_config_path):
    import re
    with open(fs_config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(r'COPPER_MULTIPLIER\s*=\s*\d+', 'COPPER_MULTIPLIER = 64', content)
    if new_content != content:
        with open(fs_config_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('[OK] Enforced COPPER_MULTIPLIER = 64 in functionalstorage-common.toml')
    else:
        print('[OK] COPPER_MULTIPLIER is already set to 64 in functionalstorage-common.toml')

# 7. Enforce slotvalue = 720 (20 pages of 36 patterns) in Pattern Better config
pb_config_path = os.path.join(MC_DIR, 'config', 'pattern_better-common.toml')
pb_backup_config = os.path.join(BASE_DIR, 'config', 'pattern_better-common.toml')

if not os.path.exists(pb_config_path) and os.path.exists(pb_backup_config):
    os.makedirs(os.path.dirname(pb_config_path), exist_ok=True)
    shutil.copy2(pb_backup_config, pb_config_path)
    print('[OK] Restored pattern_better-common.toml from backup')

if os.path.exists(pb_config_path):
    import re
    with open(pb_config_path, 'r', encoding='utf-8') as f:
        pb_content = f.read()
    new_pb_content = re.sub(r'slotvalue\s*=\s*\d+', 'slotvalue = 720', pb_content)
    if new_pb_content != pb_content:
        with open(pb_config_path, 'w', encoding='utf-8') as f:
            f.write(new_pb_content)
        print('[OK] Enforced slotvalue = 720 (20 pages x 36 patterns) in pattern_better-common.toml')
    else:
        print('[OK] slotvalue is already set to 720 in pattern_better-common.toml')

# 8. Patch IronJetpacks jar with zero-inertia flight patch
ij_jars = glob.glob(os.path.join(MC_DIR, 'mods', 'IronJetpacks-*.jar'))
ij_jars = [j for j in ij_jars if not j.endswith('.bak')]
ij_patch_dir = os.path.join(BASE_DIR, 'ironjetpacks_patch')

if ij_jars and os.path.exists(ij_patch_dir):
    ij_jar = ij_jars[0]
    bak_jar = ij_jar + '.bak'
    if not os.path.exists(bak_jar):
        shutil.copy2(ij_jar, bak_jar)
        print(f'[OK] Created backup: {os.path.basename(bak_jar)}')
    cmd = ['jar', 'uf', ij_jar, '-C', ij_patch_dir, 'com']
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f'[OK] Injected zero-inertia flight patch into {os.path.basename(ij_jar)}')
# 9. Patch Star-Technology-Core jar with ParallelHatchPartMachineMixin fix (HV=8, EV=16, IV=32, ...)
st_jars = glob.glob(os.path.join(MC_DIR, 'mods', 'Star-Technology-Core-*.jar'))
st_jars = [j for j in st_jars if not j.endswith('.bak')]
st_patch_dir = os.path.join(BASE_DIR, 'start_core_patch')

if st_jars and os.path.exists(st_patch_dir):
    st_jar = st_jars[0]
    bak_jar = st_jar + '.bak'
    if not os.path.exists(bak_jar):
        shutil.copy2(st_jar, bak_jar)
        print(f'[OK] Created backup: {os.path.basename(bak_jar)}')
    cmd = ['jar', 'uf', st_jar, '-C', st_patch_dir, 'com']
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f'[OK] Injected ParallelHatchPartMachineMixin patch into {os.path.basename(st_jar)}')
    else:
        print(f'[ERROR] Failed to patch Star-Technology-Core jar: {res.stderr}')

print('=== All patches successfully applied! ===')

