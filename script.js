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

player1 = Player('X');
player2 = Player('O');

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
    _currentPlayer = player1;
    _winner = false;
  };

  const pickCell = (index) => {
    if (_board[index] !== '') return false;
    _board[index] = _currentPlayer.symbol;
    _winningCells = _checkWinner();
    if (_winningCells) {
      _winningCells === -1 ? (_winner = 'Tie') : (_winner = _currentPlayer);
    }
    _currentPlayer === player1 ? (_currentPlayer = player2) : (_currentPlayer = player1);
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
  const _player1Info = document.querySelector('#player1-info');
  const _player1Name = document.querySelector('#player1-name');
  const _player1Score = document.querySelector('#player1-score');
  const _player1AIToggle = document.querySelector('#player1-ai');
  const _player2Info = document.querySelector('#player2-info');
  const _player2Name = document.querySelector('#player2-name');
  const _player2Score = document.querySelector('#player2-score');
  const _player2AIToggle = document.querySelector('#player2-ai');

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
      return;
    } else if (result === player1) {
      _player1Score.innerText = player1.incrementScore();
      _gameResultNode.innerText = `${_player1Name.value} Wins!`;
    } else if (result === player2) {
      _player2Score.innerText = player2.incrementScore();
      _gameResultNode.innerText = `${_player2Name.value} Wins!`;
    }

    const winningCells = gameBoard.getWinningCells();
    _cellNodes[winningCells[0]].classList.add('winner');
    _cellNodes[winningCells[1]].classList.add('winner');
    _cellNodes[winningCells[2]].classList.add('winner');
    _cellNodes[winningCells[1]].classList.add('win2');
    _cellNodes[winningCells[2]].classList.add('win3');
  };

  const _initiateNextMove = () => {
    const currentPlayer = gameBoard.getCurrentPlayer();
    _player1Info.classList.toggle('current');
    _player2Info.classList.toggle('current');
    if (currentPlayer.getAiStatus()) {
      let move = currentPlayer.makeMove(gameBoard.getEmptyCells());
      _pickCell(move);
    }
  };

  const _startNewGame = () => {
    console.log('-----NEW GAME-----');
    gameBoard.initBoard();
    _clearBoard();
    _gameResultNode.innerText = '';
    _boardNode.classList.remove('game-over');
    _player1Info.classList.add('current');
    _player2Info.classList.remove('current');
    if (gameBoard.getCurrentPlayer().getAiStatus()) _initiateNextMove();
  };

  const _startNewMatch = () => {
    _player1Score.innerText = player1.initScore();
    _player2Score.innerText = player2.initScore();
    _startNewGame();
  };

  const _toggleAi = (player) => {
    player.toggleAI();
    _initiateNextMove();
  };

  _newGameBtn.addEventListener('click', _startNewGame);
  _newMatchBtn.addEventListener('click', _startNewMatch);
  _player1AIToggle.addEventListener('change', () => _toggleAi(player1));
  _player2AIToggle.addEventListener('change', () => _toggleAi(player2));
  _cellNodes.forEach((cellNode) => {
    cellNode.addEventListener('click', _clickCell);
  });

  return {};
})();
