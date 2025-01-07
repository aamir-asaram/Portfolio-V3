const Grid = () => {
  var value = '.'; // by default
  var grid = [...Array(5)].map((_, i) => Array(11).fill(value));
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      if (j % 2 === 0) {
        // grid[i][j] = `${i},${j}`; // Set the cell value to its coordinates
      }
    }
  }

  let piece = [
    ['.', 'x', '.'],
    ['x', 'x', 'x'],
    ['.', 'x', '.'],
  ]

  // return a div with a grid of 5 rows and 11 columns
  // if grid[i][j] is a dot, render a div with a class of "dot"
  return (
    <div className="h-[500px] w-screen bg-pink-50 grid grid-rows-5 grid-cols-11">
      {grid.map((row) => {
        return row.map((cell) => {
          if (cell === '.') {
            return <div className="bg-blue-300 border flex justify-center items-center">{cell}</div>;
          } else {
            return <div className="bg-red-300 border flex justify-center items-center">{cell}</div>;
          }
        });
      })}
    </div>
  );
}

export default Grid;