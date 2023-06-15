import * as fs from 'fs';
import { Inventory } from './Inventory';
import { Robot } from './Robot';
import { RobotShop } from './RobotShop';
import { type ResourceTypeEnum } from './types';

export class ShopLoader {
    private static readonly pattern = /[0-9]+/gi;
    private readonly blueprints: BlueprintContainer[] = [];

    load(): void {
        const allBlueprints: string = fs.readFileSync('./blueprints.txt', 'utf8');
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

    getAllBlueprints(): RobotShop[] {
        const robotShops: RobotShop[] = [];
        this.blueprints.forEach((blueprint) => {
            robotShops.push(this.getBlueprint(blueprint.getId()));
        });
        return robotShops;
    }

    getBlueprint(id: number): RobotShop {
        const robotShop = new RobotShop();
        robotShop.registerRobot(
            new Robot('ore-collecting robot', new Inventory<ResourceTypeEnum>().with('ore', 1), {
                ore: this.blueprints[id].getOreRC().getOre(),
                clay: this.blueprints[id].getOreRC().getClay(),
                obsidian: this.blueprints[id].getOreRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('clay-collecting robot', new Inventory<ResourceTypeEnum>().with('ore', 1), {
                ore: this.blueprints[id].getClayRC().getOre(),
                clay: this.blueprints[id].getClayRC().getClay(),
                obsidian: this.blueprints[id].getClayRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('obsidian-collecting robot', new Inventory<ResourceTypeEnum>().with('ore', 1), {
                ore: this.blueprints[id].getObsidianRC().getOre(),
                clay: this.blueprints[id].getObsidianRC().getClay(),
                obsidian: this.blueprints[id].getObsidianRC().getObsidian(),
            }),
        );
        robotShop.registerRobot(
            new Robot('geode-cracking', new Inventory<ResourceTypeEnum>().with('ore', 1), {
                ore: this.blueprints[id].getGeodeRC().getOre(),
                clay: this.blueprints[id].getGeodeRC().getClay(),
                obsidian: this.blueprints[id].getGeodeRC().getObsidian(),
            }),
        );
        return robotShop;
    }

    printBlueprint(id: number): void {
        console.log(
            `Robot ${id}:\n` +
                `ore: ${this.blueprints[id].getOreRC().getOre()}, clay: ${this.blueprints[id]
                    .getOreRC()
                    .getClay()}, obsidian: ${this.blueprints[id].getOreRC().getObsidian()}\n` +
                `ore: ${this.blueprints[id].getClayRC().getOre()}, clay: ${this.blueprints[id]
                    .getClayRC()
                    .getClay()}, obsidian: ${this.blueprints[id].getClayRC().getObsidian()}\n` +
                `ore: ${this.blueprints[id].getObsidianRC().getOre()}, clay: ${this.blueprints[id]
                    .getObsidianRC()
                    .getClay()}, obsidian: ${this.blueprints[id].getObsidianRC().getObsidian()}\n` +
                `ore: ${this.blueprints[id].getGeodeRC().getOre()}, clay: ${this.blueprints[id]
                    .getGeodeRC()
                    .getClay()}, obsidian: ${this.blueprints[id].getGeodeRC().getObsidian()}\n`,
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
