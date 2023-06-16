import * as fs from 'fs';
import { BlueprintContainer } from './Blueprint/BlueprintContainer';
import { type RobotShop } from './RobotShop';

export class ShopLoader {
    private static readonly pattern = /[0-9]+/gi;
    private readonly shops: RobotShop[] = [];
    private readonly filePath: string;
    private readonly version: number;

    constructor(filePath: string, version: number) {
        this.filePath = filePath;
        this.version = version;
    }

    load(): void {
        const data: string = fs.readFileSync(this.filePath, 'utf8');

        for (const line of data.split('\n')) {
            if (line !== '') {
                const data = line.match(ShopLoader.pattern);
                if (data === null) {
                    throw new Error('Cannot parse blueprint');
                }
                const blueprintContainer = BlueprintContainer.fromVersion(this.version, data.map(Number));
                this.shops.push(blueprintContainer.generateShop());
            }
        }
    }

    getAllShops(): RobotShop[] {
        return this.shops;
    }

    getShop(index: number): RobotShop {
        return this.shops[index];
    }
}
