GTCEuStartupEvents.registry('gtceu:recipe_type', event => {

    // Large Rock Crusher Recipe Type
    event.create('large_rock_crusher')
        .category('resource_production')
        .setEUIO('in')
        .setMaxIOSize(1, 1, 2, 0)
        .setProgressBar(GuiTextures.PROGRESS_BAR_MACERATE, FillDirection.LEFT_TO_RIGHT)
        .setSound(GTSoundEntries.FORGE_HAMMER);

});

GTCEuStartupEvents.registry('gtceu:machine', event => {
    const $StarTPartAbility = Java.loadClass('com.startechnology.start_core.machine.StarTPartAbility');
    const $PartAbility = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.PartAbility');
    const PartAbility = $PartAbility;

    const largeCube = (type, casing) => {
        event.create(`t_large_${type}`, 'multiblock')
            .rotationState(RotationState.NON_Y_AXIS)
            .tooltips([ 
                Text.translate("block.start_core.gap")
            ])
            .recipeType(type)
            .recipeModifiers([GTRecipeModifiers.PARALLEL_HATCH, GTRecipeModifiers.OC_PERFECT, GTRecipeModifiers.BATCH_MODE])
            .appearanceBlock(() => Block.getBlock(`kubejs:${casing}_casing`))
            .pattern(definition => FactoryBlockPattern.start()
                .aisle('CCC', 'CCC', 'CCC')
                .aisle('CCC', 'C C', 'CCC')
                .aisle('CCC', 'CKC', 'CCC')
                .where('K', Predicates.controller(Predicates.blocks(definition.get())))
                .where('C', Predicates.blocks(`kubejs:${casing}_casing`).setMinGlobalLimited(5)
                    .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))
                    .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                    .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1)))
                .where(' ', Predicates.air())
                .build())
            .workableCasingModel(`kubejs:block/casings/large_cubes/${casing}_casing`,
                `gtceu:block/machines/${type}`);
    }

    // Generic Cubes
    largeCube('bender', 'birmabright');
    largeCube('centrifuge', 'tumbaga');
    largeCube('electrolyzer', 'duralumin');
    largeCube('extruder', 'beryllium_aluminium_alloy');
    largeCube('forming_press', 'elgiloy');
    largeCube('lathe', 'beryllium_bronze');
    largeCube('macerator', 'blue_steel');
    largeCube('mixer', 'kovar');
    largeCube('ore_washer', 'hydronalium');
    largeCube('sifter', 'zamak');
    largeCube('thermal_centrifuge', 'silicon_bronze');
    largeCube('wiremill', 'sterling_silver');
    largeCube('autoclave', 'silicone_rubber');
    largeCube('pulverizer', 'galvanized_steel');
    largeCube('arc_furnace', 'black_steel');
    largeCube('electromagnetic_separator', 'manganin');

    // Large Rock Crusher
    event.create('large_rock_crusher', 'multiblock')
        .rotationState(RotationState.NON_Y_AXIS)
        .recipeType('large_rock_crusher')
        .recipeModifiers([GTRecipeModifiers.PARALLEL_HATCH, GTRecipeModifiers.OC_PERFECT, GTRecipeModifiers.BATCH_MODE])
        .appearanceBlock(() => Block.getBlock('kubejs:red_steel_casing'))
        .pattern(definition => FactoryBlockPattern.start()
            .aisle('CCC', 'CCC', 'CCC')
            .aisle('CCC', 'C C', 'CCC')
            .aisle('CCC', 'CKC', 'CCC')
            .where('K', Predicates.controller(Predicates.blocks(definition.get())))
            .where('C', Predicates.blocks('kubejs:red_steel_casing').setMinGlobalLimited(5)
                .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))
                .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))
                .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1)))
            .where(' ', Predicates.air())
            .build())
        .workableCasingModel('kubejs:block/casings/large_cubes/red_steel_casing',
            'gtceu:block/machines/rock_crusher');
});