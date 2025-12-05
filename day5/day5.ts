import * as fs from 'fs';

function day5() {
	const input = fs.readFileSync('./day5.txt').toString().split('\n\n');
	const range = input[0]
		.split('\n')
		.map(line => line.split('-').map(element => Number(element)));
	const ids = input[1].split('\n').map(line => Number(line));
	console.log('part 1');
	console.log(part1(range, ids));
	console.log('part 2');
	console.log(part2(range));
}

function part1(range: number[][], ids: number[]) {
	let ans = 0;
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		for (let j = 0; j < range.length; j++) {
			const [low, high] = range[j];
			if (id >= low && id <= high) {
				ans += 1;
				break;
			}
		}
	}
	return ans;
}

function part2(inputRange: number[][]) {
	const range = [...inputRange].sort((a, b) => a[0] - b[0]);
	const finalRange = [range[0]];
	for (let i = 1; i < range.length; i++) {
		const [low, high] = range[i];
		if (low > finalRange[finalRange.length - 1][1]) {
			finalRange.push(range[i]);
			continue;
		}
		finalRange[finalRange.length - 1][1] = Math.max(
			high,
			finalRange[finalRange.length - 1][1],
		);
	}
	let ans = 0;
	for (let i = 0; i < finalRange.length; i++) {
		const [low, high] = finalRange[i];
		ans += high - low + 1;
	}
	return ans;
}

day5();
