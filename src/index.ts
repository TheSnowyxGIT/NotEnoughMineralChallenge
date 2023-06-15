import { Inventory } from './Inventory';
import { Robot } from './Robot';
import { RobotShop } from './RobotShop';
import { Runner } from './Runner';
import { type ResourceTypeEnum } from './types';

const shop = new RobotShop();
shop.registerRobot(
    new Robot('ore-robot', new Inventory<ResourceTypeEnum>().with('ore', 1), {
        ore: 4,
    }),
);
shop.registerRobot(
    new Robot('clay-robot', new Inventory<ResourceTypeEnum>().with('clay', 1), {
        ore: 2,
    }),
);
shop.registerRobot(
    new Robot('obsidian-robot', new Inventory<ResourceTypeEnum>().with('obsidian', 1), {
        ore: 3,
        clay: 14,
    }),
);
shop.registerRobot(
    new Robot('geode-robot', new Inventory<ResourceTypeEnum>().with('geode', 1), {
        ore: 2,
        obsidian: 7,
    }),
);

const runner = new Runner(shop);

runner.run(24);
