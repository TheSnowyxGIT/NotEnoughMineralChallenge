/* eslint-disable @typescript-eslint/consistent-type-assertions */
export class ItemRegistry<Keys extends string> {
    private inventory: Record<Keys, number>;

    static multiply<Enum extends string>(inventory: ItemRegistry<Enum>, multiplier: number): ItemRegistry<Enum> {
        const multipliedInventory = new ItemRegistry<Enum>();
        for (const key of inventory.getKeyList()) {
            multipliedInventory.set(key, inventory.get(key) * multiplier);
        }
        return multipliedInventory;
    }

    constructor() {
        this.inventory = {} as Record<Keys, number>;
    }

    getKeyList(): Keys[] {
        return Object.keys(this.inventory) as Keys[];
    }

    get(key: Keys): number {
        return this.inventory[key] === undefined ? 0 : this.inventory[key];
    }

    set(key: Keys, value: number): void {
        this.inventory[key] = value;
    }

    add(key: Keys, value: number): void {
        this.set(key, this.get(key) + value);
    }

    with(key: Keys, value: number): ItemRegistry<Keys> {
        this.set(key, value);
        return this;
    }

    addAll(inventory: ItemRegistry<Keys>): void {
        for (const key of inventory.getKeyList()) {
            this.add(key, inventory.get(key));
        }
    }

    remove(key: Keys, value: number): void {
        this.set(key, this.get(key) - value);
    }

    toString(filterKeys: Keys[] | null = null): string {
        if (filterKeys === null) {
            filterKeys = this.getKeyList();
        }
        return filterKeys
            .map((key) => {
                return `${this.inventory[key]} ${key}`;
            })
            .join(', ');
    }

    copy(): ItemRegistry<Keys> {
        const newInventory = new ItemRegistry<Keys>();
        newInventory.inventory = Object.assign({}, this.inventory);
        return newInventory;
    }

    getNonEmptyKeys(): Keys[] {
        return this.getKeyList().filter((key) => this.get(key) > 0);
    }

    isEmpty(): boolean {
        for (const key of this.getKeyList()) {
            if (this.get(key) > 0) {
                return false;
            }
        }
        return true;
    }
}
/*
export class IR<Keys extends string> {
    private registry: Record<Keys, number>;

    private get

    public get(key: Keys): number {
        return this.registry[key] === undefined ? 0 : this.registry[key];
    }

    public set(key: Keys, value: number): void {
        this.registry[key] = value;
    }

    public with(key: Keys, value: number): IR<Keys> {
        this.set(key, value);
        return this;
    }

    public deepCopy(): IR<Keys> {
        const newRegistry = new IR<Keys>();
        newRegistry.registry = Object.assign({}, this.registry);
        return newRegistry;
    }

    public contains(key: Keys): boolean {
        return this.get(key) > 0;
    }

    public isEmpty(): boolean {
        for (const key of this.getKeyList()) {
            
        }
        return true;
    }
}
*/
