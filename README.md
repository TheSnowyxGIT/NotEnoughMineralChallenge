## Goal

The goal of this TypeScript code, implemented using Node.js, is to determine the quality level of different blueprints for constructing robots in order to maximize the collection of a specific mineral within a given time limit.

## Problem Description

You are tasked with collecting minerals from various sources using different types of robots. Each mineral requires a specific blueprint configuration to be collected effectively. The blueprints determine the cost of each type of robot in terms of required resources and the mineral it aims to collect.

You have a limited amount of time to figure out the best blueprint configuration that will allow you to collect the maximum amount of the desired mineral.

Each robot can collect one unit of its respective resource type per minute. It takes one minute for the robot factory to construct any type of robot, and it consumes the necessary resources when construction begins.

## Variations

### Minerals

In addition to geodes, you now have a new mineral: diamonds. You can choose which mineral you want to maximize the collection of within the given time limit.

### Blueprint File Version

The code provides two blueprint versions: v1 and v2. Each version can contain multiple blueprints, but the format for each blueprint remains the same.

**Version 1 Blueprint Format** _(v1-blueprints-demo.txt)_

-   Blueprint X: Each ore robot costs X ore. Each clay robot costs X ore. Each obsidian robot costs X ore and X clay. Each geode robot costs X ore and X obsidian.

**Version 2 Blueprint Format** _(v2-blueprints-demo.txt)_

-   Blueprint X: Each ore robot costs X ore. Each clay robot costs X ore. Each obsidian robot costs X ore and X clay. Each geode robot costs X ore and X obsidian. Each diamond robot costs X geode, X clay, and X obsidian.

> **Note**: It's important to mention that in the original challenge, only the v1 blueprint version is used.

### Adding New Blueprint Versions:

In the _BlueprintContainer.ts_, you can add your own custom version of blueprint format.

Example, if you want a blueprint with 2 robots, _Bob_ and _Alice_, that follow this syntax :
Blueprint X: Bob robot cost X ore. Bob robot loot X ore and X clay. Alice robot cost X ore and X clay. Alice robot loot X diamond.

you will be able to add the version 3 as follow :

```ts
// ./src/BlueprintContainer.ts

// ...

const version3: robotInfoFormatter = (data: number[]) => {
    return {
        'Bob robot': {
            price: {
                ore: data[1],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('ore', data[2]).with('clay', data[3]),
        },
        'Alice robot': {
            price: {
                ore: data[4],
                clay: data[5],
            },
            loot: new ItemRegistry<ResourceTypeEnum>().with('diamond', data[6]),
        },
    };
};

const robotInfoFormatters: Record<number, robotInfoFormatter> = {
    1: version1,
    2: version2,
    // add your version here
    // 3: version3,
};
```

## Example

Here's an example code that demonstrates how to use the provided blueprint versions:

```ts
function v1(): void {
    const runShops = new NotEnoughMineralSolver('v1-blueprints-demo.txt', 1);

    runShops.runAll('geode', 24); // here the desired mineral is the geode and we want to search the optimal result for 24 minutes
}

function v2(): void {
    const runShops = new NotEnoughMineralSolver('v2-blueprints-demo.txt', 2);

    runShops.runAll('diamond', 24); // here the desired mineral is the diamond and we want to search the optimal result for 24 minutes
}
```

## Usage

We provide to you a _src/index.ts_ that will be executed when running

```sh
npm start
```

## Additional Resources

For more details about the **original** challenge, you can visit the [challenge site](https://adventofcode.com/2022/day/19) where the problem was presented.
