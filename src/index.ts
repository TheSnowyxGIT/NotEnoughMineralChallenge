/*
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
*/

import { Runner } from './Runner';
import { ShopLoader } from './ShopLoader';

const shopLoader = new ShopLoader('./blueprints.txt');
shopLoader.load();

// shopLoader.printShop(0);

const shops = shopLoader.getAllShops();

const scores: number[] = [];
for (const shop of shops) {
    console.log(`Running ${shop.blueprintId}`);

    const runner = new Runner(shop, 'geode');

    const score = runner.run(15);
    scores.push(score);

    console.log(`          score: ${score}`);
}

const sum = scores.reduce((a, b) => a + b, 0);
console.log();
console.log(`Sum score: ${sum}`);
console.log(`Average score: ${sum / scores.length}`);
