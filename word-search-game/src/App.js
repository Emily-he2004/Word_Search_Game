import React, { useState } from "react";

function WordSearch() {
  const words = ["LEARN", "TEST", "HELLO"];
  const gridSize = 10;

  const generateGrid = () => {
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => "")
    );

    words.forEach((word) => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 8);
        let startX, startY;
        let canPlace = true;
        switch (direction) {
          case 0: // horizontal
            startX = Math.floor(Math.random() * (gridSize - word.length + 1));
            startY = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < word.length; i++) {
              if (grid[startY][startX + i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY][startX + i] = word[i];
              }
              placed = true;
            }
            break;
          case 1: // vertical
            startX = Math.floor(Math.random() * gridSize);
            startY = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY + i][startX] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY + i][startX] = word[i];
              }
              placed = true;
            }
            break;
          case 2: // diagonal (top-left to bottom-right)
            startX = Math.floor(Math.random() * (gridSize - word.length + 1));
            startY = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY + i][startX + i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY + i][startX + i] = word[i];
              }
              placed = true;
            }
            break;
          case 3: // diagonal (bottom-left to top-right)
            startX = Math.floor(Math.random() * (gridSize - word.length + 1));
            startY =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY - i][startX + i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY - i][startX + i] = word[i];
              }
              placed = true;
            }
            break;
          case 4: // horizontal reverse
            startX =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            startY = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < word.length; i++) {
              if (grid[startY][startX - i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY][startX - i] = word[i];
              }
              placed = true;
            }
            break;
          case 5: // vertical reverse
            startX = Math.floor(Math.random() * gridSize);
            startY =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY - i][startX] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY - i][startX] = word[i];
              }
              placed = true;
            }
            break;
          case 6: // diagonal reverse (top-right to bottom-left)
            startX =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            startY = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY + i][startX - i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY + i][startX - i] = word[i];
              }
              placed = true;
            }
            break;
          case 7: // diagonal reverse (bottom-right to top-left)
            startX =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            startY =
              gridSize -
              1 -
              Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
              if (grid[startY - i][startX - i] !== "") {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[startY - i][startX - i] = word[i];
              }
              placed = true;
            }
            break;
          default:
            break;
        }
      }
    });

    // Fill in remaining empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }
      }
    }

    return grid;
  };

  const [grid, setGrid] = useState(generateGrid());
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState({});
  const [giveUp, setGiveUp] = useState(false); // State to track if user gives up

  const handleCellClick = (row, col) => {
    const cellValue = grid[row][col];
    const wordIndex = words.findIndex((word) => word.includes(cellValue));
    if (wordIndex !== -1) {
      const word = words[wordIndex];
      const startIndex = word.indexOf(cellValue);
      const endIndex = startIndex + word.length - 1;
      const direction = getDirection(
        row,
        col,
        startIndex,
        endIndex,
        grid,
        wordIndex
      );

      if (direction !== null) {
        const newSelectedCells = { ...selectedCells };
        for (let i = startIndex; i <= endIndex; i++) {
          const newRow = row + direction.rowOffset * (i - startIndex);
          const newCol = col + direction.colOffset * (i - startIndex);
          newSelectedCells[`${newRow},${newCol}`] = true;
        }
        setSelectedCells(newSelectedCells);
        if (!foundWords.includes(word)) {
          setFoundWords([...foundWords, word]);
        }
      }
    }
  };

  const getDirection = (row, col, startIndex, endIndex, grid, wordIndex) => {
    const directions = [
      { rowOffset: 0, colOffset: 1 }, // horizontal
      { rowOffset: 1, colOffset: 0 }, // vertical
      { rowOffset: 1, colOffset: 1 }, // diagonal (top-left to bottom-right)
      { rowOffset: 1, colOffset: -1 }, // diagonal (top-right to bottom-left)
      { rowOffset: 0, colOffset: -1 }, // horizontal reverse
      { rowOffset: -1, colOffset: 0 }, // vertical reverse
      { rowOffset: -1, colOffset: -1 }, // diagonal reverse (top-right to bottom-left)
      { rowOffset: -1, colOffset: 1 }, // diagonal reverse (bottom-left to top-right)
    ];

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      let newRow = row + direction.rowOffset * (endIndex - startIndex);
      let newCol = col + direction.colOffset * (endIndex - startIndex);
      if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize &&
        grid[newRow][newCol] === words[wordIndex][endIndex]
      ) {
        return direction;
      }
    }
    return null;
  };

  const handleGiveUp = () => {
    setGiveUp(true);
  };

  const resetGame = () => {
    setGrid(generateGrid());
    setFoundWords([]);
    setSelectedCells({});
    setGiveUp(false);
  };

  return (
    <div className="word-search">
      <h1>Word Search</h1>
      <div className="gameboard">
        <div className="search-box">
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const isSelected = selectedCells[`${rowIndex},${colIndex}`];
                    const isUnfoundWordCell =
                      giveUp &&
                      !isSelected &&
                      words.some((word) => word.includes(cell));
                    const cellClass = isSelected
                      ? "found-word"
                      : isUnfoundWordCell
                      ? "unfound-word"
                      : "";

                    return (
                      <td
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={cellClass}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="action-buttons">
            <button onClick={resetGame}>Reset Game</button>
            <div>
              <button onClick={handleGiveUp}>Give up?</button>
            </div>
          </div>
          <p className="give-up-msg">
            <em>Get ready to see what you missed.</em>
          </p>
        </div>
        <div className="search-info">
          <div className="word-bank">
            <h2>Word Bank</h2>
            <ul>
              {words.map((word, index) => (
                <li
                  key={index}
                  className={foundWords.includes(word) ? "found-word-bank" : ""}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
          <div className="found-words">
            <h2>Found Words</h2>
            <ul>
              {foundWords.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordSearch;
