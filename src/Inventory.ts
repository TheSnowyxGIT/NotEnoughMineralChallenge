export class Inventory<Enum extends string> {
    private readonly inventory: Record<Enum, number>;

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

    remove(key: Enum, value: number): void {
        this.set(key, this.get(key) - value);
    }
}
