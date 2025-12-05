import * as fs from 'fs';

function day4() {
	const input = fs.readFileSync('./day4.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: string[]) {
	let ans = 0;
	for (let r = 0; r < input.length; r++) {
		for (let c = 0; c < input[r].length; c++) {
			if (input[r][c] === '.') {
				continue;
			}
			if (countPaperRoll(input, r, c) < 4) {
				ans += 1;
			}
		}
	}
	return ans;
}

function part2(rawInput: string[]) {
	let ans = 0;
	let input = [...rawInput];
	while (true) {
		const nextInput = [...input];
		let shouldContinue = false;
		for (let r = 0; r < input.length; r++) {
			for (let c = 0; c < input[r].length; c++) {
				if (input[r][c] === '.') {
					continue;
				}
				if (countPaperRoll(input, r, c) < 4) {
					ans += 1;
					nextInput[r] =
						`${nextInput[r].slice(0, c)}.${nextInput[r].slice(c + 1)}`;
					shouldContinue = true;
				}
			}
		}
		if (shouldContinue === false) {
			return ans;
		}
		input = [...nextInput];
	}
}

function countPaperRoll(input: string[], inputR: number, inputC: number) {
	let count = 0;
	for (let r = inputR - 1; r <= inputR + 1; r++) {
		for (let c = inputC - 1; c <= inputC + 1; c++) {
			if (r === inputR && c === inputC) {
				continue;
			}
			if (isOutOfBounds(input, r, c)) {
				continue;
			}
			if (input[r][c] === '@') {
				count += 1;
			}
		}
	}
	return count;
}

function isOutOfBounds(input: string[], r: number, c: number) {
	return r < 0 || r >= input.length || c < 0 || c >= input[0].length;
}

day4();
