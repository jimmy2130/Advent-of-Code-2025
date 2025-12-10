import * as fs from 'fs';

const EPS = 1e-9;

interface Data {
	target: number;
	buttons: number[];
	voltage: number[];
	matrix: number[][];
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

		const matrix = Array(voltage.length)
			.fill(null)
			.map(() => Array(buttons.length).fill(0));
		for (let i = 1; i < elements.length - 1; i++) {
			const element = elements[i]
				.slice(1, -1)
				.split(',')
				.map(el => Number(el));
			element.forEach(e => {
				matrix[e][i - 1] = 1;
			});
		}
		return {
			target,
			buttons,
			voltage,
			matrix,
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
		const { matrix, voltage } = data[i];
		const ansArr = solveMinSumNonnegativeIntegerGeneral(matrix, voltage);
		sum += ansArr.reduce((acc, cur) => acc + cur, 0);
	}
	return sum;
}

day10();

type Matrix = number[][];
type Vector = number[];

// ---------- 1. RREF: reduce to independent equations ----------

function reduceSystemToIndependent(
	A: Matrix,
	b: Vector,
): { Ared: Matrix; bred: Vector } {
	const m = A.length;
	if (m === 0) throw new Error('Empty system');
	const n = A[0].length;
	if (b.length !== m) throw new Error('Right-hand side length mismatch');

	const M: number[][] = A.map((row, i) => [...row, b[i]]); // [A|b]

	let row = 0;
	for (let col = 0; col < n && row < m; col++) {
		// Find pivot
		let pivotRow = -1;
		let maxAbs = EPS;
		for (let r = row; r < m; r++) {
			const val = Math.abs(M[r][col]);
			if (val > maxAbs) {
				maxAbs = val;
				pivotRow = r;
			}
		}
		if (pivotRow === -1) continue; // no pivot in this column

		// Swap pivot row up
		if (pivotRow !== row) {
			[M[row], M[pivotRow]] = [M[pivotRow], M[row]];
		}

		// Normalize pivot row (pivot -> 1)
		const pivot = M[row][col];
		for (let c = col; c <= n; c++) {
			M[row][c] /= pivot;
		}

		// Eliminate this column from all other rows
		for (let r = 0; r < m; r++) {
			if (r === row) continue;
			const factor = M[r][col];
			if (Math.abs(factor) < EPS) continue;
			for (let c = col; c <= n; c++) {
				M[r][c] -= factor * M[row][c];
			}
		}

		row++;
	}

	// Check inconsistency: 0...0 | nonzero
	for (let r = 0; r < m; r++) {
		let allZero = true;
		for (let c = 0; c < n; c++) {
			if (Math.abs(M[r][c]) > EPS) {
				allZero = false;
				break;
			}
		}
		if (allZero && Math.abs(M[r][n]) > EPS) {
			throw new Error('System has no solution');
		}
	}

	const Ared: Matrix = [];
	const bred: Vector = [];
	for (let r = 0; r < m; r++) {
		let allZero = true;
		for (let c = 0; c < n; c++) {
			if (Math.abs(M[r][c]) > EPS) {
				allZero = false;
				break;
			}
		}
		if (!allZero) {
			Ared.push(M[r].slice(0, n));
			bred.push(M[r][n]);
		}
	}

	return { Ared, bred };
}

// ---------- 2. Square Gaussian elimination (small n) ----------

function gaussianEliminationSquare(A: Matrix, b: Vector): Vector {
	const n = A.length;
	if (n === 0) throw new Error('Empty matrix');
	if (A[0].length !== n) {
		throw new Error(`Matrix must be square: got ${n} x ${A[0].length}`);
	}
	if (b.length !== n) {
		throw new Error('Right-hand side length mismatch');
	}

	const M: number[][] = A.map((row, i) => [...row, b[i]]);

	// Forward elimination
	for (let col = 0; col < n; col++) {
		let maxRow = col;
		for (let r = col + 1; r < n; r++) {
			if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) {
				maxRow = r;
			}
		}
		if (Math.abs(M[maxRow][col]) < EPS) {
			throw new Error('Matrix is singular or nearly singular');
		}
		if (maxRow !== col) {
			[M[col], M[maxRow]] = [M[maxRow], M[col]];
		}

		const pivot = M[col][col];
		for (let c = col; c <= n; c++) {
			M[col][c] /= pivot;
		}

		for (let r = col + 1; r < n; r++) {
			const factor = M[r][col];
			if (Math.abs(factor) < EPS) continue;
			for (let c = col; c <= n; c++) {
				M[r][c] -= factor * M[col][c];
			}
		}
	}

	// Back substitution
	const x: Vector = new Array(n).fill(0);
	for (let i = n - 1; i >= 0; i--) {
		let sum = M[i][n];
		for (let j = i + 1; j < n; j++) {
			sum -= M[i][j] * x[j];
		}
		x[i] = sum / M[i][i];
	}

	return x;
}

// ---------- 3. Build param: x = a + B * t (multi-dim) ----------

function buildParam(
	Ared: Matrix,
	bred: Vector,
): { a: Vector; B: number[][]; freeDim: number } {
	const m = Ared.length;
	const n = Ared[0].length;

	const isPivotCol: boolean[] = new Array(n).fill(false);
	const pivotColOfRow: number[] = new Array(m).fill(-1);

	for (let r = 0; r < m; r++) {
		let pc = -1;
		for (let c = 0; c < n; c++) {
			if (Math.abs(Ared[r][c]) > EPS) {
				pc = c;
				break;
			}
		}
		if (pc === -1) throw new Error('Unexpected zero row in Ared');
		pivotColOfRow[r] = pc;
		isPivotCol[pc] = true;
	}

	const freeCols: number[] = [];
	for (let c = 0; c < n; c++) {
		if (!isPivotCol[c]) freeCols.push(c);
	}

	const d = freeCols.length; // # free vars
	const a: Vector = new Array(n).fill(0);
	const B: number[][] = Array.from({ length: n }, () => new Array(d).fill(0));

	// free vars: x_f_k = t_k
	freeCols.forEach((f, k) => {
		a[f] = 0;
		B[f][k] = 1;
	});

	// pivot vars: x_p = bred[row] - Σ Ared[row][f_k] * t_k
	for (let r = 0; r < m; r++) {
		const p = pivotColOfRow[r];
		a[p] = bred[r];
		freeCols.forEach((f, k) => {
			B[p][k] = -Ared[r][f];
		});
	}

	return { a, B, freeDim: d };
}

// ---------- 4. 1D integer search (specialized) ----------

function solve1DIntegerMinSum(
	A: Matrix,
	b: Vector,
	a: Vector,
	B: number[][],
): Vector {
	const n = a.length;
	const m0 = A.length;
	const bCol = B.map(row => row[0]); // n×1 -> n

	// bounds from x_j(t) >= 0
	let tMin = -Infinity;
	let tMax = Infinity;

	for (let j = 0; j < n; j++) {
		const aj = a[j];
		const bj = bCol[j];

		if (Math.abs(bj) < EPS) {
			if (aj < -EPS) {
				throw new Error('No nonnegative solution (constant component < 0)');
			}
			continue;
		}

		const bound = -aj / bj;
		if (bj > 0) {
			// t >= bound
			if (bound > tMin) tMin = bound;
		} else {
			// t <= bound
			if (bound < tMax) tMax = bound;
		}
	}

	if (tMin > tMax + 1e-6) {
		throw new Error('No real nonnegative solution');
	}

	const tStart = Math.ceil(tMin - 1e-9);
	const tEnd = Math.floor(tMax + 1e-9);

	let bestX: Vector | null = null;
	let bestSum = Infinity;

	for (let t = tStart; t <= tEnd; t++) {
		const xInt: Vector = new Array(n);
		let ok = true;

		for (let j = 0; j < n; j++) {
			const v = a[j] + bCol[j] * t;
			if (v < -EPS) {
				ok = false;
				break;
			}
			const r = Math.round(v);
			if (Math.abs(v - r) > 1e-6) {
				ok = false;
				break;
			}
			xInt[j] = r;
		}
		if (!ok) continue;

		// Check A * xInt == b (sanity, though param already enforces reduced system)
		for (let i = 0; i < m0 && ok; i++) {
			let s = 0;
			for (let j = 0; j < n; j++) s += A[i][j] * xInt[j];
			if (s !== b[i]) ok = false;
		}
		if (!ok) continue;

		const sum = xInt.reduce((acc, v) => acc + v, 0);
		if (sum < bestSum) {
			bestSum = sum;
			bestX = xInt.slice();
		}
	}

	if (bestX === null) {
		throw new Error('No nonnegative integer solution in 1D param range');
	}

	return bestX;
}

// ---------- 5. Vertex enumeration for d = 2 or 3 ----------

function solveMultiDIntegerMinSum(
	A: Matrix,
	b: Vector,
	a: Vector,
	B: number[][],
): Vector {
	const n = a.length;
	const m0 = A.length;
	const d = B[0].length; // freeDim (2 or 3)

	if (d < 2 || d > 3) {
		throw new Error('solveMultiDIntegerMinSum expects freeDim = 2 or 3');
	}

	// Constraints: a_j + B[j]·t >= 0 for all j
	const constraintsIdx: number[] = [];
	for (let j = 0; j < n; j++) {
		let nonZero = false;
		for (let k = 0; k < d; k++) {
			if (Math.abs(B[j][k]) > EPS) {
				nonZero = true;
				break;
			}
		}
		if (!nonZero) {
			// constraint is just a_j >= 0
			if (a[j] < -EPS) {
				throw new Error('No nonnegative solution (constant component < 0)');
			}
			continue;
		} else {
			constraintsIdx.push(j);
		}
	}

	if (constraintsIdx.length < d) {
		// Polyhedron is unbounded or degenerate; but with Ax=b and x>=0 this is unlikely.
		// You could add special handling here if needed.
	}

	// Helper: solve small d×d system
	function solveSmallSystem(H: Matrix, rhs: Vector): Vector {
		return gaussianEliminationSquare(H, rhs);
	}

	// Enumerate vertices by choosing d constraints and solving them as equalities
	const vertices: Vector[] = [];

	// Generate combinations of constraintsIdx choose d
	const idxCount = constraintsIdx.length;
	const chosen: number[] = new Array(d).fill(0);

	function backtrack(start: number, depth: number) {
		if (depth === d) {
			// Build H * t = -a_S
			const H: Matrix = [];
			const rhs: Vector = [];
			for (let tIdx = 0; tIdx < d; tIdx++) {
				const j = constraintsIdx[chosen[tIdx]];
				H.push(B[j].slice());
				rhs.push(-a[j]);
			}

			let t: Vector;
			try {
				t = solveSmallSystem(H, rhs);
			} catch {
				return; // singular combination, skip
			}

			// Check feasibility: a_j + B[j]·t >= 0 for all j
			for (let j = 0; j < n; j++) {
				let val = a[j];
				for (let k = 0; k < d; k++) {
					val += B[j][k] * t[k];
				}
				if (val < -1e-6) {
					return; // infeasible
				}
			}

			// Deduplicate vertices (up to epsilon)
			for (const v of vertices) {
				let same = true;
				for (let k = 0; k < d; k++) {
					if (Math.abs(v[k] - t[k]) > 1e-6) {
						same = false;
						break;
					}
				}
				if (same) return;
			}

			vertices.push(t);
			return;
		}

		for (let i = start; i <= idxCount - (d - depth); i++) {
			chosen[depth] = i;
			backtrack(i + 1, depth + 1);
		}
	}

	if (d >= 2) {
		backtrack(0, 0);
	}

	if (vertices.length === 0) {
		throw new Error('No vertices found; region may be unbounded or degenerate');
	}

	// Compute coordinate-wise bounds from vertices
	const tMin: number[] = new Array(d).fill(+Infinity);
	const tMax: number[] = new Array(d).fill(-Infinity);
	for (const v of vertices) {
		for (let k = 0; k < d; k++) {
			if (v[k] < tMin[k]) tMin[k] = v[k];
			if (v[k] > tMax[k]) tMax[k] = v[k];
		}
	}

	// Integer bounding box
	const tStart: number[] = tMin.map(v => Math.ceil(v - 1e-9));
	const tEnd: number[] = tMax.map(v => Math.floor(v + 1e-9));

	let bestX: Vector | null = null;
	let bestSum = Infinity;

	// Brute-force over integer grid in this box
	function dfs(dim: number, tCurr: number[]) {
		if (dim === d) {
			// Evaluate x(t)
			const xInt: Vector = new Array(n);
			let ok = true;

			for (let j = 0; j < n; j++) {
				let v = a[j];
				for (let k = 0; k < d; k++) {
					v += B[j][k] * tCurr[k];
				}
				if (v < -EPS) {
					ok = false;
					break;
				}
				const r = Math.round(v);
				if (Math.abs(v - r) > 1e-6) {
					ok = false;
					break;
				}
				xInt[j] = r;
			}
			if (!ok) return;

			// If you fully trust the param from Ared, you can skip this,
			// but we keep the check for safety:
			for (let i = 0; i < m0 && ok; i++) {
				let s = 0;
				for (let j = 0; j < n; j++) s += A[i][j] * xInt[j];
				if (s !== b[i]) ok = false;
			}
			if (!ok) return;

			const sum = xInt.reduce((acc, v) => acc + v, 0);
			if (sum < bestSum) {
				bestSum = sum;
				bestX = xInt.slice();
			}
			return;
		}

		for (let tVal = tStart[dim]; tVal <= tEnd[dim]; tVal++) {
			tCurr[dim] = tVal;
			dfs(dim + 1, tCurr);
		}
	}

	dfs(0, new Array(d).fill(0));

	if (bestX === null) {
		throw new Error('No nonnegative integer solution in multi-D param range');
	}

	return bestX;
}

// ---------- 6. Main solver ----------

export function solveMinSumNonnegativeIntegerGeneral(
	A: Matrix,
	b: Vector,
): Vector {
	const m0 = A.length;
	if (m0 === 0) throw new Error('Empty system');
	const n = A[0].length;
	if (b.length !== m0) throw new Error('Right-hand side length mismatch');

	const { Ared, bred } = reduceSystemToIndependent(A, b);
	const m = Ared.length; // rank(A)
	const freeDim = n - m; // nullspace dimension

	if (freeDim < 0) {
		throw new Error('More independent equations than unknowns');
	}

	// Unique solution case: rank = n
	if (freeDim === 0) {
		const x = gaussianEliminationSquare(Ared, bred);
		const xInt: Vector = new Array(n);
		for (let j = 0; j < n; j++) {
			if (x[j] < -EPS) throw new Error('Unique solution is not nonnegative');
			const r = Math.round(x[j]);
			if (Math.abs(x[j] - r) > 1e-6) {
				throw new Error('Unique solution is not integer');
			}
			xInt[j] = r;
		}
		// Sanity-check original system
		for (let i = 0; i < m0; i++) {
			let s = 0;
			for (let j = 0; j < n; j++) s += A[i][j] * xInt[j];
			if (s !== b[i]) throw new Error('Solution mismatch after reduction');
		}
		return xInt;
	}

	// Build parametric form x = a + B t
	const { a, B, freeDim: d } = buildParam(Ared, bred);

	// 1D nullspace: rank = n - 1
	if (d === 1) {
		return solve1DIntegerMinSum(A, b, a, B);
	}
	// 2D or 3D nullspace: rank = n - 2 or n - 3
	if (d === 2 || d === 3) {
		return solveMultiDIntegerMinSum(A, b, a, B);
	}

	// Free dimension bigger than 3: not supported by this fast method
	throw new Error(
		`Nullspace dimension ${d} not supported (only up to 3 supported)`,
	);
}
