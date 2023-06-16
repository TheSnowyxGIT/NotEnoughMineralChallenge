import * as fs from 'fs';
import { Runner } from './Runner';
import { ShopLoader } from './ShopLoader';
import { type ResourceTypeEnum } from './types';

export class NotEnoughMineralController {
    private readonly file: string;
    private readonly shopLoader: ShopLoader;
    private outputFile: string = 'analysis.txt';

    constructor(file: string, version: number) {
        this.file = file;
        this.shopLoader = new ShopLoader(this.file, version);
    }

    public setOutputFile(outputFile: string): void {
        this.outputFile = outputFile;
    }

    public runAll(goalMineral: ResourceTypeEnum, persistResist: boolean = true): void {
        this.shopLoader.load();

        const shops = this.shopLoader.getAllShops();

        const scores: number[] = [];
        for (const shop of shops) {
            const runner = new Runner(shop, goalMineral);
            const score = runner.run_dfs(24);
            scores.push(score);
        }

        console.log(this.computeResult(scores));
        if (persistResist) {
            this.outputAnalysis(scores);
        }
    }

    run(blueprintIndex: number, goalMineral: ResourceTypeEnum, activeLogs = false): void {
        this.shopLoader.load();

        const shop = this.shopLoader.getShop(blueprintIndex);
        const runner = new Runner(shop, goalMineral, activeLogs);
        const score = runner.run_dfs(24);
        console.log(`Score: ${score}`);
    }

    private computeResult(scores: number[]): string {
        let stringResult: string = '';
        for (let i = 0; i < scores.length; i++) {
            stringResult += `Blueprint ${i + 1}: ${scores[i]}\n`;
        }
        const maxScoreIdx = scores.indexOf(Math.max(...scores)) + 1;
        stringResult += `\nBest blueprint is the blueprint ${maxScoreIdx}\n`;
        return stringResult;
    }

    private outputAnalysis(scores: number[]): void {
        const toWrite = this.computeResult(scores);
        fs.writeFileSync(this.outputFile, toWrite);
    }
}
