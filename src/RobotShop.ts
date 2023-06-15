import { type Inventory } from './Inventory';
import { type Robot, type RobotPrice } from './Robot';
import { type ResourceTypeEnum } from './types';

export class RobotShop {
    private readonly robots: Record<string, Robot> = {};

    registerRobot(robot: Robot): void {
        this.robots[robot.robotName] = robot;
    }

    private getPrice(robotName: string): RobotPrice {
        if (this.robots[robotName] === undefined) {
            throw new Error(`Robot ${robotName} does not exist`);
        }
        return this.robots[robotName].getPrice();
    }

    canAfford(robotName: string, inventory: Inventory<ResourceTypeEnum>): boolean {
        const price = this.getPrice(robotName);
        for (const resourceType of Object.keys(price)) {
            if (inventory.get(resourceType as ResourceTypeEnum) < price[resourceType]) {
                return false;
            }
        }
        return true;
    }

    buy(robotName: string, inventory: Inventory<ResourceTypeEnum>): void {
        const price = this.getPrice(robotName);
        for (const resourceType of Object.keys(price)) {
            const resourcePrice = price[resourceType] as number;
            inventory.remove(resourceType as ResourceTypeEnum, resourcePrice);
        }
    }

    priceToString(robotName: string): string {
        const price = this.getPrice(robotName);
        return Object.keys(price)
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
}
