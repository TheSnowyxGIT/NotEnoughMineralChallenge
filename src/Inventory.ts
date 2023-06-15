export class Inventory<Enum extends string> {
    private readonly inventory: Record<Enum, number>;

    static multiply<Enum extends string>(inventory: Inventory<Enum>, multiplier: number): Inventory<Enum> {
        const multipliedInventory = new Inventory<Enum>();
        for (const key of inventory.getKeyList()) {
            multipliedInventory.set(key, inventory.get(key) * multiplier);
        }
        return multipliedInventory;
    }

    getKeyList(): Enum[] {
        return Object.keys(this.inventory) as Enum[];
    }

    get(key: Enum): number {
        return this.inventory[key] === undefined ? 0 : this.inventory[key];
    }

    set(key: Enum, value: number): void {
        this.inventory[key] = value;
    }

    add(key: Enum, value: number): void {
        this.set(key, this.get(key) + value);
    }

    with(key: Enum, value: number): Inventory<Enum> {
        this.set(key, value);
        return this;
    }

    addAll(inventory: Inventory<Enum>): void {
        for (const key of inventory.getKeyList()) {
            this.add(key, inventory.get(key));
        }
    }

    remove(key: Enum, value: number): void {
        this.set(key, this.get(key) - value);
    }

    toString(): string {
        return Object.keys(this.inventory)
            .map((itemName) => {
                return `${this.inventory[itemName as Enum]} ${itemName}`;
            })
            .join(', ');
    }

    copy(): Inventory<Enum> {
        const newInventory = new Inventory<Enum>();
        for (const key of this.getKeyList()) {
            newInventory.set(key, this.get(key));
        }
        return newInventory;
    }
}
