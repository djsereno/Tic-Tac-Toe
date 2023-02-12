const gameBoard = (() => {
  const _boardArray = Array(9).fill('');
  let _currentPlayer = 'X';

  const display = () => console.table(_boardArray);
  const getBoardArray = () => [..._boardArray];
  const getCurrentPlayer = () => _currentPlayer;

  const pickCell = (index) => {
    if (_boardArray[index] !== '') return false;
    _boardArray[index] = _currentPlayer;
    _currentPlayer === 'X' ? (_currentPlayer = 'O') : (_currentPlayer = 'X');
    return _boardArray[index];
  };

  return { getBoardArray, getCurrentPlayer, pickCell, display };
})();

const displayController = (() => {
  const _boardNode = document.querySelector('.board');

  const renderBoard = () => {
    _clearBoard();
    const boardArray = gameBoard.getBoardArray();
    for (let i = 0; i < 9; i++) {
      const cellValue = boardArray[i];
      const cellNode = document.createElement('li');
      cellNode.classList.add('cell');
      cellNode.setAttribute('data-index', i);
      cellNode.innerText = cellValue;
      cellNode.addEventListener('click', _pickCell);
      _boardNode.appendChild(cellNode);
    }
  };

  const _clearBoard = () => {
    while (_boardNode.firstChild) {
      _boardNode.removeChild(_boardNode.firstChild);
    }
  };

  const _pickCell = (event) => {
    const index = event.currentTarget.getAttribute('data-index');
    player = gameBoard.pickCell(+index);
    if (player) event.currentTarget.innerText = player;
  };

  return { renderBoard };
})();

displayController.renderBoard();
