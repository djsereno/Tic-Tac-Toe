const Player = (playerSymbol) => {
  const symbol = playerSymbol;
  let _score = 0;
  let _isAi = false;

  const getScore = () => _score;
  const getAiStatus = () => _isAi;

  const initScore = () => {
    _score = 0;
    return _score;
  };

  const incrementScore = () => {
    _score += 1;
    return _score;
  };

  const makeMove = (options) => {
    return options[Math.floor(Math.random() * options.length)];
  };

  const toggleAI = () => {
    _isAi = !_isAi;
  };

  return { symbol, getAiStatus, getScore, makeMove, incrementScore, initScore, toggleAI };
};

playerX = Player('X');
playerO = Player('O');

const gameBoard = (() => {
  const _board = Array(9);
  let _currentPlayer;
  let _winner;
  let _winningCells;

  const display = () => console.table(_board);
  const getBoardArray = () => [..._board];
  const getCurrentPlayer = () => _currentPlayer;
  const getWinner = () => _winner;
  const getWinningCells = () => _winningCells;
  const getEmptyCells = () => {
    return _board.map((val, i) => (val === '' ? i : -1)).filter((val) => val >= 0);
  };

  const initBoard = () => {
    _board.fill('');
    _currentPlayer = playerX;
    _winner = false;
  };

  const pickCell = (index) => {
    if (_board[index] !== '') return false;
    _board[index] = _currentPlayer.symbol;
    _winningCells = _checkWinner();
    if (_winningCells) {
      _winningCells === -1 ? (_winner = 'Tie') : (_winner = _currentPlayer);
    }
    _currentPlayer === playerX ? (_currentPlayer = playerO) : (_currentPlayer = playerX);
    return true;
  };

  const _checkWinner = () => {
    if (_board[0] !== '' && _board[0] == _board[1] && _board[0] == _board[2]) return [0, 1, 2];
    if (_board[3] !== '' && _board[3] == _board[4] && _board[3] == _board[5]) return [3, 4, 5];
    if (_board[6] !== '' && _board[6] == _board[7] && _board[6] == _board[8]) return [6, 7, 8];
    if (_board[0] !== '' && _board[0] == _board[3] && _board[0] == _board[6]) return [0, 3, 6];
    if (_board[1] !== '' && _board[1] == _board[4] && _board[1] == _board[7]) return [1, 4, 7];
    if (_board[2] !== '' && _board[2] == _board[5] && _board[2] == _board[8]) return [2, 5, 8];
    if (_board[0] !== '' && _board[0] == _board[4] && _board[0] == _board[8]) return [0, 4, 8];
    if (_board[2] !== '' && _board[2] == _board[4] && _board[2] == _board[6]) return [2, 4, 6];
    if (_board.findIndex((val) => val === '') === -1) return -1;
    return false;
  };

  initBoard();

  return {
    getBoardArray,
    getEmptyCells,
    getCurrentPlayer,
    getWinner,
    getWinningCells,
    initBoard,
    pickCell,
    display,
  };
})();

const gameController = (() => {
  const _boardNode = document.querySelector('.board');
  const _cellNodes = document.querySelectorAll('.cell');
  const _gameResultNode = document.querySelector('.game-result');
  const _newGameBtn = document.querySelector('.new-game');
  const _newMatchBtn = document.querySelector('.new-match');
  const _playerXInfo = document.querySelector('#playerX-info');
  const _playerXName = document.querySelector('#playerX-name');
  const _playerXScore = document.querySelector('#playerX-score');
  const _playerXAIToggle = document.querySelector('#playerX-ai');
  const _playerOInfo = document.querySelector('#playerO-info');
  const _playerOName = document.querySelector('#playerO-name');
  const _playerOScore = document.querySelector('#playerO-score');
  const _playerOAIToggle = document.querySelector('#playerO-ai');

  const _clearBoard = () => {
    _cellNodes.forEach((cellNode) => {
      cellNode.innerText = '';
      cellNode.classList.value = 'cell';
    });
  };

  const _clickCell = (event) => {
    const index = event.currentTarget.getAttribute('data-index');
    _pickCell(index);
  };

  const _pickCell = (index) => {
    if (!gameBoard.getWinner()) {
      const currentPlayer = gameBoard.getCurrentPlayer();
      const validChoice = gameBoard.pickCell(+index);
      if (validChoice) {
        _cellNodes[index].innerText = currentPlayer.symbol;
        _cellNodes[index].classList.add('picked');
        _cellNodes[index].classList.add(currentPlayer.symbol);
      }
      const result = gameBoard.getWinner();
      result ? _handleGameEnd(result) : _initiateNextMove();
    }
  };

  const _handleGameEnd = (result) => {
    _boardNode.classList.add('game-over');

    if (result === 'Tie') {
      _gameResultNode.innerText = 'Tie Game!';
      _playerXInfo.classList.remove('current');
      _playerOInfo.classList.remove('current');
      return;
    } else if (result === playerX) {
      _playerXScore.innerText = playerX.incrementScore();
      _gameResultNode.innerText = `${_playerXName.value} Wins!`;
    } else if (result === playerO) {
      _playerOScore.innerText = playerO.incrementScore();
      _gameResultNode.innerText = `${_playerOName.value} Wins!`;
    }

    const winningCells = gameBoard.getWinningCells();
    _cellNodes[winningCells[0]].classList.add('winner');
    _cellNodes[winningCells[1]].classList.add('winner');
    _cellNodes[winningCells[2]].classList.add('winner');
    _cellNodes[winningCells[1]].classList.add('win2');
    _cellNodes[winningCells[2]].classList.add('win3');
  };

  const _initiateNextMove = () => {
    if (gameBoard.getWinner()) return;

    const currentPlayer = gameBoard.getCurrentPlayer();
    if (currentPlayer === playerX) {
      _playerXInfo.classList.add('current');
      _playerOInfo.classList.remove('current');
      _gameResultNode.innerText = `${_playerXName.value}'s Turn`;
    } else {
      _playerXInfo.classList.remove('current');
      _playerOInfo.classList.add('current');
      _gameResultNode.innerText = `${_playerOName.value}'s Turn`;
    }

    if (currentPlayer.getAiStatus()) {
      let move = currentPlayer.makeMove(gameBoard.getEmptyCells());
      _pickCell(move);
    }
  };

  const _startNewGame = () => {
    gameBoard.initBoard();
    _clearBoard();
    _gameResultNode.innerText = `${_playerXName.value}'s Turn`;
    _boardNode.classList.remove('game-over');
    _playerXInfo.classList.add('current');
    _playerOInfo.classList.remove('current');
    if (gameBoard.getCurrentPlayer().getAiStatus()) _initiateNextMove();
  };

  const _startNewMatch = () => {
    _playerXScore.innerText = playerX.initScore();
    _playerOScore.innerText = playerO.initScore();
    _startNewGame();
  };

  const _toggleAi = (player) => {
    player.toggleAI();
    _initiateNextMove();
  };

  _newGameBtn.addEventListener('click', _startNewGame);
  _newMatchBtn.addEventListener('click', _startNewMatch);
  _playerXAIToggle.addEventListener('change', () => _toggleAi(playerX));
  _playerOAIToggle.addEventListener('change', () => _toggleAi(playerO));
  _cellNodes.forEach((cellNode) => {
    cellNode.addEventListener('click', _clickCell);
  });

  return {};
})();
