import { useState } from 'react';
import './App.css';

const Square = ({ value, onSquareClick }) => {
  return (
    <div className="square" onClick={onSquareClick}>
      {value}
    </div>
  );
}

function calculate(squares) {
  let count = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) count = 0;
    else if (squares[i] === squares[i - 1]) count++;
    else count = 1;
    if (count === 5) return squares[i];
  }
  return null;
}
function calculateWinner(squares, index) {
  const x = Math.floor(index / 25);
  const y = index % 25;
  const row = squares.slice(25 * x, 25 * x + 24);
  const column = squares.filter((value, i) => (i % 25) === (index % 25));
  let mainDiagonal=[];
  let subDiagonal=[];
  let count=0;
  if (x-y>=0) {
    for (let i=Math.abs(x-y);i<25;i++){
      mainDiagonal[count]=squares[25*i+count];
      count++;
    }
  } else {
    count=0;
    for (let i=Math.abs(x-y);i<25;i++){
      mainDiagonal[count]=squares[25*count+i];
      count++;
    }
  }
  if (x+y-24<=0) {
    count=0;
    for (let i=x+y;i>=0;i--){
      subDiagonal[count]=squares[25*count+i];
      count++;
    }
  } else{
    count=0;
    for (let i=24;i>=(x+y-24);i--){
      subDiagonal[count]=squares[25*i+(x+y-i)];
      count++;
    }
  }
  if (calculate(subDiagonal)) return calculate(subDiagonal);
  if (calculate(mainDiagonal)) return calculate(mainDiagonal);
  if (calculate(column)) return calculate(column);
  return calculate(row);
}
const Status = ({ xIsNext, squares, currentIndex }) => {
  const winner = calculateWinner(squares, currentIndex);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else status = 'Next player: ' + (xIsNext ? 'X' : 'O');

  if (winner) return (
    <>
      <div className="status-winner">{status}</div>
    </>
  );
  else return (
    <>
      <div className="status">{status}</div>
    </>
  );
}

function Board({ xIsNext, squares, onPlay, currenIndex }) {
  function handleClick(i) {
    if (calculateWinner(squares, currenIndex) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }
  return (
    <>
      <Status xIsNext={xIsNext} squares={squares} currentIndex={currenIndex}></Status>
      <div className="board">
        {Array(625).fill(null).map((value,index) => (
          <Square value={squares[index]} onSquareClick={() => handleClick(index)} />
        ))}
        {/* {Array(625).fill(null).map((value, index) => (
          <Square value={index + "," + Math.floor(index / 25) + "," + (index % 25)} onSquareClick={() => handleClick(index)} />
        ))} */}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(625).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [currenIndex, setCurrenIndex] = useState(null);

  function handlePlay(nextSquares, currentIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setCurrenIndex(currentIndex);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currenIndex={currenIndex} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

