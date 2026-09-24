GTCEuStartupEvents.registry('gtceu:machine', event => {
    event.create('fluid_input','custom')
        .machine((holder, tier) => new $FluidHatchPartMachine(holder, tier, 'in', 2000, 1))   
        .tiers(GTValues.ULV)
        .definition((tier, builder) => {
            builder
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                .workableCasingModel('gtceu:block/casings/gcym/industrial_steam_casing', 'gtceu:block/multiblock/tank_valve') // cannot be done with current model system
            });

    event.create('stabilization_module', 'custom')
        .machine((holder,tier) => new $CleaningMaintenanceHatchPartMachine(holder, CleanroomType.getByName('stabilized')))
        .tiers(GTValues.UHV)
        .definition((tier, builder) => {
            builder
                .langValue('§bAbsolute Stabilization §rModule')
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.MAINTENANCE)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                .workableTieredHullModel('kubejs:block/machines/stabilization_core')
            });

    event.create('energy_input_hatch_16a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 16))
        .tiers(GTValues.HV)
        .definition((tier, builder) => {
            builder
                .langValue('§6HV 16A Energy Hatch')
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_16A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_16a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 16),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 16))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });

    event.create('energy_input_hatch_4a', 'custom')
        .machine((holder, tier) => new $EnergyHatchPartMachine(holder, tier, $IO.IN, 4))
        .tiers(GTValues.HV)
        .definition((tier, builder) => {
            builder
                .langValue('§6HV 4A Energy Hatch')
                .rotationState(RotationState.ALL)
                .abilities(PartAbility.INPUT_ENERGY, PartAbility.INPUT_ENERGY_4A, PartAbility.INPUT_ENERGY_2A)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                ['overlayTieredHullModel(java.lang.String)']('energy_input_hatch_4a')
                .tooltips([
                    Component.translatable('gtceu.universal.tooltip.voltage_in', $FormattingUtil.formatNumbers(GTValues.V[tier]), GTValues.VNF[tier]),
                    Component.translatable('gtceu.universal.tooltip.amperage_in', 4),
                    Component.translatable('gtceu.universal.tooltip.energy_storage_capacity', $FormattingUtil.formatNumbers($EnergyHatchPartMachine.getHatchEnergyCapacity(tier, 4))),
                    Component.translatable('gtceu.machine.energy_hatch.input_hi_amp.tooltip')
                ]);
        });
});
