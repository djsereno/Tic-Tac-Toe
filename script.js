const Player = (playerSymbol) => {
  const symbol = playerSymbol;
  let _score = 0;

  const getScore = () => _score;
  const initScore = () => {
    _score = 0;
    return _score;
  };

  const incrementScore = () => {
    _score += 1;
    return _score;
  };

  return { symbol, getScore, incrementScore, initScore };
};

player1 = Player('X');
player2 = Player('O');

const gameBoard = (() => {
  const _board = Array(9);
  let _currentPlayer;
  let _winner;

  const display = () => console.table(_board);
  const getBoardArray = () => [..._board];
  const getCurrentPlayer = () => _currentPlayer;
  const getGameActive = () => _gameActive;
  const getWinner = () => _winner;

  const initBoard = () => {
    _board.fill('');
    _player1 = player1.symbol;
    _player2 = player2.symbol;
    _currentPlayer = _player1;
    _winner = false;
  };

  const pickCell = (index) => {
    if (_board[index] !== '') return false;
    _board[index] = _currentPlayer;
    _winner = _checkWinner();
    _currentPlayer === _player1 ? (_currentPlayer = _player2) : (_currentPlayer = _player1);
    return _board[index];
  };

  const _checkWinner = () => {
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

  initBoard();

  return {
    getBoardArray,
    getCurrentPlayer,
    getWinner,
    getGameActive,
    initBoard,
    pickCell,
    display,
  };
})();

const gameController = (() => {
  const _boardNode = document.querySelector('.board');
  const _gameResultNode = document.querySelector('.game-result');
  const _player1Name = document.querySelector('#player1-name');
  const _player1Score = document.querySelector('#player1-score');
  const _player2Name = document.querySelector('#player2-name');
  const _player2Score = document.querySelector('#player2-score');
  const _newGameBtn = document.querySelector('.new-game');
  const _newMatchBtn = document.querySelector('.new-match');

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
      if (result === 'Tie') {
        _gameResultNode.innerText = 'Tie Game!';
      } else if (result === player1.symbol) {
        _player1Score.innerText = player1.incrementScore();
        _gameResultNode.innerText = `${_player1Name.value} Wins!`;
      } else if (result === player2.symbol) {
        _player2Score.innerText = player2.incrementScore();
        _gameResultNode.innerText = `${_player2Name.value} Wins!`;
      }
    }
  };

  const _startNewGame = () => {
    gameBoard.initBoard();
    renderBoard();
    _gameResultNode.innerText = '';
  };

  const _startNewMatch = () => {
    _startNewGame();
    _player1Score.innerText = player1.initScore();
    _player2Score.innerText = player2.initScore();
  };

  _newGameBtn.addEventListener('click', _startNewGame);
  _newMatchBtn.addEventListener('click', _startNewMatch);

  return { renderBoard };
})();

gameController.renderBoard();
