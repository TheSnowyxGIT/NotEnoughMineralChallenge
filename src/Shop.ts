import { type State } from './State';

export const ResourceTypeEnum = {
    ORE: 'ore',
    CLAY: 'clay',
    OBSIDIAN: 'obsidian',
    GEODE: 'geode',
} as const;

export type ResourceType = (typeof ResourceTypeEnum)[keyof typeof ResourceTypeEnum];

export class Shop {
    private static instance: Shop;
    public static getInstance(): Shop {
        if (Shop.instance === undefined) {
            return new Shop();
        }
        return Shop.instance;
    }

    constructor() {
        Shop.instance = this;
    }

    public prices: Record<ResourceType, Partial<Record<ResourceType, number>>> = {
        ore: {
            ore: 4,
        },
        clay: {
            ore: 2,
        },
        obsidian: {
            ore: 3,
            clay: 14,
        },
        geode: {
            ore: 2,
            obsidian: 7,
        },
    };

    public getCost(robotType: ResourceType, resource: ResourceType): number {
        return this.prices[robotType][resource] ?? 0;
    }

    public canAfford(robotType: ResourceType, state: State): boolean {
        for (const resourceType of Object.values(ResourceTypeEnum)) {
            if (this.getCost(robotType, resourceType as ResourceType) > state.resources[resourceType as ResourceType]) {
                return false;
            }
        }
        return true;
    }

    public buy(robotType: ResourceType, state: State): void {
        if (!this.canAfford(robotType, state)) {
            throw new Error('Cannot buy this robot');
        }
        for (const resourceType of Object.values(ResourceTypeEnum)) {
            state.resources[resourceType as ResourceType] -= this.getCost(robotType, resourceType as ResourceType);
        }
    }

    public getMaxPriceOfSpecificResource(resourceType: ResourceType): number {
        let maxPrice = 0;
        for (const robotType of Object.values(ResourceTypeEnum)) {
            const price = this.getCost(robotType as ResourceType, resourceType);
            if (price > maxPrice) {
                maxPrice = price;
            }
        }
        return maxPrice;
    }
}
