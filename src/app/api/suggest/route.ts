import { NextResponse } from "next/server";
import { getInventory } from "@/lib/inventory-store";
import { getRecipeSuggestions } from "@/lib/ai-service";

export async function POST() {
    try {
        const inventory = await getInventory();
        const itemNames = inventory.map((item) => item.name);

        if (itemNames.length === 0) {
            return NextResponse.json({ suggestions: [] });
        }

        const suggestions = await getRecipeSuggestions(itemNames);
        return NextResponse.json(suggestions);
    } catch (e) {
        console.error("AI bridge failed:", e);
        return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 });
    }
}
