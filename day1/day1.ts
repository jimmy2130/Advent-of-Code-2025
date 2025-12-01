import * as fs from 'fs';

function day1() {
	const input = fs.readFileSync('./day1.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: string[]) {
	let position = 50;
	let ans = 0;
	for (let i = 0; i < input.length; i++) {
		const direction = input[i][0];
		const distance = Number(input[i].slice(1)) % 100;
		if (direction === 'R') {
			position += distance;
		} else {
			position += 100 - distance;
		}
		position %= 100;
		if (position === 0) {
			ans += 1;
		}
	}
	return ans;
}

function part2(input: string[]) {
	let position = 50;
	let ans = 0;

	for (let i = 0; i < input.length; i++) {
		const direction = input[i][0];
		const distance = Number(input[i].slice(1));
		if (direction === 'R') {
			position += distance;
			while (position >= 100) {
				position -= 100;
				ans += 1;
			}
		} else {
			const origin = position;
			position -= distance;
			while (position <= 0) {
				ans += 1;
				if (position === 0) {
					break;
				}
				position += 100;
			}
			if (origin === 0) {
				ans -= 1;
			}
		}
	}
	return ans;
}

day1();
