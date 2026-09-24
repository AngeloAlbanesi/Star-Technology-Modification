ServerEvents.recipes(event => {
    const id = global.id;

    event.remove({ output: /gtceu:.*hatch_4a/ });
    event.remove({ output: /gtceu:.*hatch_16a/ });
    event.remove({ output: /gtceu:.*hatch_64a/ });
    event.remove({ output: /gtceu:.*_256a_laser.*/ });
    event.remove({ output: /gtceu:.*_1024a_laser.*/ });
    event.remove({ output: /gtceu:.*_4096a_laser.*/ });
    const components = global.componentMaterials;

        function highAmphatches(tierKey,coilMod) {
            const tierData = components[tierKey];

            if (!tierData) return;

            const {
                tiers: { tier },
                materials: {
                    tierMaterial,
                    cable,
                    solder
                },
                scaling: {
                    scaler,
                    EU
                }
            } = tierData;

            [
                { type: 'input', laserType: 'target', laserPart: 'sensor' },
                { type: 'output', laserType: 'source', laserPart: 'emitter' }
            ].forEach(energyIOData => {

            const { type, laserType, laserPart} = energyIOData

                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_4a`))
                    .itemInputs(`gtceu:${tier}_transformer_1a`,`gtceu:${tier}_energy_${type}_hatch`,`2x gtceu:${cable}_quadruple_wire`,
                        `1x ${coilMod}:${tier}_voltage_coil`,`2x gtceu:${tierMaterial}_plate`)
                    .inputFluids(`gtceu:${solder} ${scaler * 144}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_4a`)
                    .duration(100)
                    .EUt(EU * 2);

                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_16a`))
                    .itemInputs(`gtceu:${tier}_transformer_4a`,`gtceu:${tier}_energy_${type}_hatch_4a`,`2x gtceu:${cable}_quadruple_wire`,
                        `2x ${coilMod}:${tier}_voltage_coil`,`4x gtceu:${tierMaterial}_plate`)
                    .inputFluids(`gtceu:${solder} ${scaler * 288}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_16a`)
                    .duration(200)
                    .EUt(EU * 3);

                // 64A Energy Hatch (Standard Multiblock)
                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_64a`))
                    .itemInputs(`gtceu:${tier}_transformer_16a`, `gtceu:${tier}_energy_${type}_hatch_16a`, `2x gtceu:${cable}_hex_wire`, 
                        `3x ${coilMod}:${tier}_voltage_coil`,`6x gtceu:${tierMaterial}_plate`)
                    .inputFluids(`gtceu:${solder} ${scaler * 432}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_64a`)
                    .duration(400)
                    .EUt(EU * 4);

                // 64A Substation Hatch
                event.recipes.gtceu.assembler(id(`${tier}_substation_${type}_hatch_64a`))
                    .itemInputs(`gtceu:${tier}_transformer_16a`, `gtceu:${tier}_energy_${type}_hatch_16a`, `2x gtceu:${cable}_hex_wire`, 
                        `3x ${coilMod}:${tier}_voltage_coil`,`6x gtceu:${tierMaterial}_plate`)
                    .inputFluids(`gtceu:${solder} ${scaler * 432}`)
                    .itemOutputs(`gtceu:${tier}_substation_${type}_hatch_64a`)
                    .duration(400)
                    .EUt(EU * 4);

                // 1:1 conversion between Substation Hatch and Multiblock Energy Hatch
                event.shapeless(`gtceu:${tier}_energy_${type}_hatch_64a`, [`gtceu:${tier}_substation_${type}_hatch_64a`]);
                event.shapeless(`gtceu:${tier}_substation_${type}_hatch_64a`, [`gtceu:${tier}_energy_${type}_hatch_64a`]);

                // 256A Energy Hatch (Standard Multiblock)
                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_256a`))
                    .itemInputs(`gtceu:${tier}_energy_${type}_hatch_64a`, `2x gtceu:${cable}_octal_wire`,
                        `4x ${coilMod}:${tier}_voltage_coil`, `8x gtceu:${tierMaterial}_plate`, `2x #gtceu:circuits/${tier}`)
                    .inputFluids(`gtceu:${solder} ${scaler * 576}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_256a`)
                    .duration(600)
                    .EUt(EU * 4);

                // 1024A Energy Hatch (Standard Multiblock)
                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_1024a`))
                    .itemInputs(`gtceu:${tier}_energy_${type}_hatch_256a`, `2x gtceu:${cable}_hex_wire`,
                        `4x ${coilMod}:${tier}_voltage_coil`, `8x gtceu:${tierMaterial}_plate`, `4x #gtceu:circuits/${tier}`)
                    .inputFluids(`gtceu:${solder} ${scaler * 720}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_1024a`)
                    .duration(900)
                    .EUt(EU * 4);

                // 4096A Energy Hatch (Standard Multiblock)
                event.recipes.gtceu.assembler(id(`${tier}_energy_${type}_hatch_4096a`))
                    .itemInputs(`gtceu:${tier}_energy_${type}_hatch_1024a`, `4x gtceu:${cable}_hex_wire`,
                        `4x ${coilMod}:${tier}_voltage_coil`, `8x gtceu:${tierMaterial}_plate`, `8x #gtceu:circuits/${tier}`)
                    .inputFluids(`gtceu:${solder} ${scaler * 864}`)
                    .itemOutputs(`gtceu:${tier}_energy_${type}_hatch_4096a`)
                    .duration(1200)
                    .EUt(EU * 4);

                if(tier !== 'ev'){
                    event.recipes.gtceu.assembler(id(`${tier}_256a_laser_${laserType}_hatch`))
                        .itemInputs(`gtceu:${tier}_energy_${type}_hatch_64a`, 'gtceu:diamond_lens', `gtceu:${tier}_${laserPart}`, 
                            `gtceu:${tier}_electric_pump`, `4x gtceu:${cable}_single_cable`)
                        .inputFluids(`gtceu:${solder} ${scaler * 576}`)
                        .itemOutputs(`gtceu:${tier}_256a_laser_${laserType}_hatch`)
                        .duration(600)
                        .EUt(EU * 4);

                    event.recipes.gtceu.assembler(id(`${tier}_1024a_laser_${laserType}_hatch`))
                        .itemInputs(`gtceu:${tier}_256a_laser_${laserType}_hatch`, '2x gtceu:diamond_lens', `2x gtceu:${tier}_${laserPart}`, 
                            `2x gtceu:${tier}_electric_pump`, `4x gtceu:${cable}_double_cable`)
                        .inputFluids(`gtceu:${solder} ${scaler * 720}`)
                        .itemOutputs(`gtceu:${tier}_1024a_laser_${laserType}_hatch`)
                        .duration(900)
                        .EUt(EU * 4);

                    event.recipes.gtceu.assembler(id(`${tier}_4096a_laser_${laserType}_hatch`))
                        .itemInputs(`gtceu:${tier}_1024a_laser_${laserType}_hatch`, '4x gtceu:diamond_lens', `4x gtceu:${tier}_${laserPart}`, 
                            `4x gtceu:${tier}_electric_pump`, `4x gtceu:${cable}_quadruple_cable`)
                        .inputFluids(`gtceu:${solder} ${scaler * 864}`)
                        .itemOutputs(`gtceu:${tier}_4096a_laser_${laserType}_hatch`)
                        .duration(1200)
                        .EUt(EU * 4);
                }

            });
        }

        highAmphatches('ev','gtceu');
        highAmphatches('iv','gtceu');        
        highAmphatches('luv','gtceu');
        highAmphatches('zpm','gtceu');
        highAmphatches('uv','gtceu');
        highAmphatches('uhv','kubejs');
        highAmphatches('uev','kubejs');
        highAmphatches('uiv','kubejs');

        // HV High-Amp Energy Input Hatches (4A = 2,048 EU/t, 16A = 8,192 EU/t)
        event.recipes.gtceu.assembler(id('hv_energy_input_hatch_4a'))
            .itemInputs(
                'gtceu:hv_transformer_1a',
                'gtceu:hv_energy_input_hatch',
                '2x gtceu:gold_quadruple_wire',
                '1x gtceu:hv_voltage_coil',
                '2x gtceu:stainless_steel_plate'
            )
            .inputFluids('gtceu:soldering_alloy 144')
            .itemOutputs('gtceu:hv_energy_input_hatch_4a')
            .duration(100)
            .EUt(GTValues.VA[GTValues.HV]);

        event.recipes.gtceu.assembler(id('hv_energy_input_hatch_16a'))
            .itemInputs(
                'gtceu:hv_transformer_4a',
                'gtceu:hv_energy_input_hatch_4a',
                '2x gtceu:gold_quadruple_wire',
                '2x gtceu:hv_voltage_coil',
                '4x gtceu:stainless_steel_plate'
            )
            .inputFluids('gtceu:soldering_alloy 288')
            .itemOutputs('gtceu:hv_energy_input_hatch_16a')
            .duration(200)
            .EUt(GTValues.VA[GTValues.HV]);

        // Direct upgrade from 1A to 16A in Assembler
        event.recipes.gtceu.assembler(id('hv_energy_input_hatch_16a_direct'))
            .itemInputs(
                'gtceu:hv_transformer_16a',
                'gtceu:hv_energy_input_hatch',
                '2x gtceu:gold_hex_wire',
                '3x gtceu:hv_voltage_coil',
                '6x gtceu:stainless_steel_plate'
            )
            .inputFluids('gtceu:soldering_alloy 432')
            .itemOutputs('gtceu:hv_energy_input_hatch_16a')
            .duration(300)
            .EUt(GTValues.VA[GTValues.HV]);

        // Crafting table recipes for convenience
        event.shaped('gtceu:hv_energy_input_hatch_4a', [
            'WTW',
            'CHC',
            'PPP'
        ], {
            W: 'gtceu:gold_quadruple_wire',
            T: 'gtceu:hv_transformer_1a',
            C: 'gtceu:hv_voltage_coil',
            H: 'gtceu:hv_energy_input_hatch',
            P: 'gtceu:stainless_steel_plate'
        });

        event.shaped('gtceu:hv_energy_input_hatch_16a', [
            'WTW',
            'CHC',
            'PPP'
        ], {
            W: 'gtceu:gold_octal_wire',
            T: 'gtceu:hv_transformer_4a',
            C: 'gtceu:hv_voltage_coil',
            H: 'gtceu:hv_energy_input_hatch_4a',
            P: 'gtceu:stainless_steel_plate'
        });

        event.shaped('gtceu:hv_energy_input_hatch_16a', [
            'WTW',
            'CHC',
            'PPP'
        ], {
            W: 'gtceu:gold_hex_wire',
            T: 'gtceu:hv_transformer_16a',
            C: 'gtceu:hv_voltage_coil',
            H: 'gtceu:hv_energy_input_hatch',
            P: 'gtceu:stainless_steel_plate'
        }).id(id('hv_energy_input_hatch_16a_from_1a'));

        // HV 64A Energy Input Hatch
        event.recipes.gtceu.assembler(id('hv_energy_input_hatch_64a'))
            .itemInputs(
                'gtceu:hv_transformer_16a',
                'gtceu:hv_energy_input_hatch_16a',
                '2x gtceu:gold_hex_wire',
                '3x gtceu:hv_voltage_coil',
                '6x gtceu:stainless_steel_plate'
            )
            .inputFluids('gtceu:soldering_alloy 432')
            .itemOutputs('gtceu:hv_energy_input_hatch_64a')
            .duration(400)
            .EUt(GTValues.VA[GTValues.HV]);

        event.shaped('gtceu:hv_energy_input_hatch_64a', [
            'WTW',
            'CHC',
            'PPP'
        ], {
            W: 'gtceu:gold_hex_wire',
            T: 'gtceu:hv_transformer_16a',
            C: 'gtceu:hv_voltage_coil',
            H: 'gtceu:hv_energy_input_hatch_16a',
            P: 'gtceu:stainless_steel_plate'
        });

        // HV 64A Energy Output Hatch (Dynamo)
        event.recipes.gtceu.assembler(id('hv_energy_output_hatch_64a'))
            .itemInputs(
                'gtceu:hv_transformer_16a',
                'gtceu:hv_energy_output_hatch',
                '2x gtceu:gold_hex_wire',
                '3x gtceu:hv_voltage_coil',
                '6x gtceu:stainless_steel_plate'
            )
            .inputFluids('gtceu:soldering_alloy 432')
            .itemOutputs('gtceu:hv_energy_output_hatch_64a')
            .duration(400)
            .EUt(GTValues.VA[GTValues.HV]);

        event.shaped('gtceu:hv_energy_output_hatch_64a', [
            'WTW',
            'CHC',
            'PPP'
        ], {
            W: 'gtceu:gold_hex_wire',
            T: 'gtceu:hv_transformer_16a',
            C: 'gtceu:hv_voltage_coil',
            H: 'gtceu:hv_energy_output_hatch',
            P: 'gtceu:stainless_steel_plate'
        });

});