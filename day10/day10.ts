import * as fs from 'fs';

interface Data {
	target: number;
	buttons: number[];
	voltage: number[];
}

function day10() {
	const input = fs.readFileSync('./day10.txt').toString().split('\n');
	const data = parseData(input);
	console.log('part 1');
	console.log(part1(data));
	console.log('part 2');
	console.log(part2(data));
}

function parseData(input: string[]) {
	return input.map(line => {
		const elements = line.split(' ');
		const target = elements[0]
			.slice(1, -1)
			.split('')
			.reduce((acc, cur, index) => {
				return acc + (cur === '#' ? 2 ** index : 0);
			}, 0);
		const buttons = elements.slice(1, -1).map(button => {
			return button
				.slice(1, -1)
				.split(',')
				.reduce((acc, cur) => {
					return acc + 2 ** Number(cur);
				}, 0);
		});
		const voltage = elements[elements.length - 1]
			.slice(1, -1)
			.split(',')
			.map(el => Number(el));

		return {
			target,
			buttons,
			voltage,
		};
	});
}

function part1(data: Data[]) {
	let sum = 0;
	for (let i = 0; i < data.length; i++) {
		const { target, buttons } = data[i];
		sum += dfs(target, buttons, 0, 0, 0);
	}
	return sum;
}

function dfs(
	target: number,
	buttons: number[],
	currentIndex: number,
	currentValue: number,
	buttonPress: number,
): number {
	if (currentIndex === buttons.length) {
		return currentValue === target ? buttonPress : Infinity;
	}

	return Math.min(
		dfs(
			target,
			buttons,
			currentIndex + 1,
			currentValue ^ buttons[currentIndex],
			buttonPress + 1,
		),
		dfs(target, buttons, currentIndex + 1, currentValue, buttonPress),
	);
}

// 💣
function part2(data: Data[]) {
	let sum = 0;
	for (let i = 0; i < data.length; i++) {
		const { buttons, voltage } = data[i];
		const record = new Map<number, number>();
		sum += dfs2(buttons, voltage, record);
	}
	return sum;
}

function dfs2(
	buttons: number[],
	voltages: number[],
	record: Map<number, number>,
): number {
	if (voltages.every(v => v === 0)) {
		return 0;
	}
	const key = voltages.reduce((acc, cur, index) => {
		acc += cur << (9 * index);
		return acc;
	}, 0);
	const memoizedAns = record.get(key) ?? -1;
	if (memoizedAns !== -1) {
		return memoizedAns;
	}
	const target = voltages.reduce((acc, cur, index) => {
		acc += (cur % 2) * 2 ** index;
		return acc;
	}, 0);
	const solutions: number[] = [];

	dfs3(target, buttons, 0, 0, 0, solutions);

	let ans = Infinity;

	for (let i = 0; i < solutions.length; i++) {
		const nextVoltages = [...voltages];
		for (let j = 0; j < buttons.length; j++) {
			if (((solutions[i] >> (buttons.length - j - 1)) & 1) === 1) {
				for (let k = 0; k < voltages.length; k++) {
					if (((buttons[j] >> (voltages.length - k - 1)) & 1) === 1) {
						nextVoltages[voltages.length - k - 1] -= 1;
					}
				}
			}
		}
		if (nextVoltages.some(v => v < 0)) {
			continue;
		}

		let s = solutions[i];
		let count = 0;
		while (s !== 0) {
			count += s & 1;
			s >>= 1;
		}

		ans = Math.min(
			ans,
			2 *
				dfs2(
					buttons,
					nextVoltages.map(v => v / 2),
					record,
				) +
				count,
		);
	}
	record.set(key, ans);
	return ans;
}

function dfs3(
	target: number,
	buttons: number[],
	currentIndex: number,
	currentValue: number,
	currentSolution: number,
	solutions: number[],
) {
	if (currentIndex === buttons.length) {
		if (currentValue === target) {
			solutions.push(currentSolution);
		}
		return;
	}

	dfs3(
		target,
		buttons,
		currentIndex + 1,
		currentValue ^ buttons[currentIndex],
		currentSolution + 2 ** (buttons.length - currentIndex - 1),
		solutions,
	);
	dfs3(
		target,
		buttons,
		currentIndex + 1,
		currentValue,
		currentSolution,
		solutions,
	);
}

day10();
