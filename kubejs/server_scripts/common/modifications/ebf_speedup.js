// priority: -10000

ServerEvents.recipes(event => {
    let count = 0;
    let processed = new Set();

    const speedup = (recipe) => {
        if (!recipe) return;

        let recipeId = null;
        try {
            recipeId = recipe.getId() ? String(recipe.getId()) : null;
        } catch (e) {}

        if (recipeId && processed.has(recipeId)) {
            return;
        }

        let dur = null;

        // 1. Prova a leggere la durata dal JSON della ricetta
        if (recipe.json && recipe.json.has('duration')) {
            try {
                dur = recipe.json.get('duration').getAsLong();
            } catch (e) {}
        }

        // 2. Fallback: leggi tramite il metodo get('duration') di KubeJS
        if ((dur == null || dur <= 0) && recipe.get) {
            try {
                dur = recipe.get('duration');
            } catch (e) {}
        }

        // 3. Fallback: leggi dall'istanza originale della ricetta
        if (dur == null || dur <= 0) {
            try {
                let orig = recipe.getOriginalRecipe();
                if (orig && orig.duration !== undefined) {
                    dur = orig.duration;
                }
            } catch (e) {}
        }

        if (dur != null && dur > 0) {
            let newDur = Math.max(1, Math.floor(dur / 10));

            // Aggiorna il JSON della ricetta
            if (recipe.json) {
                try {
                    recipe.json.addProperty('duration', newDur);
                } catch (e) {}
            }

            // Aggiorna il valore nel componente KubeJS
            if (recipe.set) {
                try {
                    recipe.set('duration', newDur);
                } catch (e) {}
            }

            // Salva la ricetta come modificata
            if (recipe.save) {
                try {
                    recipe.save();
                } catch (e) {}
            }

            // Se l'oggetto Java GTRecipe è già istanziato, aggiorna direttamente il campo duration
            try {
                let orig = recipe.getOriginalRecipe();
                if (orig && orig.duration !== undefined) {
                    orig.duration = newDur;
                }
            } catch (e) {}

            if (recipeId) {
                processed.add(recipeId);
            }
            count++;
        }
    };

    // Velocizza tutte le ricette EBF caricate (GTCEu / datapack / mod)
    event.forEachRecipe({ type: 'gtceu:electric_blast_furnace' }, recipe => {
        speedup(recipe);
    });

    // Velocizza eventuali ricette EBF create da altri script KubeJS
    if (event.addedRecipes) {
        event.addedRecipes.forEach(recipe => {
            try {
                if (recipe.getType && recipe.getType().toString() === 'gtceu:electric_blast_furnace') {
                    speedup(recipe);
                }
            } catch (e) {}
        });
    }

    console.info(`[KubeJS EBF Speedup] Velocizzate con successo ${count} ricette della EBF (durata divisa per 10).`);
});
