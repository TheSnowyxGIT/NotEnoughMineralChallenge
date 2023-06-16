import { Robot, type RobotPrice } from './Robot';
import { RobotShop } from './RobotShop';
import { ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

interface RobotInfo {
    price: RobotPrice;
    loot: ItemRegistry<ResourceTypeEnum>;
}

type robotInfoFormatter = (data: number[]) => Record<string, RobotInfo>;
const version1: robotInfoFormatter = (data: number[]) => {
    return {
        'ore-collecting robot': {
            price: {
                ore: data[1],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('ore', 1),
        },
        'clay-collecting robot': {
            price: {
                ore: data[2],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('clay', 1),
        },
        'obsidian-collecting robot': {
            price: {
                ore: data[3],
                clay: data[4],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('obsidian', 1),
        },
        'geode-cracking robot': {
            price: {
                ore: data[5],
                obsidian: data[6],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('geode', 1),
        },
    };
};
const version2: robotInfoFormatter = (data: number[]) => {
    return {
        'ore-collecting robot': {
            price: {
                ore: data[1],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('ore', 1),
        },
        'clay-collecting robot': {
            price: {
                ore: data[2],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('clay', 1),
        },
        'obsidian-collecting robot': {
            price: {
                ore: data[3],
                clay: data[4],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('obsidian', 1),
        },
        'geode-cracking robot': {
            price: {
                ore: data[5],
                obsidian: data[6],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('geode', 1),
        },
        'diamond-cracking robot': {
            price: {
                geode: data[7],
                clay: data[8],
                obsidian: data[9],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('diamond', 1),
        },
    };
};
const robotInfoFormatters: Record<number, robotInfoFormatter> = {
    1: version1,
    2: version2,
};

export class BlueprintContainer {
    public static fromVersion(version: number, data: number[]): BlueprintContainer {
        if (robotInfoFormatters[version] === undefined) {
            throw new Error(`Unknown blueprint version ${version}`);
        }
        return new BlueprintContainer(data[0], robotInfoFormatters[version](data));
    }

    private readonly id: number;
    private readonly robotInfos: Record<string, RobotInfo>;

    constructor(id: number, robotInfos: Record<string, RobotInfo>) {
        this.id = id;
        this.robotInfos = robotInfos;
    }

    public generateShop(): RobotShop {
        const robotShop = new RobotShop(this.id);
        for (const robotName of Object.keys(this.robotInfos)) {
            const price: RobotPrice = this.robotInfos[robotName].price;
            const loot: ItemRegistry<ResourceTypeEnum> = this.robotInfos[robotName].loot;

            robotShop.registerRobot(new Robot(robotName, loot, price));
        }
        return robotShop;
    }
}
