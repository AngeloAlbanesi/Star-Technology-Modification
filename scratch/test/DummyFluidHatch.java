package com.gregtechceu.gtceu.common.machine.multiblock.part;

public class DummyFluidHatch {
    public static int getTankCapacity(int initialCapacity, int tier) {
        if (initialCapacity == 2000 && tier >= 4) {
            return 250000 * (1 << Math.min(12, tier - 4));
        }
        return initialCapacity * (1 << Math.min(9, tier));
    }
}
