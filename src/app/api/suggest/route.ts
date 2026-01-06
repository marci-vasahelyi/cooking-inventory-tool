import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getRecipeSuggestions } from "@/lib/ai-service";

export async function POST() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const inventory = await prisma.inventoryItem.findMany({
            where: { clientId: user.id },
            select: { name: true }
        });
        const itemNames = inventory.map((item: { name: string }) => item.name);

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
