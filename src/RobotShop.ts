import { type Robot, type RobotPrice } from './Robot';
import { type ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

export class RobotShop {
    private readonly robots: Record<string, Robot> = {};

    private startRobotName: string;

    public blueprintId: number;

    constructor(blueprintId: number) {
        this.blueprintId = blueprintId;
    }

    registerRobot(robot: Robot): void {
        if (this.startRobotName === undefined) {
            this.startRobotName = robot.robotName;
        }
        this.robots[robot.robotName] = robot;
    }

    getRobotNames(): string[] {
        return Object.keys(this.robots);
    }

    getRobot(robotName: string): Robot {
        if (this.robots[robotName] === undefined) {
            throw new Error(`Robot ${robotName} does not exist`);
        }
        return this.robots[robotName];
    }

    private getPrice(robotName: string): RobotPrice {
        const robot = this.getRobot(robotName);
        return robot.getPrice();
    }

    private getLoot(robotName: string): ItemRegistry<ResourceTypeEnum> {
        const robot = this.getRobot(robotName);
        return robot.getLoot();
    }

    canAfford(robotName: string, inventory: ItemRegistry<ResourceTypeEnum>): boolean {
        const price = this.getPrice(robotName);
        for (const resourceType of Object.keys(price)) {
            if (inventory.getAmount(resourceType as ResourceTypeEnum) < price[resourceType]) {
                return false;
            }
        }
        return true;
    }

    deductPrice(robotName: string, inventory: ItemRegistry<ResourceTypeEnum>): void {
        const price = this.getPrice(robotName);
        for (const resourceType of Object.keys(price)) {
            const resourcePrice = price[resourceType] as number;
            inventory.removeAmount(resourceType as ResourceTypeEnum, resourcePrice);
        }
    }

    priceToString(robotName: string): string {
        const price = this.getPrice(robotName);
        return Object.keys(price)
            .filter((resourceType) => price[resourceType] !== undefined && price[resourceType] > 0)
            .map((resourceType) => {
                const resourcePrice = price[resourceType] as number;
                return `${resourcePrice} ${resourceType}`;
            })
            .join(', ');
    }

    getMaxPriceOfSpecificResource(resourceType: ResourceTypeEnum): number {
        let maxPrice = 0;
        for (const robotName of Object.keys(this.robots)) {
            const price = this.getPrice(robotName);
            if (price[resourceType] !== undefined && (price[resourceType] as number) > maxPrice) {
                maxPrice = price[resourceType] as number;
            }
        }
        return maxPrice;
    }

    getRobotsThatProducesSpecificResource(resourceType: ResourceTypeEnum): string[] {
        const robots: string[] = [];
        for (const robotName of Object.keys(this.robots)) {
            const loot = this.getLoot(robotName);
            if (loot.has(resourceType)) {
                robots.push(robotName);
            }
        }
        return robots;
    }

    getMaxLootOfSpecificResource(resourceType: ResourceTypeEnum): number {
        let maxLoot = 0;
        for (const robotName of Object.keys(this.robots)) {
            const loot = this.getLoot(robotName);
            if (loot.getAmount(resourceType) > maxLoot) {
                maxLoot = loot.getAmount(resourceType);
            }
        }
        return maxLoot;
    }

    getStartRobotName(): string {
        return this.startRobotName;
    }
}
