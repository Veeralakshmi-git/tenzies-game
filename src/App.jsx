import React from 'react';
import Die from './Die';
import { v4 } from 'uuid';
import Confetti from 'react-confetti';

function App() {
  const [dice, setDie] = React.useState(allNewDice());
  const [Tenzies, setTenzies] = React.useState(false);
  const [roll, setRoll] = React.useState(0);
  const [start, setStart] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  
  if (seconds > 59) {
    setSeconds(0);
    setMinutes((minute) => minute + 1);
  }
  if (minutes > 59) {
    setMinutes(0);
    setHours((hour) => hour + 1);
  }
  if (hours > 24) {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  }

  React.useEffect(() => {
    let timer = setInterval(() => {
      if (!start) {
        return;
      }
      if (Tenzies) {
        return;
      }
      setSeconds((second) => second + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [start, !Tenzies]);

  React.useEffect(() => {
    const allHeld = dice.every((dies) => dies.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((dies) => dies.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: v4(),
    };
  }

  function allNewDice() {
    const newArra = [];
    for (let i = 0; i < 10; i++) {
      newArra.push(generateNewDice());
    }
    return newArra;
  }

  function holdDice(id) {
    setStart(true);
    if (Tenzies) {
      return;
    }
    setDie((oldDice) =>
      oldDice.map((change) => {
        return change.id === id
          ? { ...change, isHeld: !change.isHeld }
          : change;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function rollDice() {
    if (Tenzies) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setStart(false);
      setTenzies(false);
      setRoll(0);
      setDie(allNewDice());
      return;
    } else {
      setDie((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDice();
        })
      );
    }
    setRoll((x) => x + 1);
  }

  return (
    <main>
      {Tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      {!start && (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      )}
      {start && (
        <div className="start-menu">
          <h1 className="timer">
            Time {String(hours).padStart(2, '0')}:
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </h1>
          <h1 className="count-roll">Count: {roll}</h1>
        </div>
      )}

      <div className="dice-container">{diceElements}</div>
      <button onClick={rollDice} className="roll-dice">
        {Tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}

export default App;
