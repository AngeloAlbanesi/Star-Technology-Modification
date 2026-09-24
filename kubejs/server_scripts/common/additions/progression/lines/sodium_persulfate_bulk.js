ServerEvents.recipes(event => {
    const id = global.id;

    event.recipes.gtceu.large_chemical_reactor(id('sodium_persulfate_bulk'))
        .itemInputs('40x gtceu:sodium_dust', '40x gtceu:sulfur_dust')
        .inputFluids('gtceu:oxygen 16000')
        .outputFluids('gtceu:sodium_persulfate 50000')
        .duration(2400)
        .EUt(GTValues.VHA[GTValues.EV]);
});
