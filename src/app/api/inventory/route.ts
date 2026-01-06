import { NextRequest, NextResponse } from "next/server";
import { getInventory, addInventoryItem, removeInventoryItem } from "@/lib/inventory-store";

export async function GET() {
    const items = await getInventory();
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.name || !body.quantity) {
            return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 });
        }
        const newItem = await addInventoryItem(body);
        return NextResponse.json(newItem);
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        await removeInventoryItem(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
