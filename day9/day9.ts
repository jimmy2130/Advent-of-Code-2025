import * as fs from 'fs';

function day9() {
	const input = fs
		.readFileSync('./day9.txt')
		.toString()
		.split('\n')
		.map(line => line.split(',').map(el => Number(el)));
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: number[][]) {
	let maxAns = -1;
	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			maxAns = Math.max(getArea(input[i], input[j]), maxAns);
		}
	}
	return maxAns;
}

function getArea(p1: number[], p2: number[]) {
	const [x1, y1] = p1;
	const [x2, y2] = p2;
	return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

function part2(rawInput: number[][]) {
	const horizontal: Record<number, number[][]> = {};
	const vertical: Record<number, number[][]> = {};
	// step 1: convert input
	const normalizedX = Array.from(new Set(rawInput.map(e => e[0])));
	normalizedX.sort((a, b) => a - b);
	const normalizedY = Array.from(new Set(rawInput.map(e => e[1])));
	normalizedY.sort((a, b) => a - b);
	const input = [];
	for (let i = 0; i < rawInput.length; i++) {
		const [x, y] = rawInput[i];
		const newX = normalizedX.findIndex(el => el === x);
		const newY = normalizedY.findIndex(el => el === y);
		input.push([newX, newY]);
	}
	// step 2: get lines info
	for (let i = 0; i < input.length; i++) {
		const [startX, startY] = input[i];
		const [endX, endY] = i === input.length - 1 ? input[0] : input[i + 1];
		if (startX === endX) {
			if (startX in vertical) {
				vertical[startX].push([Math.min(startY, endY), Math.max(startY, endY)]);
			} else {
				vertical[startX] = [[Math.min(startY, endY), Math.max(startY, endY)]];
			}
		} else if (startY === endY) {
			if (startY in horizontal) {
				horizontal[startY].push([
					Math.min(startX, endX),
					Math.max(startX, endX),
				]);
			} else {
				horizontal[startY] = [[Math.min(startX, endX), Math.max(startX, endX)]];
			}
		} else {
			console.log('error');
		}
	}

	// step 3: get ans
	let maxAns = -1;
	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			if (isValidRectangle(input[i], input[j], horizontal, vertical)) {
				maxAns = Math.max(
					getArea(
						[normalizedX[input[i][0]], normalizedY[input[i][1]]],
						[normalizedX[input[j][0]], normalizedY[input[j][1]]],
					),
					maxAns,
				);
			}
		}
	}

	return maxAns;
}

function isValidRectangle(
	p1: number[],
	p2: number[],
	h: Record<number, number[][]>,
	v: Record<number, number[][]>,
) {
	const [x1, y1] = p1;
	const [x2, y2] = p2;

	if (!isPointInside(x1, y1, h, v)) {
		return false;
	}
	if (!isPointInside(x1, y2, h, v)) {
		return false;
	}
	if (!isPointInside(x2, y1, h, v)) {
		return false;
	}
	if (!isPointInside(x2, y2, h, v)) {
		return false;
	}

	for (let i = Math.min(x1, x2) + 1; i < Math.max(x1, x2); i++) {
		if (!isPointInside(i, y1, h, v)) {
			return false;
		}
		if (!isPointInside(i, y2, h, v)) {
			return false;
		}
	}

	for (let i = Math.min(y1, y2) + 1; i < Math.max(y1, y2); i++) {
		if (!isPointInside(x1, i, h, v)) {
			return false;
		}
		if (!isPointInside(x2, i, h, v)) {
			return false;
		}
	}

	return true;
}

function isPointInside(
	x: number,
	y: number,
	h: Record<number, number[][]>,
	v: Record<number, number[][]>,
) {
	if (x in v && v[x].some(range => y >= range[0] && y <= range[1])) {
		return true;
	}

	if (y in h && h[y].some(range => x >= range[0] && x <= range[1])) {
		return true;
	}

	let count = 0;
	let pointer = y;

	while (pointer >= 0) {
		if (
			pointer in h &&
			h[pointer].some(range => x >= range[0] && x < range[1])
		) {
			count += 1;
		}
		pointer -= 1;
	}

	return count % 2 === 1;
}

day9();
