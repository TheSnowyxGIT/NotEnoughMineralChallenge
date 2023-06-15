import { type Inventory } from './Inventory';
import { type ResourceTypeEnum } from './types';

export type RobotPrice = Partial<Record<ResourceTypeEnum, number>>;

export class Robot {
    private readonly loot: Inventory<ResourceTypeEnum>;
    private readonly price: RobotPrice;
    public robotName: string;

    constructor(robotName: string, loot: Inventory<ResourceTypeEnum>, price: RobotPrice) {
        this.robotName = robotName;
        this.loot = loot;
        this.price = price;
    }

    getPrice(): RobotPrice {
        return this.price;
    }

    collect(): Inventory<ResourceTypeEnum> {
        return this.loot;
    }
}
