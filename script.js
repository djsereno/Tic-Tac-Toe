const gameBoard = (() => {
  const _board = Array(9).fill('');
  let _currentPlayer = 'X';
  let _winner = false;

  const display = () => console.table(_board);
  const getBoardArray = () => [..._board];
  const getCurrentPlayer = () => _currentPlayer;
  const getGameActive = () => _gameActive;
  const getWinner = () => _winner;

  const pickCell = (index) => {
    if (_board[index] !== '') return false;
    _board[index] = _currentPlayer;
    _winner = _checkGameOver(_currentPlayer, index);
    _currentPlayer === 'X' ? (_currentPlayer = 'O') : (_currentPlayer = 'X');
    return _board[index];
  };

  // const _convertToIndex = (row, col) => {
  //   return row * 3 + col;
  // };

  // const _convertToRowCol = (index) => {
  //   return [Math.floor(index / 3), index % 3];
  // };

  const _checkGameOver = (player, index) => {
    if (_board.findIndex((val) => val === '') === -1) return 'Tie';
    if (_board[0] !== '' && _board[0] == _board[1] && _board[0] == _board[2]) return _board[0];
    if (_board[3] !== '' && _board[3] == _board[4] && _board[3] == _board[5]) return _board[3];
    if (_board[6] !== '' && _board[6] == _board[7] && _board[6] == _board[8]) return _board[6];
    if (_board[0] !== '' && _board[0] == _board[3] && _board[0] == _board[6]) return _board[0];
    if (_board[1] !== '' && _board[1] == _board[4] && _board[1] == _board[7]) return _board[1];
    if (_board[2] !== '' && _board[2] == _board[5] && _board[2] == _board[8]) return _board[2];
    if (_board[0] !== '' && _board[0] == _board[4] && _board[0] == _board[8]) return _board[0];
    if (_board[2] !== '' && _board[2] == _board[4] && _board[2] == _board[6]) return _board[2];
    return false;
  };

  return { getBoardArray, getCurrentPlayer, getWinner, getGameActive, pickCell, display };
})();

const displayController = (() => {
  const _boardNode = document.querySelector('.board');
  const _gameResultNode = document.querySelector('.game-result');

  const renderBoard = () => {
    _clearBoard();
    gameBoard.getBoardArray().forEach((cellValue, i) => {
      const cellNode = document.createElement('li');
      cellNode.classList.add('cell');
      cellNode.setAttribute('data-index', i);
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
    if (!gameBoard.getWinner()) {
      const index = event.currentTarget.getAttribute('data-index');
      player = gameBoard.pickCell(+index);
      if (player) event.currentTarget.innerText = player;

      const result = gameBoard.getWinner();
      if (result) {
        result === 'Tie'
          ? (_gameResultNode.innerText = 'Tie Game!')
          : (_gameResultNode.innerText = `${result} Wins!`);
      }
    }
  };

  return { renderBoard };
})();

displayController.renderBoard();
