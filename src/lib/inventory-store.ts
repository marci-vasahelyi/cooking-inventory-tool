export interface InventoryItem {
    id: string;
    name: string;
    quantity: string;
}

// Mock persistence in memory (resets on server restart)
let inventory: InventoryItem[] = [
    { id: "1", name: "Eggs", quantity: "6 pcs" },
    { id: "2", name: "Milk", quantity: "1 L" },
    { id: "3", name: "Flour", quantity: "500g" },
];

export async function getInventory(): Promise<InventoryItem[]> {
    return inventory;
}

export async function addInventoryItem(item: Omit<InventoryItem, "id">): Promise<InventoryItem> {
    const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
    inventory.push(newItem);
    return newItem;
}

export async function removeInventoryItem(id: string): Promise<void> {
    inventory = inventory.filter((item) => item.id !== id);
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) return null;
    inventory[index] = { ...inventory[index], ...updates };
    return inventory[index];
}
