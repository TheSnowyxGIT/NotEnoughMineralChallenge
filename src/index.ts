import { ShopLoader } from './ShopLoader';

const shopLoader = new ShopLoader('blueprints.txt');

shopLoader.load();

shopLoader.printShop(0);
