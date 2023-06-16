import { type ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

export type RobotPrice = Partial<Record<ResourceTypeEnum, number>>;

export class Robot {
    private readonly loot: ItemRegistry<ResourceTypeEnum>;
    private readonly price: RobotPrice;
    public robotName: string;

    constructor(robotName: string, loot: ItemRegistry<ResourceTypeEnum>, price: RobotPrice) {
        this.robotName = robotName;
        this.loot = loot;
        this.price = price;
    }

    getPrice(): RobotPrice {
        return this.price;
    }

    collect(): ItemRegistry<ResourceTypeEnum> {
        return this.loot;
    }

    getLoot(): ItemRegistry<ResourceTypeEnum> {
        return this.loot;
    }
}
