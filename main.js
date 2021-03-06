const colorMap = {
	0: {colorClass: 'red'},
	1: {colorClass: 'yellow'},
	2: {colorClass: 'green'},
	3: {colorClass: 'blue'},
	4: {colorClass: 'pink'},
	5: {colorClass: 'gray'},
	6: {colorClass: 'brown'},
	7: {colorClass: 'purple'},
	8: {colorClass: 'teal'},
	9: {colorClass: 'lightblue'}
};
var initialMovesLeft;
var movesLeft;
var DEFAULT_MOVES = 30;
var rows = 14;
var columns = 14;
var colors = 6;

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

function submitGameParams() {
	if (!isValidParams()) {
		return;
	}
	document.getElementById('error-container').style.display = 'none';
	rows = document.getElementById('grid-size-input').value;
	columns = document.getElementById('grid-size-input').value;
	colors = document.getElementById('num-colors-input').value;
	DEFAULT_MOVES = document.getElementById('num-moves-input').value;
	document.getElementById('win-modal').style.display = 'none';
	document.getElementById('game-inputs').style.display = 'none';
	document.getElementById('game-window').style.display = 'block';
	populateSquares();
	populateColors();
	resetGame();
}

function isValidParams() {
	let gridSizeInput = document.getElementById('grid-size-input').value;
	let colorInput = document.getElementById('num-colors-input').value;
	let numMovesInput = document.getElementById('num-moves-input').value;
	// Grid size must be between 2 and 20
	if (isNaN(gridSizeInput) || gridSizeInput < 2 || gridSizeInput > 20) {
		document.getElementById('error-container').style.display = 'block';
		document.getElementById('error-container').innerHTML = 'Grid size must be between 2 and 20';
		return false;
	}
	// Number of colors must be between 2 and 10
	if (isNaN(colorInput) || colorInput < 2 || colorInput > 10) {
		document.getElementById('error-container').style.display = 'block';
		document.getElementById('error-container').innerHTML = 'Number of colors must be between 2 and 10';
		return false;
	}
	// Number of moves must be between 10 and 50
	if (isNaN(numMovesInput) || numMovesInput < 10 || numMovesInput > 50) {
		document.getElementById('error-container').style.display = 'block';
		document.getElementById('error-container').innerHTML = 'Number of moves must be between 10 and 50';
		return false;
	}
	return true;
}

window.addEventListener('load', function() {
	document.getElementById('game-inputs').style.display = 'block';
	document.getElementById('game-window').style.display = 'none';
	document.getElementById('error-container').style.display = 'none';
	document.getElementById('grid-size-input').value = rows;
	document.getElementById('num-colors-input').value = colors;
	document.getElementById('num-moves-input').value = DEFAULT_MOVES;
})