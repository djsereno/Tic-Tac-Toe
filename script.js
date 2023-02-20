const Player = (playerSymbol) => {
  const symbol = playerSymbol;
  const domNodes = {};
  let name;
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

  return { symbol, domNodes, getAiStatus, getScore, makeMove, incrementScore, initScore, toggleAI };
};

playerX = Player('X');
playerO = Player('O');

const gameBoard = (() => {
  const _board = Array(9);
  let _emptyCells;
  let _winner;
  let _winningCells;

  const checkValidPick = (index) => _emptyCells.includes(index) && !_winner;
  const getEmptyCells = () => [..._emptyCells];
  const getWinner = () => _winner;
  const getWinningCells = () => _winningCells;

  const initBoard = () => {
    _board.fill();
    _emptyCells = Array(9).fill(0);
    _emptyCells = _emptyCells.map((val, i) => i);
    _winner = false;
    _winningCells = false;
  };

  const pickCell = (index, player) => {
    if (!_emptyCells.includes(index)) return false;

    _board[index] = player.symbol;
    _emptyCells.splice(_emptyCells.indexOf(index), 1);
    [_winner, _winningCells] = _checkWinner(player);
    return true;
  };

  const _checkWinner = (player) => {
    if (_board[0] && _board[0] == _board[1] && _board[0] == _board[2]) return [player, [0, 1, 2]];
    if (_board[3] && _board[3] == _board[4] && _board[3] == _board[5]) return [player, [3, 4, 5]];
    if (_board[6] && _board[6] == _board[7] && _board[6] == _board[8]) return [player, [6, 7, 8]];
    if (_board[0] && _board[0] == _board[3] && _board[0] == _board[6]) return [player, [0, 3, 6]];
    if (_board[1] && _board[1] == _board[4] && _board[1] == _board[7]) return [player, [1, 4, 7]];
    if (_board[2] && _board[2] == _board[5] && _board[2] == _board[8]) return [player, [2, 5, 8]];
    if (_board[0] && _board[0] == _board[4] && _board[0] == _board[8]) return [player, [0, 4, 8]];
    if (_board[2] && _board[2] == _board[4] && _board[2] == _board[6]) return [player, [2, 4, 6]];
    if (_emptyCells.length === 0) return ['Tie', []];
    return [false, false];
  };

  initBoard();

  return {
    checkValidPick,
    getEmptyCells,
    getWinner,
    getWinningCells,
    initBoard,
    pickCell,
  };
})();

const gameController = (() => {
  const boardNode = document.querySelector('.board');
  const cellNodes = document.querySelectorAll('.cell');
  const gameResultNode = document.querySelector('.game-result');
  const newGameBtn = document.querySelector('.new-game');
  const newMatchBtn = document.querySelector('.new-match');
  let currentPlayer = playerX;

  const setDomNodes = (player) => {
    const domNodeNames = ['info', 'name', 'score', 'ai'];
    domNodeNames.forEach(
      (name) => (player.domNodes[name] = document.querySelector(`#player${player.symbol}-${name}`))
    );

    player.domNodes.name.addEventListener('change', () => {
      player.name = player.domNodes.name.value;
    });
  };

  const clearBoard = () => {
    cellNodes.forEach((cellNode) => {
      cellNode.classList.value = 'cell';
    });
  };

  const clickCell = (event) => {
    const index = event.currentTarget.getAttribute('data-index');
    pickCell(+index);
  };

  const pickCell = (index) => {
    if (!gameBoard.checkValidPick(index)) return;

    gameBoard.pickCell(index, currentPlayer);
    cellNodes[index].classList.add('picked', `player${currentPlayer.symbol}`, 'bg-image');

    const result = gameBoard.getWinner();
    result ? handleGameEnd(result) : initiateNextMove();
  };

  const handleGameEnd = (result) => {
    boardNode.classList.add('game-over');

    if (result === 'Tie') {
      gameResultNode.innerText = 'Tie Game!';
      playerX.domNodes.info.classList.remove('current');
      playerO.domNodes.info.classList.remove('current');
      return;
    } else if (result === playerX) {
      playerX.domNodes.score.innerText = playerX.incrementScore();
      gameResultNode.innerText = `${playerX.domNodes.name.value} Wins!`;
    } else if (result === playerO) {
      playerO.domNodes.score.innerText = playerO.incrementScore();
      gameResultNode.innerText = `${playerO.domNodes.name.value} Wins!`;
    }

    const winningCells = gameBoard.getWinningCells();
    cellNodes[winningCells[0]].classList.add('winner');
    cellNodes[winningCells[1]].classList.add('winner', 'delay');
    cellNodes[winningCells[2]].classList.add('winner', 'delay2');
  };

  const initiateNextMove = () => {
    if (gameBoard.getWinner()) return;

    if (currentPlayer === playerX) {
      currentPlayer = playerO;
      playerX.domNodes.info.classList.remove('current');
      playerO.domNodes.info.classList.add('current');
    } else {
      currentPlayer = playerX;
      playerO.domNodes.info.classList.remove('current');
      playerX.domNodes.info.classList.add('current');
    }
    gameResultNode.innerText = `${currentPlayer.domNodes.name.value}'s Turn`;

    if (currentPlayer.getAiStatus()) {
      let move = currentPlayer.makeMove(gameBoard.getEmptyCells());
      pickCell(move);
    }
  };

  const startNewGame = () => {
    gameBoard.initBoard();
    clearBoard();
    gameResultNode.innerText = `${playerX.domNodes.name.value}'s Turn`;
    boardNode.classList.remove('game-over');
    currentPlayer = playerX;
    playerX.domNodes.info.classList.add('current');
    playerO.domNodes.info.classList.remove('current');
    if (currentPlayer.getAiStatus()) {
      let move = currentPlayer.makeMove(gameBoard.getEmptyCells());
      pickCell(move);
    }
  };

  const startNewMatch = () => {
    playerX.domNodes.score.innerText = playerX.initScore();
    playerO.domNodes.score.innerText = playerO.initScore();
    startNewGame();
  };

  const toggleAi = (player) => {
    player.toggleAI();
    console.log(player === currentPlayer, !gameBoard.getWinner());
    if (player === currentPlayer && !gameBoard.getWinner())
      pickCell(player.makeMove(gameBoard.getEmptyCells()));
  };

  setDomNodes(playerX);
  setDomNodes(playerO);

  playerX.domNodes.ai.addEventListener('change', () => toggleAi(playerX));
  playerO.domNodes.ai.addEventListener('change', () => toggleAi(playerO));
  newGameBtn.addEventListener('click', startNewGame);
  newMatchBtn.addEventListener('click', startNewMatch);
  cellNodes.forEach((cellNode) => {
    cellNode.addEventListener('click', clickCell);
  });

  return {};
})();
