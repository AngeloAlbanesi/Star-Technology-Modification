GTCEuStartupEvents.registry('gtceu:machine', event => {
    // 64A Energy Input Hatch
    event.create('energy_input_hatch_64a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 64))
        .tiers(GTValues.HV, GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 64A Energy Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_16A, PartAbility.INPUT_ENERGY_4A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_64a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 64),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 64))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });

    // 64A Energy Output Hatch (Dynamo)
    event.create('energy_output_hatch_64a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.OUT, 64))
        .tiers(GTValues.HV, GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 64A Dynamo Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.OUTPUT_ENERGY, PartAbility.OUTPUT_ENERGY_16A, PartAbility.OUTPUT_ENERGY_4A, PartAbility.OUTPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_output_hatch_64a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_out', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_out', 64),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 64))),
                    Component.translatable('gtceu.machine.energy_hatch.output_hi_amp.tooltip')
                ]);
        });

    // 256A Energy Input Hatch
    event.create('energy_input_hatch_256a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 256))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 256A Energy Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_16A, PartAbility.INPUT_ENERGY_4A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_256a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 256),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 256))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });

    // 256A Energy Output Hatch (Dynamo)
    event.create('energy_output_hatch_256a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.OUT, 256))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 256A Dynamo Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.OUTPUT_ENERGY, PartAbility.OUTPUT_ENERGY_16A, PartAbility.OUTPUT_ENERGY_4A, PartAbility.OUTPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_output_hatch_256a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_out', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_out', 256),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 256))),
                    Component.translatable('gtceu.machine.energy_hatch.output_hi_amp.tooltip')
                ]);
        });

    // 1024A Energy Input Hatch
    event.create('energy_input_hatch_1024a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 1024))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 1024A Energy Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_16A, PartAbility.INPUT_ENERGY_4A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_1024a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 1024),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 1024))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });

    // 1024A Energy Output Hatch (Dynamo)
    event.create('energy_output_hatch_1024a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.OUT, 1024))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 1024A Dynamo Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.OUTPUT_ENERGY, PartAbility.OUTPUT_ENERGY_16A, PartAbility.OUTPUT_ENERGY_4A, PartAbility.OUTPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_output_hatch_1024a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_out', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_out', 1024),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 1024))),
                    Component.translatable('gtceu.machine.energy_hatch.output_hi_amp.tooltip')
                ]);
        });

    // 4096A Energy Input Hatch
    event.create('energy_input_hatch_4096a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 4096))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 4096A Energy Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_16A, PartAbility.INPUT_ENERGY_4A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_4096a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 4096),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 4096))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });

    // 4096A Energy Output Hatch (Dynamo)
    event.create('energy_output_hatch_4096a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.OUT, 4096))
        .tiers(GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 4096A Dynamo Hatch`)
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.OUTPUT_ENERGY, PartAbility.OUTPUT_ENERGY_16A, PartAbility.OUTPUT_ENERGY_4A, PartAbility.OUTPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_output_hatch_4096a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_out', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_out', 4096),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 4096))),
                    Component.translatable('gtceu.machine.energy_hatch.output_hi_amp.tooltip')
                ]);
        });
});
