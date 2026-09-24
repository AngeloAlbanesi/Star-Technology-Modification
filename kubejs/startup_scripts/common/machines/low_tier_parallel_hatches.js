// priority: 100

GTCEuStartupEvents.registry('gtceu:machine', event => {
    const $ParallelHatchPartMachine = Java.loadClass('com.gregtechceu.gtceu.common.machine.multiblock.part.ParallelHatchPartMachine');
    const $PartAbility = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.PartAbility');
    const $GTMachineModelProperties = Java.loadClass('com.gregtechceu.gtceu.api.machine.property.GTMachineModelProperties');
    const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');

    event.create('parallel_hatch', 'custom')
        .machine((holder, tier) => new $ParallelHatchPartMachine(holder, tier))
        .tiers(GTValues.HV, GTValues.EV)
        .definition((tier, builder) => {
            var isHV = tier === GTValues.HV;
            builder
                .langValue(isHV ? 'HV Parallel Control Hatch' : 'EV Parallel Control Hatch')
                .rotationState(RotationState.ALL)
                .abilities($PartAbility.PARALLEL_HATCH)
                .modelPropertyBool($GTMachineModelProperties.IS_FORMED, false)
                .workableTieredHullModel(new $ResourceLocation('gtceu', 'block/machines/parallel_hatch_mk1'))
                .tooltips([
                    Component.translatable('gtceu.machine.parallel_hatch.display'),
                    Component.translatable(isHV ? 'gtceu.machine.parallel_hatch_hv.tooltip' : 'gtceu.machine.parallel_hatch_ev.tooltip')
                ]);
        });
});
