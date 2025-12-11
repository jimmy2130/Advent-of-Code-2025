import * as fs from 'fs';

function day11() {
	const container: Record<string, string[]> = {};
	const input = fs
		.readFileSync('./day11.txt')
		.toString()
		.split('\n')
		.reduce((acc, cur) => {
			const devices = cur.split(' ');
			const input = devices[0].slice(0, -1);
			acc[input] = devices.slice(1);
			return acc;
		}, container);
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input: Record<string, string[]>) {
	const path = new Set<string>();
	path.add('you');
	return dfs('you', input, path);
}

function dfs(
	currentPosition: string,
	map: Record<string, string[]>,
	path: Set<string>,
): number {
	if (currentPosition === 'out') {
		return 1;
	}
	let count = 0;
	for (let i = 0; i < map[currentPosition].length; i++) {
		const nextPosition = map[currentPosition][i];
		path.add(nextPosition);
		count += dfs(nextPosition, map, path);
		path.delete(nextPosition);
	}
	return count;
}

function part2(input: Record<string, string[]>) {
	const path = new Set<string>();
	path.add('svr');
	const record = new Map<string, Ans>();
	const ans = dfs2('svr', input, path, record);
	return ans.hasBoth;
}

interface Ans {
	hasNone: number;
	hasFFT: number;
	hasDAC: number;
	hasBoth: number;
}

function dfs2(
	currentPosition: string,
	map: Record<string, string[]>,
	path: Set<string>,
	record: Map<string, Ans>,
): Ans {
	if (currentPosition === 'out') {
		if (path.has('fft') && path.has('dac')) {
			return {
				hasNone: 0,
				hasFFT: 0,
				hasDAC: 0,
				hasBoth: 1,
			};
		}
		if (path.has('fft')) {
			return {
				hasNone: 0,
				hasFFT: 1,
				hasDAC: 0,
				hasBoth: 0,
			};
		}
		if (path.has('dac')) {
			return {
				hasNone: 0,
				hasFFT: 0,
				hasDAC: 1,
				hasBoth: 0,
			};
		}
		return {
			hasNone: 1,
			hasFFT: 0,
			hasDAC: 0,
			hasBoth: 0,
		};
	}

	const count = {
		hasNone: 0,
		hasFFT: 0,
		hasDAC: 0,
		hasBoth: 0,
	};

	if (
		path.has('fft') &&
		path.has('dac') &&
		record.has(`${currentPosition}hasBoth`)
	) {
		return record.get(`${currentPosition}hasBoth`) ?? count;
	}

	if (
		path.has('fft') &&
		!path.has('dac') &&
		record.has(`${currentPosition}hasFFT`)
	) {
		return record.get(`${currentPosition}hasFFT`) ?? count;
	}

	if (
		path.has('dac') &&
		!path.has('fft') &&
		record.has(`${currentPosition}hasDAC`)
	) {
		return record.get(`${currentPosition}hasDAC`) ?? count;
	}

	if (
		!path.has('dac') &&
		!path.has('fft') &&
		record.has(`${currentPosition}hasNone`)
	) {
		return record.get(`${currentPosition}hasNone`) ?? count;
	}

	for (let i = 0; i < map[currentPosition].length; i++) {
		const nextPosition = map[currentPosition][i];
		path.add(nextPosition);
		const ans = dfs2(nextPosition, map, path, record);
		path.delete(nextPosition);
		count.hasNone += ans.hasNone;
		count.hasFFT += ans.hasFFT;
		count.hasDAC += ans.hasDAC;
		count.hasBoth += ans.hasBoth;
	}

	if (path.has('fft') && path.has('dac')) {
		record.set(`${currentPosition}hasBoth`, count);
	} else if (path.has('fft')) {
		record.set(`${currentPosition}hasFFT`, count);
	} else if (path.has('dac')) {
		record.set(`${currentPosition}hasDAC`, count);
	} else {
		record.set(`${currentPosition}hasNone`, count);
	}

	return count;
}

day11();
