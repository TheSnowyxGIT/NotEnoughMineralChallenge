/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotEnoughMineralController } from './NotEnoughMineralsController';

function v2(): void {
    const runShops = new NotEnoughMineralController('v1-blueprints-demo.txt', 1);

    runShops.runAll('geode');
}

function v3(): void {
    const runShops = new NotEnoughMineralController('v1-blueprints-demo.txt', 1);

    runShops.runAll('geode');
}

const nemc = new NotEnoughMineralController('v1-blueprints-demo.txt', 1);
nemc.runAll('geode');
