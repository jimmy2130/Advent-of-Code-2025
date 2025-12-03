import * as fs from 'fs';

function day3() {
	const input = fs.readFileSync('./day3.txt').toString().split('\n');
	console.log('part 1');
	console.log(getAns(input, 2));
	console.log('part 2');
	console.log(getAns(input, 12));
}

function getAns(input: string[], digits: number) {
	let ans = 0;
	for (let i = 0; i < input.length; i++) {
		const line = input[i];
		let startIndex = -1;
		let count = digits;
		while (count !== 0) {
			let digit = -1;
			for (let j = startIndex + 1; j <= line.length - count; j++) {
				if (Number(line[j]) > digit) {
					digit = Number(line[j]);
					startIndex = j;
				}
			}
			ans += digit * Math.pow(10, count - 1);
			count -= 1;
		}
	}
	return ans;
}

day3();
