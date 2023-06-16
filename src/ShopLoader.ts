import * as fs from 'fs';
import { Robot } from './Robot';
import { RobotShop } from './RobotShop';
import { ItemRegistry } from './generics/ItemRegistry';
import { type ResourceTypeEnum } from './types';

export class ShopLoader {
    private static readonly pattern = /[0-9]+/gi;
    private readonly blueprints: BlueprintContainer[] = [];
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    load(): void {
        const allBlueprints: string = fs.readFileSync(this.filePath, 'utf8');
        allBlueprints.split('\n').forEach((blueprint) => {
            if (blueprint !== '') {
                this.blueprints.push(this.parseBlueprint(blueprint));
            }
        });
    }

    parseBlueprint(blueprint: string): BlueprintContainer {
        const data = blueprint.match(ShopLoader.pattern);
        if (data === null) {
            throw new Error('Cannot parse blueprint');
        }
        return new BlueprintContainer(
            parseInt(data[0]),
            new RobotCost(parseInt(data[1]), 0, 0),
            new RobotCost(parseInt(data[2]), 0, 0),
            new RobotCost(parseInt(data[3]), parseInt(data[4]), 0),
            new RobotCost(parseInt(data[5]), 0, parseInt(data[6])),
        );
    }

    getAllShops(): RobotShop[] {
        const robotShops: RobotShop[] = [];
        for (let i = 0; i < this.blueprints.length; i++) {
            robotShops.push(this.getShop(i));
        }
        return robotShops;
    }

    getShop(index: number): RobotShop {
        const robotShop = new RobotShop(this.blueprints[index].getId());
        robotShop.registerRobot(
            new Robot('ore-collecting robot', new ItemRegistry<ResourceTypeEnum>().with('ore', 1), {
                ore: this.blueprints[index].getOreRC().getOre(),
                clay: this.blueprints[index].getOreRC().getClay(),
                obsidian: this.blueprints[index].getOreRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('clay-collecting robot', new ItemRegistry<ResourceTypeEnum>().with('clay', 1), {
                ore: this.blueprints[index].getClayRC().getOre(),
                clay: this.blueprints[index].getClayRC().getClay(),
                obsidian: this.blueprints[index].getClayRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('obsidian-collecting robot', new ItemRegistry<ResourceTypeEnum>().with('obsidian', 1), {
                ore: this.blueprints[index].getObsidianRC().getOre(),
                clay: this.blueprints[index].getObsidianRC().getClay(),
                obsidian: this.blueprints[index].getObsidianRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('geode-cracking', new ItemRegistry<ResourceTypeEnum>().with('geode', 1), {
                ore: this.blueprints[index].getGeodeRC().getOre(),
                clay: this.blueprints[index].getGeodeRC().getClay(),
                obsidian: this.blueprints[index].getGeodeRC().getObsidian(),
            }),
        );
        return robotShop;
    }

    printShop(index: number): void {
        console.log(
            `Robot ${this.blueprints[index].getId()}:\n` +
                `ore: ${this.blueprints[index].getOreRC().getOre()}, clay: ${this.blueprints[index]
                    .getOreRC()
                    .getClay()}, obsidian: ${this.blueprints[index].getOreRC().getObsidian()}\n` +
                `ore: ${this.blueprints[index].getClayRC().getOre()}, clay: ${this.blueprints[index]
                    .getClayRC()
                    .getClay()}, obsidian: ${this.blueprints[index].getClayRC().getObsidian()}\n` +
                `ore: ${this.blueprints[index].getObsidianRC().getOre()}, clay: ${this.blueprints[index]
                    .getObsidianRC()
                    .getClay()}, obsidian: ${this.blueprints[index].getObsidianRC().getObsidian()}\n` +
                `ore: ${this.blueprints[index].getGeodeRC().getOre()}, clay: ${this.blueprints[index]
                    .getGeodeRC()
                    .getClay()}, obsidian: ${this.blueprints[index].getGeodeRC().getObsidian()}\n`,
        );
    }
}

class RobotCost {
    private readonly ore: number;
    private readonly clay: number;
    private readonly obsidian: number;

    constructor(ore: number, clay: number, obsidian: number) {
        this.ore = ore;
        this.clay = clay;
        this.obsidian = obsidian;
    }

    getOre(): number {
        return this.ore;
    }

    getClay(): number {
        return this.clay;
    }

    getObsidian(): number {
        return this.obsidian;
    }
}

class BlueprintContainer {
    private readonly id: number;
    private readonly oreRC: RobotCost;
    private readonly clayRC: RobotCost;
    private readonly obsidianRC: RobotCost;
    private readonly geodeRC: RobotCost;

    constructor(id: number, oreRC: RobotCost, clayRC: RobotCost, obsidianRC: RobotCost, geodeRC: RobotCost) {
        this.id = id;
        this.oreRC = oreRC;
        this.clayRC = clayRC;
        this.obsidianRC = obsidianRC;
        this.geodeRC = geodeRC;
    }

    getId(): number {
        return this.id;
    }

    getOreRC(): RobotCost {
        return this.oreRC;
    }

    getClayRC(): RobotCost {
        return this.clayRC;
    }

    getObsidianRC(): RobotCost {
        return this.obsidianRC;
    }

    getGeodeRC(): RobotCost {
        return this.geodeRC;
    }
}
