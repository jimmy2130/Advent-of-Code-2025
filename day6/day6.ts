import * as fs from 'fs';

function day6() {
	const input = fs.readFileSync('./day6.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: string[]) {
	let finalAns = 0;
	const numbers = [];
	const operators = [];
	for (let i = 0; i < input.length - 1; i++) {
		numbers.push(
			input[i]
				.replaceAll(' ', ',')
				.split(',')
				.filter(e => e !== '')
				.map(e => Number(e)),
		);
	}
	for (let i = 0; i < input[input.length - 1].length; i++) {
		const char = input[input.length - 1][i];
		if (char === '+' || char === '*') {
			operators.push(char);
		}
	}

	for (let c = 0; c < numbers[0].length; c++) {
		const operator = operators[c];
		let ans = operator === '+' ? 0 : 1;
		for (let r = 0; r < numbers.length; r++) {
			if (operator === '+') {
				ans += numbers[r][c];
			} else {
				ans *= numbers[r][c];
			}
		}
		finalAns += ans;
	}

	return finalAns;
}

function part2(input: string[]) {
	const operators = [];
	let finalAns = 0;
	for (let i = 0; i < input[input.length - 1].length; i++) {
		const char = input[input.length - 1][i];
		if (char === '+' || char === '*') {
			operators.push(char);
		}
	}
	let question = 0;
	let ans = operators[question] === '+' ? 0 : 1;
	for (let c = 0; c < input[0].length; c++) {
		let str = '';
		for (let r = 0; r < input.length - 1; r++) {
			str += input[r][c];
		}
		if (str.trim() === '') {
			finalAns += ans;
			question += 1;
			ans = operators[question] === '+' ? 0 : 1;
		} else {
			if (operators[question] === '+') {
				ans += Number(str);
			} else {
				ans *= Number(str);
			}
		}
	}
	return finalAns + ans;
}

day6();
