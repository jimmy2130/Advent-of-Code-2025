import * as fs from 'fs';

function day7() {
	const input = fs.readFileSync('./day7.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: string[]) {
	const startingC = input[0].split('').findIndex(char => char === 'S');
	let beamPositions = [startingC];
	let ans = 0;
	for (let r = 1; r < input.length; r++) {
		const nextBeamPositions = [];
		for (let i = 0; i < beamPositions.length; i++) {
			const beamPosition = beamPositions[i];
			if (input[r][beamPosition] === '.') {
				nextBeamPositions.push(beamPosition);
			} else if (input[r][beamPosition] === '^') {
				nextBeamPositions.push(beamPosition - 1);
				nextBeamPositions.push(beamPosition + 1);
				ans += 1;
			}
		}
		beamPositions = Array.from(new Set(nextBeamPositions));
	}
	return ans;
}

function part2(input: string[]) {
	const startingC = input[0].split('').findIndex(char => char === 'S');
	const record = Array(input.length)
		.fill(null)
		.map(() => Array(input[0].length).fill(0));
	return dfs([0, startingC], input, record);
}

function dfs(
	[r, c]: [number, number],
	input: string[],
	record: number[][],
): number {
	if (r === input.length - 1) {
		record[r][c] = 1;
		return 1;
	}
	if (record[r][c] !== 0) {
		return record[r][c];
	}
	if (input[r][c] === 'S' || input[r][c] === '.') {
		const ans = dfs([r + 1, c], input, record);
		record[r][c] = ans;
		return ans;
	}
	const ans =
		dfs([r + 1, c - 1], input, record) + dfs([r + 1, c + 1], input, record);
	record[r][c] = ans;
	return ans;
}

day7();
