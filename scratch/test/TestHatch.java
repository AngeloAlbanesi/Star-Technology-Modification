import java.lang.reflect.Method;

public class TestHatch {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("com.gregtechceu.gtceu.common.machine.multiblock.part.FluidHatchPartMachine");
        Method m = clazz.getMethod("getTankCapacity", int.class, int.class);
        
        int[] tiers = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14};
        String[] names = {"ULV", "LV", "MV", "HV", "EV", "IV", "LuV", "ZPM", "UV", "UHV", "UEV", "UIV", "UXV", "OpV", "MAX"};
        
        System.out.println("=== 4x Hatch Capacity Test ===");
        for (int i = 0; i < tiers.length; i++) {
            int cap = (Integer) m.invoke(null, 2000, tiers[i]);
            System.out.printf("%-4s (Tier %2d): %12d mB (%8d B) per slot (Total 4x: %12d mB)%n", 
                names[i], tiers[i], cap, cap / 1000, (long)cap * 4);
        }

        System.out.println("\n=== 1x Hatch Capacity Test (Unchanged) ===");
        for (int i = 1; i <= 5; i++) {
            int cap = (Integer) m.invoke(null, 8000, tiers[i]);
            System.out.printf("%-4s (Tier %2d): %12d mB (%8d B)%n", names[i], tiers[i], cap, cap / 1000);
        }

        System.out.println("\n=== 9x Hatch Capacity Test (Unchanged) ===");
        for (int i = 4; i <= 8; i++) {
            int cap = (Integer) m.invoke(null, 1000, tiers[i]);
            System.out.printf("%-4s (Tier %2d): %12d mB (%8d B)%n", names[i], tiers[i], cap, cap / 1000);
        }
    }
}
