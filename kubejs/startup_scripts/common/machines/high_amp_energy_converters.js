GTCEuStartupEvents.registry('gtceu:machine', event => {
    function getConverterTooltips(tier, amperage) {
        return [
            Component.translatable('gtceu.machine.energy_converter.description'),
            Component.translatable('gtceu.machine.energy_converter.tooltip_tool_usage'),
            Component.translatable(
                'gtceu.machine.energy_converter.tooltip_conversion_native',
                $FeCompat.toFeLong(GTValues.V[tier] * amperage, $FeCompat.ratio(true)),
                amperage,
                GTValues.V[tier],
                GTValues.VNF[tier]
            ),
            Component.translatable(
                'gtceu.machine.energy_converter.tooltip_conversion_eu',
                amperage,
                GTValues.V[tier],
                GTValues.VNF[tier],
                $FeCompat.toFeLong(GTValues.V[tier] * amperage, $FeCompat.ratio(false))
            )
        ];
    }

    let noopBlockModel = (ctx, prov) => {};
    try {
        let clazz = Java.loadClass('com.tterrag.registrate.util.nullness.NonNullBiConsumer');
        if (clazz && clazz.noop) {
            noopBlockModel = clazz.noop();
        }
    } catch (e) {}

    // 64A Energy Converter for HV (EV to MAX already exist in start_core)
    event.create('64a_energy_converter', 'custom')
        .addDefaultModel(false)
        .machine((holder, tier) => new $ConverterMachine(holder, tier, 64))
        .tiers(GTValues.HV)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 64§eA§r Energy Converter`)
                .rotationState(RotationState.ALL)
                .modelPropertyBool($GTMachineModelProperties.IS_FE_TO_EU, true)
                .blockModel(noopBlockModel)
                .tooltips(getConverterTooltips(tier, 64));
        });

    // 256A Energy Converter
    event.create('256a_energy_converter', 'custom')
        .addDefaultModel(false)
        .machine((holder, tier) => new $ConverterMachine(holder, tier, 256))
        .tiers(GTValues.HV, GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 256§eA§r Energy Converter`)
                .rotationState(RotationState.ALL)
                .modelPropertyBool($GTMachineModelProperties.IS_FE_TO_EU, true)
                .blockModel(noopBlockModel)
                .tooltips(getConverterTooltips(tier, 256));
        });

    // 1024A Energy Converter
    event.create('1024a_energy_converter', 'custom')
        .addDefaultModel(false)
        .machine((holder, tier) => new $ConverterMachine(holder, tier, 1024))
        .tiers(GTValues.HV, GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 1024§eA§r Energy Converter`)
                .rotationState(RotationState.ALL)
                .modelPropertyBool($GTMachineModelProperties.IS_FE_TO_EU, true)
                .blockModel(noopBlockModel)
                .tooltips(getConverterTooltips(tier, 1024));
        });

    // 4096A Energy Converter
    event.create('4096a_energy_converter', 'custom')
        .addDefaultModel(false)
        .machine((holder, tier) => new $ConverterMachine(holder, tier, 4096))
        .tiers(GTValues.HV, GTValues.EV, GTValues.IV, GTValues.LuV, GTValues.ZPM, GTValues.UV, GTValues.UHV, GTValues.UEV, GTValues.UIV, GTValues.UXV, GTValues.OpV, GTValues.MAX)
        .definition((tier, builder) => {
            builder
                .langValue(`${GTValues.VNF[tier]} 4096§eA§r Energy Converter`)
                .rotationState(RotationState.ALL)
                .modelPropertyBool($GTMachineModelProperties.IS_FE_TO_EU, true)
                .blockModel(noopBlockModel)
                .tooltips(getConverterTooltips(tier, 4096));
        });
});
