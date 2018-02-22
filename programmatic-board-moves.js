// fastest checkmate
let moves = [
	[53,37],
	[12,28],
	[54,38],
	[3,39]
].reverse();

const getSquare = n => document.getElementById(n);
const selectSquare = n => getSquare(n).click();
const moveFromSquareToSquare = async (n,m) => {
	await selectSquare(n);
	await selectSquare(m);
}

const prepareBoard = arr => moveFromSquareToSquare(...arr);
const makeMoves = arr => {
	const move = arr.pop();
	if (!move) return console.log("board ready");

	let timer;
	clearTimeout(timer);
	timer = setTimeout(() => {
		prepareBoard(move)
		makeMoves(arr)
	}, 200);
}

// check at index 3
let moves = [
	[53,45],
	[12,28],
	[45,37],
	[3,39],
  [54,46]
].reverse();
