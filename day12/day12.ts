import * as fs from 'fs';

function day12() {
	const input = fs.readFileSync('./day12.txt').toString().split('\n\n');
	const regions = input[input.length - 1].split('\n').map(line => {
		const [regionStr, shapesStr] = line.split(': ');
		const [width, height] = regionStr.split('x').map(el => Number(el));
		const quantity = shapesStr.split(' ').map(el => Number(el));
		return { width, height, quantity };
	});
	console.log('part 1');
	console.log(part1(regions));
}

interface Region {
	width: number;
	height: number;
	quantity: number[];
}

function part1(regions: Region[]) {
	let ans = 0;

	for (let i = 0; i < regions.length; i++) {
		if (placeEverythingDirectly(regions[i])) {
			ans += 1;
			continue;
		} else if (notEnoughSpace(regions[i])) {
			continue;
		}
		console.log('something not checked!');
	}
	return ans;
}

function placeEverythingDirectly(region: Region) {
	const { width, height, quantity } = region;
	const rows = Math.floor(height / 3);
	const cols = Math.floor(width / 3);
	const total = quantity.reduce((acc, cur) => acc + cur, 0);
	return total <= rows * cols;
}

function notEnoughSpace(region: Region) {
	const { width, height, quantity } = region;
	const totalSpace = width * height;
	const neededSpace = quantity.reduce((acc, cur, index) => {
		switch (index) {
			case 0: {
				acc += cur * 6;
				break;
			}
			case 1:
			case 3:
			case 4:
			case 5: {
				acc += cur * 7;
				break;
			}
			case 2: {
				acc += cur * 5;
			}
		}
		return acc;
	}, 0);
	return neededSpace > totalSpace;
}

day12();
