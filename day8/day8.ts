import * as fs from 'fs';

function day8() {
	const input = fs
		.readFileSync('./day8.txt')
		.toString()
		.split('\n')
		.map(line => line.split(',').map(el => Number(el)));
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: number[][]) {
	const instructions = [];
	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			instructions.push([i, j, getDistance(input[i], input[j])]);
		}
	}
	instructions.sort((a, b) => a[2] - b[2]);

	let output = Array(input.length)
		.fill(null)
		.map((_, index) => index);

	for (let i = 0; i < 1000; i++) {
		const [start, end] = instructions[i];
		let p1 = start;
		while (p1 !== output[p1]) {
			p1 = output[p1];
		}
		let p2 = end;
		while (p2 !== output[p2]) {
			p2 = output[p2];
		}
		if (p1 === p2) {
			continue;
		}
		output = output.map(e => (e === output[end] ? p1 : e));
	}

	const count = Array(input.length).fill(0);

	for (let i = 0; i < output.length; i++) {
		let pointer = i;
		while (pointer !== output[pointer]) {
			pointer = output[pointer];
		}
		count[pointer] += 1;
	}

	count.sort((a, b) => b - a);
	return count[0] * count[1] * count[2];
}

function part2(input: number[][]) {
	const instructions = [];
	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			instructions.push([i, j, getDistance(input[i], input[j])]);
		}
	}
	instructions.sort((a, b) => a[2] - b[2]);

	let output = Array(input.length)
		.fill(null)
		.map((_, index) => index);

	for (let i = 0; i < instructions.length; i++) {
		const [start, end] = instructions[i];
		let p1 = start;
		while (p1 !== output[p1]) {
			p1 = output[p1];
		}
		let p2 = end;
		while (p2 !== output[p2]) {
			p2 = output[p2];
		}
		if (p1 === p2) {
			continue;
		}
		output = output.map(e => (e === output[end] ? p1 : e));

		let target = 0;
		while (target !== output[target]) {
			target = output[target];
		}
		let shouldContinue = false;
		for (let i = 1; i < output.length; i++) {
			let pointer = i;
			while (pointer !== output[pointer]) {
				pointer = output[pointer];
			}
			if (pointer !== target) {
				shouldContinue = true;
				break;
			}
		}
		if (!shouldContinue) {
			return input[start][0] * input[end][0];
		}
	}

	return 0;
}

function getDistance(p1: number[], p2: number[]) {
	const [x1, y1, z1] = p1;
	const [x2, y2, z2] = p2;
	return Math.sqrt(
		Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2 + Math.abs(z1 - z2) ** 2,
	);
}

day8();
