import * as fs from 'fs';

function day2() {
	const input = fs
		.readFileSync('./day2.txt')
		.toString()
		.split(',')
		.map(range => range.split('-').map(str => Number(str)));
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: number[][]) {
	let ans = 0;
	for (let i = 0; i < input.length; i++) {
		const [low, high] = input[i];
		for (let j = low; j <= high; j++) {
			const check = j.toString();
			if (check.length % 2 === 1) {
				continue;
			}
			if (check.slice(0, check.length / 2) === check.slice(check.length / 2)) {
				ans += j;
			}
		}
	}
	return ans;
}

function part2(input: number[][]) {
	let ans = 0;
	for (let i = 0; i < input.length; i++) {
		const [low, high] = input[i];
		for (let j = low; j <= high; j++) {
			const check = j.toString();
			for (let k = 1; k < check.length; k++) {
				if (check.length % k !== 0) {
					continue;
				}
				const target = check.slice(0, k);
				let shouldAdd = true;
				for (let l = 0; l < check.length; l = l + k) {
					const testStr = check.slice(l, l + k);
					if (target !== testStr) {
						shouldAdd = false;
						break;
					}
				}
				if (shouldAdd) {
					ans += j;
					break;
				}
			}
		}
	}
	return ans;
}

day2();
