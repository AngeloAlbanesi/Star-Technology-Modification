// priority: 100

GTCEuStartupEvents.registry('gtceu:machine', event => {
    var $GTMultiMachines = Java.loadClass('com.gregtechceu.gtceu.common.data.machines.GTMultiMachines');
    var $GTRecipeModifiers = Java.loadClass('com.gregtechceu.gtceu.common.data.GTRecipeModifiers');
    var $RecipeModifierList = Java.loadClass('com.gregtechceu.gtceu.api.recipe.modifier.RecipeModifierList');
    var $GTBlocks = Java.loadClass('com.gregtechceu.gtceu.common.data.GTBlocks');
    var $PartAbility = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.PartAbility');
    var $StarTPartAbility = Java.loadClass('com.startechnology.start_core.machine.StarTPartAbility');
    var $RelativeDirection = Java.loadClass('com.gregtechceu.gtceu.api.pattern.util.RelativeDirection');
    var PartAbility = $PartAbility;

    // 1. Unlock Parallel Hatch on Electric Blast Furnace (EBF)
    try {
        var machineEbf = $GTMultiMachines.ELECTRIC_BLAST_FURNACE;
        if (machineEbf) {
            machineEbf.setRecipeModifier(new $RecipeModifierList([
                $GTRecipeModifiers.PARALLEL_HATCH,
                $GTRecipeModifiers.EBF_OVERCLOCK,
                $GTRecipeModifiers.BATCH_MODE
            ]));

            machineEbf.setPatternFactory(() => FactoryBlockPattern.start()
                .aisle('XXX', 'CCC', 'CCC', 'XXX')
                .aisle('XXX', 'C#C', 'C#C', 'XMX')
                .aisle('XSX', 'CCC', 'CCC', 'XXX')
                .where('S', Predicates.controller(Predicates.blocks(machineEbf.getBlock())))
                .where('X', Predicates.blocks($GTBlocks.CASING_INVAR_HEATPROOF.get()).setMinGlobalLimited(3)
                    .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setMaxGlobalLimited(1))
                    .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                    .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1)))
                .where('M', Predicates.abilities(PartAbility.MUFFLER))
                .where('C', Predicates.heatingCoils())
                .where('#', Predicates.air())
                .build()
            );
        }
    } catch (e) {
        console.error("Failed to unlock Parallel Hatch on EBF: " + e);
    }

    // 1b. Support Absolute Parallel Hatch on Mega Blast Furnace (RHF)
    try {
        var machineMbf = null;
        if (typeof GCYMMachines !== 'undefined' && GCYMMachines.MEGA_BLAST_FURNACE) {
            machineMbf = GCYMMachines.MEGA_BLAST_FURNACE;
        } else {
            var gCls = Java.loadClass('com.gregtechceu.gtceu.common.data.machines.GCYMMachines');
            if (gCls && gCls.MEGA_BLAST_FURNACE) {
                machineMbf = gCls.MEGA_BLAST_FURNACE;
            }
        }
        if (machineMbf) {
            var origMbfFactory = machineMbf.getPatternFactory();
            if (origMbfFactory) {
                machineMbf.setPatternFactory(() => {
                    var pattern = origMbfFactory.get();
                    try {
                        var fBlockMatches = pattern.getClass().getDeclaredField("blockMatches");
                        fBlockMatches.setAccessible(true);
                        var matches = fBlockMatches.get(pattern);
                        var absPred = Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1);
                        var patched = false;
                        for (var i = 0; i < matches.length; i++) {
                            for (var j = 0; j < matches[i].length; j++) {
                                for (var k = 0; k < matches[i][j].length; k++) {
                                    var tp = matches[i][j][k];
                                    if (tp && tp.limited) {
                                        for (var l = 0; l < tp.limited.size(); l++) {
                                            var sp = tp.limited.get(l);
                                            if (sp && sp.getCandidates) {
                                                var cands = sp.getCandidates();
                                                for (var c = 0; c < cands.size(); c++) {
                                                    var cand = cands.get(c);
                                                    if (cand && cand.getDescriptionId && cand.getDescriptionId().contains("parallel_hatch")) {
                                                        tp.limited.addAll(absPred.limited);
                                                        tp.common.addAll(absPred.common);
                                                        patched = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (patched) break;
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Failed to inject ABSOLUTE_PARALLEL_HATCH into Mega Blast Furnace: " + err);
                    }
                    return pattern;
                });
            }
        }
    } catch (e) {
        console.error("Failed to setup Mega Blast Furnace parallel support: " + e);
    }

    // 2. Unlock Parallel Hatch on Large Chemical Reactor (LCR)
    try {
        var machineLcr = $GTMultiMachines.LARGE_CHEMICAL_REACTOR;
        if (machineLcr) {
            machineLcr.setRecipeModifier(new $RecipeModifierList([
                $GTRecipeModifiers.DEFAULT_ENVIRONMENT_REQUIREMENT,
                $GTRecipeModifiers.PARALLEL_HATCH,
                $GTRecipeModifiers.CHEMICAL_REACTOR_OVERCLOCK,
                $GTRecipeModifiers.BATCH_MODE
            ]));

            machineLcr.setPatternFactory(() => {
                var casingPredicate = Predicates.blocks($GTBlocks.CASING_PTFE_INERT.get()).setMinGlobalLimited(10);
                var abilitiesPredicate = Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1)
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))
                    .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                    .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1));

                return FactoryBlockPattern.start()
                    .aisle('XXX', 'XCX', 'XXX')
                    .aisle('XCX', 'CPC', 'XCX')
                    .aisle('XXX', 'XSX', 'XXX')
                    .where('S', Predicates.controller(Predicates.blocks(machineLcr.getBlock())))
                    .where('X', casingPredicate.or(abilitiesPredicate))
                    .where('P', Predicates.blocks($GTBlocks.CASING_POLYTETRAFLUOROETHYLENE_PIPE.get()))
                    .where('C', Predicates.heatingCoils().setExactLimit(1).or(abilitiesPredicate).or(casingPredicate))
                    .build();
            });
        }
    } catch (e) {
        console.error("Failed to unlock Parallel Hatch on LCR: " + e);
    }

    // 3. Unlock Parallel Hatch on Vacuum Freezer (VF)
    try {
        var machineVf = $GTMultiMachines.VACUUM_FREEZER;
        if (machineVf) {
            machineVf.setRecipeModifier(new $RecipeModifierList([
                $GTRecipeModifiers.PARALLEL_HATCH,
                $GTRecipeModifiers.OC_NON_PERFECT_SUBTICK,
                $GTRecipeModifiers.BATCH_MODE
            ]));

            machineVf.setPatternFactory(() => FactoryBlockPattern.start()
                .aisle('XXX', 'XXX', 'XXX')
                .aisle('XXX', 'X#X', 'XXX')
                .aisle('XXX', 'XSX', 'XXX')
                .where('S', Predicates.controller(Predicates.blocks(machineVf.getBlock())))
                .where('X', Predicates.blocks($GTBlocks.CASING_ALUMINIUM_FROSTPROOF.get()).setMinGlobalLimited(14)
                    .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))
                    .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))
                    .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1)))
                .where('#', Predicates.air())
                .build()
            );
        }
    } catch (e) {
        console.error("Failed to unlock Parallel Hatch on Vacuum Freezer: " + e);
    }

    // 4. Unlock Parallel Hatch on Distillation Tower (DT)
    try {
        var machineDt = $GTMultiMachines.DISTILLATION_TOWER;
        if (machineDt) {
            machineDt.setRecipeModifier(new $RecipeModifierList([
                $GTRecipeModifiers.PARALLEL_HATCH,
                $GTRecipeModifiers.OC_NON_PERFECT_SUBTICK,
                $GTRecipeModifiers.BATCH_MODE
            ]));

            machineDt.setPatternFactory(() => {
                var exportFluids = Predicates.abilities(PartAbility.EXPORT_FLUIDS_1X);
                var gtaeMachines = null;
                try {
                    gtaeMachines = Java.loadClass('com.gregtechceu.gtceu.common.data.machines.GTAEMachines');
                } catch (e) {}
                if (gtaeMachines && gtaeMachines.FLUID_EXPORT_HATCH_ME) {
                    exportFluids = exportFluids.or(Predicates.blocks(gtaeMachines.FLUID_EXPORT_HATCH_ME.get()));
                }
                exportFluids.setMaxLayerLimited(1);

                var maintenance = Predicates.abilities(PartAbility.MAINTENANCE).setMaxGlobalLimited(1);
                var parallel = Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1)
                    .or(Predicates.abilities($StarTPartAbility.ABSOLUTE_PARALLEL_HATCH).setMaxGlobalLimited(1));

                var casing = Predicates.blocks($GTBlocks.CASING_STAINLESS_CLEAN.get());

                return FactoryBlockPattern.start($RelativeDirection.RIGHT, $RelativeDirection.BACK, $RelativeDirection.UP)
                    .aisle('YSY', 'YYY', 'YYY')
                    .aisle('ZZZ', 'Z#Z', 'ZZZ')
                    .aisle('XXX', 'X#X', 'XXX').setRepeatable(0, 10)
                    .aisle('XXX', 'XXX', 'XXX')
                    .where('S', Predicates.controller(Predicates.blocks(machineDt.getBlock())))
                    .where('Y', casing
                        .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setMaxGlobalLimited(1))
                        .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2))
                        .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setExactLimit(1))
                        .or(maintenance)
                        .or(parallel))
                    .where('Z', casing
                        .or(exportFluids)
                        .or(maintenance)
                        .or(parallel))
                    .where('X', casing
                        .or(exportFluids)
                        .or(parallel))
                    .where('#', Predicates.air())
                    .build();
            });
        }
    } catch (e) {
        console.error("Failed to unlock Parallel Hatch on Distillation Tower: " + e);
    }
});


