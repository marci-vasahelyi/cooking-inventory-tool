import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("API GET /inventory: Unauthorized (No User)");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log(`API GET /inventory: Fetching for user ${user.id}`);
        const items = await prisma.inventoryItem.findMany({
            where: { clientId: user.id },
        });
        console.log(`API GET /inventory: Found ${items.length} items`);
        return NextResponse.json(items);
    } catch (e) {
        console.error("API GET /inventory: DB Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        if (!body.name || !body.quantity) {
            return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 });
        }

        const newItem = await prisma.inventoryItem.create({
            data: {
                name: body.name,
                quantity: body.quantity,
                clientId: user.id,
            }
        });
        return NextResponse.json(newItem);
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Ensure the user owns the item before deleting
        const count = await prisma.inventoryItem.count({
            where: {
                id: id,
                clientId: user.id
            }
        });

        if (count === 0) {
            return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
        }

        await prisma.inventoryItem.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
