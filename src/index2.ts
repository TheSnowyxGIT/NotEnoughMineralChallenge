import { Runner } from './Runner';
import { ShopLoader } from './ShopLoader';

const shopLoader = new ShopLoader('./v2-blueprints-demo.txt', 2);
shopLoader.load();

const shop = shopLoader.getShop(1);

const runner = new Runner(shop, 'diamond');

const score = runner.run_dfs(24);
console.log(`score: ${score}`);
/*
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
*/
