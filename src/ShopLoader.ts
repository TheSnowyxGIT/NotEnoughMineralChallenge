import * as fs from 'fs';

export class ShopLoader {
    private static readonly pattern: string = '/[0-9]+/ig';
    private readonly blueprints: BlueprintContainer[] = [];

    load(): void {
        const allBlueprints = fs.readFileSync('./', 'utf8');
        allBlueprints.split('\n').forEach((blueprint) => {
            this.blueprints.push(this.parseBlueprint(blueprint));
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
}
