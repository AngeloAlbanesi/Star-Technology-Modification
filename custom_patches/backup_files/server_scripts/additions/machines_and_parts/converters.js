ServerEvents.recipes(event => {

        event.remove({ output: /gtceu:.*_energy_converter/ });

        const converterMaterials = {
            lv: {
                superconductor: 'gtceu:soul_infused',
                casing: 'gtceu:steel',
                cable: 'gtceu:tin',
                has64aConverter: false,
            },
            mv: {
                superconductor: 'gtceu:signalum',
                casing: 'gtceu:aluminium',
                cable: 'gtceu:copper',
                has64aConverter: false,
            },
            hv: {
                superconductor: 'gtceu:lumium',
                casing: 'gtceu:stainless_steel',
                cable: 'minecraft:gold',
                has64aConverter: false,
            },
            ev: {
                superconductor: 'gtceu:enderium',
                casing: 'gtceu:titanium',
                cable: 'gtceu:aluminium',
                has64aConverter: true,
            },
            iv: {
                superconductor: 'gtceu:shellite',
                casing: 'gtceu:tungsten_steel',
                cable: 'gtceu:platinum',
                has64aConverter: true,
            },
            luv: {
                superconductor: 'gtceu:twinite',
                casing: 'gtceu:rhodium_plated_palladium',
                cable: 'gtceu:niobium_titanium',
                has64aConverter: true,
            },
            zpm: {
                superconductor: 'gtceu:dragonsteel',
                casing: 'gtceu:naquadah_alloy',
                cable: 'gtceu:vanadium_gallium',
                has64aConverter: true,
            },
            uv: {
                superconductor: 'gtceu:prismalium',
                casing: 'gtceu:darmstadtium',
                cable: 'gtceu:yttrium_barium_cuprate',
                has64aConverter: true,
            },
            uhv: {
                superconductor: 'gtceu:stellarium',
                casing: 'gtceu:neutronium',
                cable: 'gtceu:europium',
                has64aConverter: true,
            },
            uev: {
                superconductor: 'gtceu:ancient_runicalium',
                casing: 'gtceu:mythrolic_alloy',
                cable: 'gtceu:cerium_tritelluride',
                has64aConverter: true,
            }
        };

        function converterCraftingRecipe(amps, thickness){
            for (const [tier, info] of Object.entries(converterMaterials)) {
                event.shaped(Item.of(`gtceu:${tier}_${amps}a_energy_converter`), [
                    '   ',
                    'WCW',
                    'WSW'
                ], {
                    W: `${info.superconductor}_${thickness}_wire`,
                    C: `#gtceu:circuits/${tier}`,
                    S: `gtceu:${tier}_machine_hull`
                }).id(`start:shaped/${tier}_${amps}a_energy_converter`);
            };
        };

        converterCraftingRecipe(1, 'single');
        converterCraftingRecipe(4, 'quadruple');
        converterCraftingRecipe(8, 'octal');
        converterCraftingRecipe(16, 'hex');

        const tierMap = {
            lv: GTValues.LV,
            mv: GTValues.MV,
            hv: GTValues.HV,
            ev: GTValues.EV,
            iv: GTValues.IV,
            luv: GTValues.LuV,
            zpm: GTValues.ZPM,
            uv: GTValues.UV,
            uhv: GTValues.UHV,
            uev: GTValues.UEV
        };

        // HV 64A Converter
        event.recipes.gtceu.assembler('gtceu:hv_64a_energy_converter')
            .itemInputs('#gtceu:circuits/hv', '16x gtceu:lumium_hex_wire', 'gtceu:hv_machine_hull')
            .itemOutputs(Item.of('gtceu:hv_64a_energy_converter'))
            .duration(600)
            .EUt(GTValues.VA[GTValues.HV]);

        event.shapeless('gtceu:hv_64a_energy_converter', ['4x gtceu:hv_16a_energy_converter']);

        // 64A Converter Recipe
        Object.entries(converterMaterials).forEach(([tier, info]) => {
            if (!info.has64aConverter) return;
            event.recipes.gtceu.assembler(`start_core:${tier}_64a_energy_converter`)
                .itemInputs(`#gtceu:circuits/${tier}`, `16x ${info.superconductor}_hex_wire`, `gtceu:${tier}_machine_hull`)
                .itemOutputs(Item.of(`start_core:${tier}_64a_energy_converter`))
                .duration(600)
                .EUt(1625);

            event.shapeless(`start_core:${tier}_64a_energy_converter`, [`4x gtceu:${tier}_16a_energy_converter`]);
        });

        const hiAmpTiers = ['hv', 'ev', 'iv', 'luv', 'zpm', 'uv', 'uhv', 'uev'];

        // 256A Converter Recipe
        hiAmpTiers.forEach(tier => {
            let info = converterMaterials[tier];
            let tIndex = tierMap[tier];
            let eut = tIndex !== undefined ? GTValues.VA[tIndex] : 1625;
            let prev64 = tier === 'hv' ? 'gtceu:hv_64a_energy_converter' : `start_core:${tier}_64a_energy_converter`;

            // Upgrade from 64A
            event.recipes.gtceu.assembler(`gtceu:${tier}_256a_energy_converter`)
                .itemInputs(
                    prev64,
                    `16x ${info.superconductor}_hex_wire`,
                    `2x #gtceu:circuits/${tier}`
                )
                .itemOutputs(Item.of(`gtceu:${tier}_256a_energy_converter`))
                .duration(800)
                .EUt(eut);

            // Direct Assembler from hull
            event.recipes.gtceu.assembler(`gtceu:${tier}_256a_energy_converter_direct`)
                .itemInputs(
                    `gtceu:${tier}_machine_hull`,
                    `32x ${info.superconductor}_hex_wire`,
                    `4x #gtceu:circuits/${tier}`
                )
                .itemOutputs(Item.of(`gtceu:${tier}_256a_energy_converter`))
                .duration(1200)
                .EUt(eut);

            // 4x 64A shapeless craft
            event.shapeless(`gtceu:${tier}_256a_energy_converter`, [`4x ${prev64}`]);
        });

        // 1024A Converter Recipe
        hiAmpTiers.forEach(tier => {
            let info = converterMaterials[tier];
            let tIndex = tierMap[tier];
            let eut = tIndex !== undefined ? GTValues.VA[tIndex] : 1625;

            // Upgrade from 256A
            event.recipes.gtceu.assembler(`gtceu:${tier}_1024a_energy_converter`)
                .itemInputs(
                    `gtceu:${tier}_256a_energy_converter`,
                    `32x ${info.superconductor}_hex_wire`,
                    `4x #gtceu:circuits/${tier}`
                )
                .itemOutputs(Item.of(`gtceu:${tier}_1024a_energy_converter`))
                .duration(1200)
                .EUt(eut);

            // 4x 256A shapeless craft
            event.shapeless(`gtceu:${tier}_1024a_energy_converter`, [`4x gtceu:${tier}_256a_energy_converter`]);
        });

        // 4096A Converter Recipe
        hiAmpTiers.forEach(tier => {
            let info = converterMaterials[tier];
            let tIndex = tierMap[tier];
            let eut = tIndex !== undefined ? GTValues.VA[tIndex] : 1625;

            // Upgrade from 1024A
            event.recipes.gtceu.assembler(`gtceu:${tier}_4096a_energy_converter`)
                .itemInputs(
                    `gtceu:${tier}_1024a_energy_converter`,
                    `64x ${info.superconductor}_hex_wire`,
                    `8x #gtceu:circuits/${tier}`
                )
                .itemOutputs(Item.of(`gtceu:${tier}_4096a_energy_converter`))
                .duration(1600)
                .EUt(eut);

            // 4x 1024A shapeless craft
            event.shapeless(`gtceu:${tier}_4096a_energy_converter`, [`4x gtceu:${tier}_1024a_energy_converter`]);
        });
    });

BlockEvents.placed(event => {
	let block = event.getBlock();
	if (/^(?:gtceu|start_core):.*energy_converter$/.test(block.getId())) {
        block.mergeEntityData({ energyContainer: { feToEu: true } });
	};
});