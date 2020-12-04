const colorMap = {
	0: {colorClass: 'red'},
	1: {colorClass: 'yellow'},
	2: {colorClass: 'green'},
	3: {colorClass: 'blue'},
	4: {colorClass: 'pink'},
	5: {colorClass: 'gray'}
};
const DEFAULT_MOVES = 30;
var initialMovesLeft;
var movesLeft;
const rows = 14;
const columns = 14;
const colors = 6;

function startGame() {
	randomizeSquareColors();
	movesLeft = initialMovesLeft;
	document.getElementById('moves-left-container').innerHTML = movesLeft;
	document.getElementById('game-level').innerHTML = (DEFAULT_MOVES - initialMovesLeft) + 1;
}

function populateSquares() {
	for (let i = 0; i < rows; i++) {
		var row = document.createElement('DIV');
		row.className = 'row r-' + i;
		for (let j = 0; j < columns; j++) {
			var column = document.createElement('DIV');
			column.className = 'square column c-' + j;
			column.id = 'r' + i + 'c' + j;
			row.appendChild(column);
		}
		document.getElementById('game-board').appendChild(row);
	}
}

function populateColors() {
	for (let i = 0; i < colors; i++) {
		var colorButton = document.createElement('BUTTON');
		const colorMapValue = colorMap[i];
		colorButton.className = 'color-button ' + colorMapValue.colorClass;
		colorButton.id = i;
		colorButton.onclick = (myButton) => changeColor(myButton.currentTarget.id);
		document.getElementById('color-button-container').appendChild(colorButton);
	}
}

function randomizeSquareColors() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			removeAllColorsFromSquare(i, j);
			const colorIndex = getRandomInt(0, colors);
			setColorOnSquare(i, j, colorIndex);
		}
	}
}

function setColorOnSquare(rowIndex, colIndex, colorIndex) {
	const colorMapValue = colorMap[colorIndex];
	document.getElementById('r' + rowIndex + 'c' + colIndex).classList.add(colorMapValue.colorClass);
	document.getElementById('r' + rowIndex + 'c' + colIndex).setAttribute('color-value', colorIndex);
}

function removeAllColorsFromSquare(rowIndex, colIndex) {
	for (let i = 0; i < colors; i++) {
		const colorMapValue = colorMap[i];
		document.getElementById('r' + rowIndex + 'c' + colIndex).classList.remove(colorMapValue.colorClass);
	}
}

function updateSquareColors(colorIndex) {
	let isAdjacent = true;
	const previousColor = document.getElementById('r' + 0 + 'c' + 0).getAttribute('color-value');
	let adjacencyMatrix = []
	//Default to empty list
	for (let i = 0; i < rows; i++) {
		adjacencyMatrix[i] = [];
		for (let j = 0; j < columns; j++) {
			adjacencyMatrix[i][j] = false;
		}
	}
	//Populate the adjacency matrix
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const squareColor = document.getElementById('r' + i + 'c' + j).getAttribute('color-value');
			const colorsMatch = squareColor == previousColor;
			adjacencyMatrix[i][j] = colorsMatch && checkIsAdjacentSquare(i, j, adjacencyMatrix);
		}
	}
	//Run again to handle edge cases
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const squareColor = document.getElementById('r' + i + 'c' + j).getAttribute('color-value');
			const colorsMatch = squareColor == previousColor;
			adjacencyMatrix[i][j] = colorsMatch && checkIsAdjacentSquare(i, j, adjacencyMatrix);
		}
	}
	//Set the square colors
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const squareColor = document.getElementById('r' + i + 'c' + j).getAttribute('color-value');
			const colorsMatch = squareColor == previousColor;
			adjacencyMatrix[i][j] = colorsMatch && checkIsAdjacentSquare(i, j, adjacencyMatrix);
			isAdjacent = checkIsAdjacentSquare(i, j, adjacencyMatrix);
			if (isAdjacent && colorsMatch) {
				removeAllColorsFromSquare(i, j);
				setColorOnSquare(i, j, colorIndex);
			}
		}
	}
}

function checkIsAdjacentSquare(rowIndex, colIndex, adjacencyMatrix) {
	let isAdjacent = rowIndex == 0 && colIndex == 0;
	if (!isAdjacent && rowIndex > 0) {
		isAdjacent = adjacencyMatrix[rowIndex-1][colIndex];
	}
	if (!isAdjacent && colIndex > 0) {
		isAdjacent = adjacencyMatrix[rowIndex][colIndex-1];
	}
	if (!isAdjacent && rowIndex < rows-1) {
		isAdjacent = adjacencyMatrix[rowIndex+1][colIndex];
	}
	if (!isAdjacent && colIndex < columns-1) {
		isAdjacent = adjacencyMatrix[rowIndex][colIndex+1];
	}
	return isAdjacent;
}

function checkAllColorsMatch() {
	let allMatch = true;
	const firstColor = document.getElementById('r' + 0 + 'c' + 0).getAttribute('color-value');
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const squareColor = document.getElementById('r' + i + 'c' + j).getAttribute('color-value');
			if (squareColor != firstColor) {
				allMatch = false;
			}
		}
	}
	return allMatch;
}

function startGameAgain() {
	document.getElementById('win-modal').style.display = 'none';
	document.getElementById('controls-section').style.display = 'block';
	initialMovesLeft--;
    startGame();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function changeColor(colorIndex) {
	updateSquareColors(colorIndex);
	const allMatching = checkAllColorsMatch();
	if (allMatching) {
		document.getElementById('win-modal').style.display = 'block';
		document.getElementById('controls-section').style.display = 'none';
		return;
	}
	movesLeft--;
	if (movesLeft <= 0) {
		document.getElementById('lose-modal').style.display = 'block';
		document.getElementById('controls-section').style.display = 'none';
		document.getElementById('lose-game-level').innerHTML = (DEFAULT_MOVES - initialMovesLeft) + 1;
	}
	document.getElementById('moves-left-container').innerHTML = movesLeft;
}

function resetGame() {
	document.getElementById('lose-modal').style.display = 'none';
	document.getElementById('controls-section').style.display = 'block';
	initialMovesLeft = DEFAULT_MOVES;
	startGame();
}

window.addEventListener('load', function() {
	document.getElementById('win-modal').style.display = 'none';
	populateSquares();
	populateColors();
	resetGame();
})