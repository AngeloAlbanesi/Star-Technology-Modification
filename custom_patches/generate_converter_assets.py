import os
import json

base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'kubejs', 'assets', 'gtceu'))

blockstates_dir = os.path.join(base_path, "blockstates")
block_models_dir = os.path.join(base_path, "models", "block", "machine")
item_models_dir = os.path.join(base_path, "models", "item")

os.makedirs(blockstates_dir, exist_ok=True)
os.makedirs(block_models_dir, exist_ok=True)
os.makedirs(item_models_dir, exist_ok=True)

converters = [
    # (amp, [tiers])
    (64, ["hv"]),
    (256, ["hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"]),
    (1024, ["hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"]),
    (4096, ["hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"]),
]

created_count = 0

for amp, tiers in converters:
    for tier in tiers:
        machine_name = f"{tier}_{amp}a_energy_converter"
        
        # 1. Blockstate
        bs = {
            "variants": {
                "facing=down": {
                    "model": f"gtceu:block/machine/{machine_name}",
                    "x": 90
                },
                "facing=east": {
                    "model": f"gtceu:block/machine/{machine_name}",
                    "y": 90
                },
                "facing=north": {
                    "model": f"gtceu:block/machine/{machine_name}"
                },
                "facing=south": {
                    "model": f"gtceu:block/machine/{machine_name}",
                    "y": 180
                },
                "facing=up": {
                    "gtceu:z": 180,
                    "model": f"gtceu:block/machine/{machine_name}",
                    "x": 270
                },
                "facing=west": {
                    "model": f"gtceu:block/machine/{machine_name}",
                    "y": 270
                }
            }
        }
        with open(os.path.join(blockstates_dir, f"{machine_name}.json"), "w") as f:
            json.dump(bs, f, indent=2)
            
        # 2. Item model
        im = {
            "parent": f"gtceu:block/machine/{machine_name}"
        }
        with open(os.path.join(item_models_dir, f"{machine_name}.json"), "w") as f:
            json.dump(im, f, indent=2)
            
        # 3. Block model
        if amp == 64:
            in_io = "gtceu:block/overlay/machine/overlay_energy_64a_in"
            out_io = "gtceu:block/overlay/machine/overlay_energy_64a_out"
            in_io_emissive = "gtceu:block/overlay/machine/overlay_energy_64a_in_emissive"
            out_io_emissive = "gtceu:block/overlay/machine/overlay_energy_64a_out_emissive"
            tinted = "gtceu:block/overlay/machine/overlay_energy_64a_tinted"
        else:
            in_io = f"start_core:block/overlay/modular/overlay_energy_{amp}a_out"
            out_io = f"start_core:block/overlay/modular/overlay_energy_{amp}a_out"
            in_io_emissive = f"start_core:block/overlay/modular/overlay_energy_{amp}a_in_emissive"
            out_io_emissive = f"start_core:block/overlay/modular/overlay_energy_{amp}a_out_emissive"
            tinted = f"start_core:block/overlay/modular/overlay_energy_{amp}a_tinted"
            
        bm = {
            "parent": "minecraft:block/block",
            "loader": "gtceu:machine",
            "machine": f"gtceu:{machine_name}",
            "variants": {
                "fe_to_eu=false": {
                    "model": {
                        "parent": "gtceu:block/machine/template/transformer_like_machine",
                        "textures": {
                            "bottom": f"gtceu:block/casings/voltage/{tier}/bottom",
                            "overlay_in_io": in_io,
                            "overlay_in_io_emissive": in_io_emissive,
                            "overlay_in_tinted": tinted,
                            "overlay_out_io": "gtceu:block/overlay/converter/converter_native_out",
                            "overlay_out_io_emissive": "gtceu:block/overlay/converter/converter_native_out_emissive",
                            "side": f"gtceu:block/casings/voltage/{tier}/side",
                            "top": f"gtceu:block/casings/voltage/{tier}/top"
                        }
                    }
                },
                "fe_to_eu=true": {
                    "model": {
                        "parent": "gtceu:block/machine/template/transformer_like_machine",
                        "textures": {
                            "bottom": f"gtceu:block/casings/voltage/{tier}/bottom",
                            "overlay_in_io": out_io,
                            "overlay_in_io_emissive": out_io_emissive,
                            "overlay_in_tinted": tinted,
                            "overlay_out_io": "gtceu:block/overlay/converter/converter_native_in",
                            "overlay_out_io_emissive": "gtceu:block/overlay/converter/converter_native_in_emissive",
                            "side": f"gtceu:block/casings/voltage/{tier}/side",
                            "top": f"gtceu:block/casings/voltage/{tier}/top"
                        }
                    }
                }
            }
        }
        with open(os.path.join(block_models_dir, f"{machine_name}.json"), "w") as f:
            json.dump(bm, f, indent=2)
            
        created_count += 3

print(f"Successfully generated {created_count} asset files for {created_count // 3} energy converters!")
