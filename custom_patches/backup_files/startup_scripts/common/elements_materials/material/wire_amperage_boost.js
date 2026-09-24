// priority: -100

/**
 * Boosts base amperage for all GregTech CEu wire/cable materials.
 * This allows wires and cables to carry high amperages (64A, 256A, 1024A, 4096A, etc.)
 * without overheating or burning, while keeping their voltage tier mechanics intact.
 */
GTCEuStartupEvents.materialModification(event => {
    let materials = $GTCEuAPI.materialManager.getRegisteredMaterials();
    let count = 0;

    materials.forEach(material => {
        if (material.hasProperty($PropertyKey.WIRE)) {
            let wireProp = material.getProperty($PropertyKey.WIRE);
            if (wireProp) {
                // GT default base amperage is 1 (or 2/4 for certain superconductors).
                // Setting base amperage multiplier to 65536:
                // - 1x cable: 65,536 A
                // - 2x cable: 131,072 A
                // - 4x cable: 262,144 A
                // - 8x cable: 524,288 A
                // - 16x cable: 1,048,576 A
                // This ensures all wires support high-amp hatches and converters safely.
                let currentAmperage = wireProp.getAmperage();
                let newAmperage = Math.max(currentAmperage * 65536, 65536);
                wireProp.setAmperage(newAmperage);
                count++;
            }
        }
    });

    console.info(`[Star Technology] Successfully upgraded amperage for ${count} GregTech wire materials!`);
});
