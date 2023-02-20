const Player = (playerName, playerSymbol) => {
  const symbol = playerSymbol;
  const domNodes = { info: undefined, name: undefined, score: undefined, ai: undefined };
  let name = playerName;
  let _score = 0;
  let _isAi = false;
  let _AiMode = 'hard'; // This is currently hardcoded into the player, eventually add UI element to control

  const getAiStatus = () => _isAi;
  const toggleAI = () => (_isAi = !_isAi);

  const getMove = () => {
    return _AiMode === 'hard' ? monteCarlo(symbol) : gameBoard.getRandomCell();
  };

  const incrementScore = () => {
    _score += 1;
    domNodes.score.innerText = _score;
    return _score;
  };

  const initScore = () => {
    _score = 0;
    domNodes.score.innerText = 0;
    return _score;
  };

  return {
    domNodes,
    getAiStatus,
    getMove,
    incrementScore,
    initScore,
    name,
    symbol,
    toggleAI,
  };
};

const playerX = Player('Player 1', 'X');
const playerO = Player('Player 2', 'O');

const Board = () => {
  let _board = Array(9);
  let _emptyCells;
  let _winner;
  let _winningCells;

  const checkValidPick = (index) => _emptyCells.includes(index) && !_winner;
  const getBoardArray = () => [..._board];
  const setBoardArray = (array) => (_board = [...array]);
  const getEmptyCells = () => [..._emptyCells];
  const setEmptyCells = (array) => (_emptyCells = [...array]);
  const getRandomCell = () => _emptyCells[Math.floor(Math.random() * _emptyCells.length)];
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
    if (_board[2] && _board[2] == _board[4] && _board[2] == _board[6]) return [player, [6, 4, 2]];
    if (_emptyCells.length === 0) return ['Tie', []];
    return [false, false];
  };

  initBoard();

  return {
    checkValidPick,
    getBoardArray,
    setBoardArray,
    getEmptyCells,
    setEmptyCells,
    getRandomCell,
    getWinner,
    getWinningCells,
    initBoard,
    pickCell,
  };
};

const gameBoard = Board();

const gameController = (() => {
  const boardNode = document.querySelector('.board');
  const cellNodes = document.querySelectorAll('.cell');
  const gameResultNode = document.querySelector('.game-result');
  const newGameBtn = document.querySelector('.new-game');
  const newMatchBtn = document.querySelector('.new-match');
  let currentPlayer = playerX;

  const clickCell = (event) => {
    const index = event.currentTarget.getAttribute('data-index');
    makeMove(+index);
  };

  const makeMove = (index) => {
    if (!gameBoard.checkValidPick(index)) return;

    gameBoard.pickCell(index, currentPlayer);
    cellNodes[index].classList.add('picked', `player${currentPlayer.symbol}`, 'bg-image');
    const winner = gameBoard.getWinner();
    winner ? handleGameEnd(winner) : initiateNextMove();
  };

  const initiateNextMove = () => {
    if (gameBoard.getWinner()) return;

    currentPlayer === playerX ? (currentPlayer = playerO) : (currentPlayer = playerX);
    playerX.domNodes.info.classList.toggle('current');
    playerO.domNodes.info.classList.toggle('current');
    gameResultNode.innerText = `${currentPlayer.name}'s Turn`;

    if (currentPlayer.getAiStatus()) makeMove(currentPlayer.getMove());
  };

  const handleGameEnd = (winner) => {
    boardNode.classList.add('game-over');

    if (winner === 'Tie') {
      gameResultNode.innerText = 'Tie Game!';
      playerX.domNodes.info.classList.remove('current');
      playerO.domNodes.info.classList.remove('current');
      return;
    }

    winner.incrementScore();
    gameResultNode.innerText = `${winner.name} Wins!`;

    const winningCells = gameBoard.getWinningCells();
    cellNodes[winningCells[0]].classList.add('winner');
    cellNodes[winningCells[1]].classList.add('winner', 'delay');
    cellNodes[winningCells[2]].classList.add('winner', 'delay2');
  };

  const clearBoardDisplay = () => {
    cellNodes.forEach((cellNode) => {
      cellNode.classList.value = 'cell';
    });
  };

  const startNewGame = () => {
    gameBoard.initBoard();
    boardNode.classList.remove('game-over');
    currentPlayer = playerX;
    gameResultNode.innerText = `${playerX.domNodes.name.value}'s Turn`;
    playerX.domNodes.info.classList.add('current');
    playerO.domNodes.info.classList.remove('current');
    clearBoardDisplay();

    if (currentPlayer.getAiStatus()) makeMove(currentPlayer.getMove());
  };

  const startNewMatch = () => {
    playerX.initScore();
    playerO.initScore();
    startNewGame();
  };

  const toggleAi = (player) => {
    player.toggleAI();
    if (player.getAiStatus() && player === currentPlayer && !gameBoard.getWinner())
      makeMove(player.getMove());
  };

  const setDomNodes = (player) => {
    const domNodeNames = ['info', 'name', 'score', 'ai'];
    domNodeNames.forEach(
      (name) => (player.domNodes[name] = document.querySelector(`#player${player.symbol}-${name}`))
    );

    player.domNodes.ai.addEventListener('change', () => toggleAi(player));
    player.domNodes.name.addEventListener('change', () => {
      player.name = player.domNodes.name.value;
    });
  };

  setDomNodes(playerX);
  setDomNodes(playerO);

  newGameBtn.addEventListener('click', startNewGame);
  newMatchBtn.addEventListener('click', startNewMatch);
  cellNodes.forEach((cellNode) => {
    cellNode.addEventListener('click', clickCell);
  });

  return {};
})();

const monteCarlo = (symbol) => {
  let opponentSymbol;
  symbol === 'X' ? (opponentSymbol = 'O') : (opponentSymbol = 'X');

  const target = Player('target', symbol);
  const opponent = Player('opponent', opponentSymbol);
  const players = [target, opponent];
  let current = 0;

  // Keep track of the win rates based on the first move
  const winRates = {};
  gameBoard.getEmptyCells().forEach((option) => (winRates[option] = 0));

  for (let i = 0; i < 10000; i++) {
    // Clone the existing game board to run the simulations on
    const boardClone = Board();
    boardClone.setBoardArray(gameBoard.getBoardArray());
    boardClone.setEmptyCells(gameBoard.getEmptyCells());

    // Make the first move at random
    let firstMove = boardClone.getRandomCell();
    boardClone.pickCell(firstMove, target);

    // Simulate the game on the cloned board by making moves at random until game over
    while (!boardClone.getWinner()) {
      current = +!current;
      let move = boardClone.getRandomCell();
      boardClone.pickCell(move, players[current]);
    }

    // Determine the winner of the simulation and rank the first move based on the outcome of the game
    let winner = boardClone.getWinner();
    if (winner === target) winRates[firstMove] += 1;
    if (winner === 'Tie') winRates[firstMove] += 0.5;
    if (winner === opponent) winRates[firstMove] -= 1;
  }

  // Return the best performing first move
  let bestMove;
  let bestRank = -Infinity;
  Object.keys(winRates).forEach((key) => {
    if (winRates[key] >= bestRank) {
      bestRank = winRates[key];
      bestMove = key;
    }
  });

  return +bestMove;
};
