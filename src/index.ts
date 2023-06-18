/* eslint-disable @typescript-eslint/no-unused-vars */

import { NotEnoughMineralSolver } from './NotEnoughMineralsSolver';

function v1(): void {
    const runShops = new NotEnoughMineralSolver('v1-blueprints-demo.txt', 1);

    runShops.runAll('geode', 24);
}

function v2(): void {
    const runShops = new NotEnoughMineralSolver('v2-blueprints-demo.txt', 2);

    runShops.runAll('diamond', 24);
}

v1();
