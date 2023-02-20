# Tic-Tac-Toe

<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Tic-Tac-Toe</h3>

  <p align="center">
    Tic Tac Toe with a Monte Carlo simulated AI.
    <br />
    <a href="https://djsereno.github.io/Tic-Tac-Toe/">Preview</a>
    ·
    <a href="https://github.com/djsereno/Tic-Tac-Toe/issues">Report Bug</a>
    ·
    <a href="https://github.com/djsereno/Tic-Tac-Toe/issues">Request Feature</a>
  </p>
</div>

## Built With

- Javascript
- HTML/CSS

## Monte Carlo AI

The AI is implemented using a Monte Carlo based simulation. The steps to determine the next best move are as follows:

1. Clone the existing game board in its current state to run the simulations on.
2. Make the initial move within the simulation at random. Take note of which cell was chosen.
3. Proceed making moves at random, while correctly alternating between the current player and the opponent.
4. Simulate the game until there is winner or until the game ends in a tie.
5. Rank how good the initial move is based on the outcome of the game. In this implementation, a win awards the initial move +1 point, a tie +0.5 points, and a loss -1 point.
6. Repeat steps 2-5 over and over. More simulations should result in a more accurate "best" initial move.
7. After all simulations are complete, make a move on the real game board based on the highest ranked initial move from the simulation.

Repeat these steps every time it is the AI's turn to make a move. Since the simulation starts based on the current state of the board, there will be less available moves to make as the game progresses, and the best move becomes more obvious. 

## Contact

Derek Sereno - [LinkedIn](https://www.linkedin.com/in/dereksereno/) - [Email](mailto:djsereno91@gmail.com)

Project Link: [https://github.com/djsereno/Tic-Tac-Toe/](https://github.com/djsereno/Tic-Tac-Toe/)

## Acknowledgments

- X and O icons by [flatvac](https://www.vecteezy.com/members/flatvac) at [Vecteezy.com](https://www.vecteezy.com/)
- Favicon by [icons8](https://icons8.com/)
