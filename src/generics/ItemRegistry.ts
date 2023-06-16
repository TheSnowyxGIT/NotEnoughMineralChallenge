/* eslint-disable @typescript-eslint/consistent-type-assertions */
export class ItemRegistry<Keys extends string> {
    private registry: Record<Keys, number> = {} as Record<Keys, number>;

    public get itemsNames(): Keys[] {
        return Object.keys(this.registry) as Keys[];
    }

    public get nonEmptyItemsNames(): Keys[] {
        return this.itemsNames.filter((key) => this.has(key));
    }

    public getAmount(key: Keys): number {
        return this.registry[key] === undefined ? 0 : this.registry[key];
    }

    public setAmount(key: Keys, value: number): void {
        this.registry[key] = value;
    }

    public addAmount(key: Keys, value: number): void {
        this.setAmount(key, this.getAmount(key) + value);
    }

    public removeAmount(key: Keys, value: number): void {
        this.setAmount(key, this.getAmount(key) - value);
    }

    public addRegistry(registry: ItemRegistry<Keys>): void {
        for (const key of registry.itemsNames) {
            this.addAmount(key, registry.getAmount(key));
        }
    }

    public with(key: Keys, value: number): ItemRegistry<Keys> {
        this.setAmount(key, value);
        return this;
    }

    public deepCopy(): ItemRegistry<Keys> {
        const newRegistry = new ItemRegistry<Keys>();
        newRegistry.registry = Object.assign({}, this.registry);
        return newRegistry;
    }

    public has(key: Keys): boolean {
        return this.getAmount(key) > 0;
    }

    public isEmpty(): boolean {
        for (const key of this.itemsNames) {
            if (this.has(key)) {
                return false;
            }
        }
        return true;
    }

    public toString(filterKeys: Keys[] | null = null): string {
        if (filterKeys === null) {
            filterKeys = this.itemsNames;
        }
        return filterKeys
            .map((key) => {
                return `${this.registry[key]} ${key}`;
            })
            .join(', ');
    }

    // * static methods

    static multiply<Enum extends string>(registry: ItemRegistry<Enum>, multiplier: number): ItemRegistry<Enum> {
        const multipliedRegistry = new ItemRegistry<Enum>();
        for (const key of registry.itemsNames) {
            multipliedRegistry.setAmount(key, registry.getAmount(key) * multiplier);
        }
        return multipliedRegistry;
    }
}
