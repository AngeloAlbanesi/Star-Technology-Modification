ServerEvents.recipes(event => {
    const id = global.id;

    // HV Parallel Control Hatch (8 Parallels)
    event.shaped('gtceu:hv_parallel_hatch', [
        'SCE',
        'CHC',
        'BCB'
    ], {
        S: 'gtceu:hv_sensor',
        E: 'gtceu:hv_emitter',
        C: '#gtceu:circuits/hv',
        H: 'gtceu:hv_machine_hull',
        B: 'gtceu:gold_double_cable'
    }).id('start:shaped/hv_parallel_hatch');

    event.recipes.gtceu.assembler(id('hv_parallel_hatch'))
        .itemInputs(
            'gtceu:hv_machine_hull',
            'gtceu:hv_sensor',
            'gtceu:hv_emitter',
            '4x #gtceu:circuits/hv',
            '2x gtceu:gold_double_cable'
        )
        .inputFluids('gtceu:soldering_alloy 144')
        .itemOutputs('gtceu:hv_parallel_hatch')
        .duration(200)
        .EUt(GTValues.VA[GTValues.HV]);

    // EV Parallel Control Hatch (16 Parallels)
    event.shaped('gtceu:ev_parallel_hatch', [
        'SCE',
        'CHC',
        'BCB'
    ], {
        S: 'gtceu:ev_sensor',
        E: 'gtceu:ev_emitter',
        C: '#gtceu:circuits/ev',
        H: 'gtceu:ev_machine_hull',
        B: 'gtceu:aluminium_double_cable'
    }).id('start:shaped/ev_parallel_hatch');

    event.recipes.gtceu.assembler(id('ev_parallel_hatch'))
        .itemInputs(
            'gtceu:ev_machine_hull',
            'gtceu:ev_sensor',
            'gtceu:ev_emitter',
            '4x #gtceu:circuits/ev',
            '2x gtceu:aluminium_double_cable'
        )
        .inputFluids('gtceu:soldering_alloy 144')
        .itemOutputs('gtceu:ev_parallel_hatch')
        .duration(200)
        .EUt(GTValues.VA[GTValues.EV]);
});
