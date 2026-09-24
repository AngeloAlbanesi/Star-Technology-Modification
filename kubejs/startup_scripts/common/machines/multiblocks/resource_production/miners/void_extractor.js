GTCEuStartupEvents.registry('gtceu:recipe_type', event => {

    event.create('void_excavation')
        .category('resource_production')
        .setMaxIOSize(0, 6, 1, 2)
        .setProgressBar(GuiTextures.PROGRESS_BAR_EXTRACT, FillDirection.LEFT_TO_RIGHT)
        .setSound(GTSoundEntries.MINER);

});

GTCEuStartupEvents.registry('gtceu:machine', event => {
    const $StarTPartAbility = Java.loadClass('com.startechnology.start_core.machine.StarTPartAbility');

    event.create('void_extractor', 'multiblock')
        .rotationState(RotationState.NON_Y_AXIS)
        .tooltips([ 
            Text.translate("block.start_core.gap")
        ])
        .recipeType('void_excavation')
        .recipeModifiers([GTRecipeModifiers.PARALLEL_HATCH, GTRecipeModifiers.OC_NON_PERFECT, GTRecipeModifiers.BATCH_MODE])
        .appearanceBlock(GTBlocks.CASING_STEEL_SOLID)
        .pattern(definition => FactoryBlockPattern.start()
            .aisle('SSS', ' F ', ' F ', '   ', '   ', '   ')
            .aisle('SSS', 'FGF', 'FGF', ' F ', ' F ', ' F ')
            .aisle('SCS', ' F ', ' F ', '   ', '   ', '   ')
            .where('C', Predicates.controller(Predicates.blocks(definition.get())))
            .where('S', Predicates.blocks('gtceu:solid_machine_casing')
                .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setMaxGlobalLimited(1).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setMaxGlobalLimited(2).setPreviewCount(2))
                .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setMaxGlobalLimited(2).setPreviewCount(2))
                .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMaxGlobalLimited(2).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1)))
            .where('F', Predicates.blocks('gtceu:steel_frame'))
            .where('G', Predicates.blocks('gtceu:steel_gearbox'))
            .where(' ', Predicates.any())
            .build())
        .workableCasingModel('gtceu:block/casings/solid/machine_casing_solid_steel',
            'gtceu:block/multiblock/large_miner');

});