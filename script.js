const gameBoard = (() => {
  const boardArray = Array(9).fill('');

  const display = () => console.table(boardArray);

  return { boardArray, display };
})();

const displayController = (() => {
  const _boardNode = document.querySelector('.board');

  const renderBoard = () => {
    _clearBoard();
    gameBoard.boardArray.forEach((cellValue) => {
      const cellNode = document.createElement('li');
      cellNode.classList.add('cell');
      cellNode.innerText = cellValue;
      cellNode.addEventListener('click', _pickCell);
      _boardNode.appendChild(cellNode);
    });
  };

  const _clearBoard = () => {
    while (_boardNode.firstChild) {
      _boardNode.removeChild(_boardNode.firstChild);
    }
  };

  const _pickCell = (event) => {
    const cell = event.currentTarget;
    cell.innerText === '' ? (cell.innerText = 'X') : console.log('cell occupied');
  };

  return { renderBoard };
})();

displayController.renderBoard();