import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const DiceRollPopUp = ({
  diceRoll,
  winningPosition,
  bets,
  totallosses,
  totalWinning
}) => {
  return (
    <div className="dice-roll-popup">
      <h2>Dice Rolled: {diceRoll}</h2>
      {winningPosition && <h2>Winning Position: {winningPosition}</h2>}
      {winningPosition && (
        <h2>
          Winnings : {totalWinning}
          <br />
          Losses : {totallosses}
          <br />
          <br />
          {totalWinning > totallosses
            ? `Congratulations you won $${
                totalWinning - totallosses
              } on position ${winningPosition}!`
            : `You lost $${totallosses - totalWinning}.`}
        </h2>
      )}
    </div>
  );
};

const App = () => {
  const [balance, setBalance] = useState(100);
  const [bets, setBets] = useState({});
  const [timer, setTimer] = useState(10);
  const [diceRoll, setDiceRoll] = useState(null);
  const [winningPosition, setWinningPosition] = useState(null);
  const [totallosses, setTotallosses] = useState(null);
  const [totalWinning, setTotalWinning] = useState(null);

  const handleBet = useCallback(
    (position) => {
      setBets((prevBets) => {
        const updatedBets = { ...prevBets };
        const currentBetAmount = updatedBets[position] || 0;
        updatedBets[position] = currentBetAmount + 1; // Increment the bet amount by $1
        return updatedBets;
      });
    },
    [setBets]
  );

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      // Disable all positions
      setBets({});
      setWinningPosition(null);

      // Wait for 2 seconds before rolling the dice
      setTimeout(() => {
        // Generate random number
        const rollResult = Math.floor(Math.random() * 6) + 1;
        setDiceRoll(rollResult);

        // Calculate the winnings/losses
        let totalWinnings = 0;
        for (const [position, amount] of Object.entries(bets)) {
          const parsedPosition = parseInt(position);
          const parsedAmount = parseInt(amount);

          if (parsedPosition === rollResult) {
            const winnings = parsedAmount * 2; // Double the bet amount for correct guess
            totalWinnings += winnings;
          }
        }
        setTotalWinning(totalWinnings);
        setTotallosses(Object.values(bets).reduce((a, b) => a + b, 0));
        setBalance(
          (prevBalance) =>
            prevBalance +
            totalWinnings -
            Object.values(bets).reduce((a, b) => a + b, 0)
        );

        // Show the winning position for 5 seconds
        setWinningPosition(rollResult);

        // Clear the board and reset the timer for the next round
        setTimeout(() => {
          setBets((prevBets) => ({}));
          setDiceRoll(null);
          setWinningPosition(null);
          setTimer(10);
        }, 5000);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="dice-game-container">
      <h1>Lets Play Some Dice!!</h1>
      <h2>Total Balance: ${balance}</h2>
      <h2>Time Remaining: {timer} seconds</h2>

      {timer === 0 && (
        <DiceRollPopUp
          diceRoll={diceRoll}
          winningPosition={winningPosition}
          bets={bets}
          totallosses={totallosses}
          totalWinning={totalWinning}
        />
      )}

      <div>
        <div>
          {Array.from({ length: 6 }, (_, index) => (
            <button
              className="dice-game-betting-button"
              key={index + 1}
              disabled={timer === 0}
              onClick={() => handleBet(index + 1)}
            >
              Dice {index + 1}
              <br />
              Bet {index + 1}: ${bets[index + 1] || 0}
            </button>
          ))}
        </div>
        {timer > 0 && <p>Place your bets by clicking on the button</p>}
      </div>
    </div>
  );
};

export default App;
