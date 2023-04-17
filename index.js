const [board] = document.getElementsByClassName("board");
const numbers = document.getElementsByClassName("number");
const [restartButton] = document.getElementsByClassName("restart");

let startGrid = null;
let solutionGrid = null;

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => `Digit${number}`);

let currentItem = null;

function handleNumberClick(number) {
  if (!currentItem) return;

  const { isHidden, coordinates } = currentItem.dataset;

  if (!isHidden) return;

  const [x, y] = coordinates;

  const solutionValue = solutionGrid[x][y];

  if (solutionValue !== parseInt(number)) return;

  startGrid[x][y] = number;
  currentItem.innerText = number;
}

function handleItemClick(event) {
  currentItem?.classList.remove("active");

  event.target.classList.add("active");
  currentItem = event.target;
}

function handleKeyDown(event) {
  if (!digits.includes(event.code)) return;

  const number = event.code.split("Digit")[1];

  handleNumberClick(number);
}

function createItem(coordinates, value, isHidden) {
  const item = document.createElement("div");

  item.classList.add("item");
  item.dataset.coordinates = coordinates;
  item.dataset.isHidden = isHidden;
  item.dataset.value = value;

  if (!isHidden) {
    item.innerText = value;
  }

  item.addEventListener("click", handleItemClick);
  document.addEventListener("keydown", handleKeyDown);

  return item;
}

async function fetchSudoku() {
  // const { data } = await axios.get("https://sudoku-api.vercel.app/api/dosuku");

  const { data } = {
    data: {
      newboard: {
        grids: [
          {
            value: [
              [5, 0, 0, 2, 8, 0, 0, 0, 6],
              [0, 3, 0, 4, 5, 7, 2, 0, 9],
              [0, 0, 0, 0, 6, 0, 3, 0, 8],
              [7, 9, 0, 8, 2, 0, 0, 0, 0],
              [0, 0, 0, 9, 0, 1, 8, 7, 0],
              [0, 8, 0, 0, 0, 0, 4, 0, 1],
              [0, 0, 4, 0, 0, 0, 0, 2, 0],
              [0, 6, 2, 0, 4, 0, 0, 0, 0],
              [0, 0, 0, 3, 0, 2, 0, 0, 0],
            ],
            solution: [
              [5, 1, 9, 2, 8, 3, 7, 4, 6],
              [8, 3, 6, 4, 5, 7, 2, 1, 9],
              [4, 2, 7, 1, 6, 9, 3, 5, 8],
              [7, 9, 1, 8, 2, 4, 6, 3, 5],
              [6, 4, 5, 9, 3, 1, 8, 7, 2],
              [2, 8, 3, 5, 7, 6, 4, 9, 1],
              [3, 5, 4, 6, 1, 8, 9, 2, 7],
              [9, 6, 2, 7, 4, 5, 1, 8, 3],
              [1, 7, 8, 3, 9, 2, 5, 6, 4],
            ],
            difficulty: "Medium",
          },
        ],
        results: 1,
        message: "All Ok",
      },
    },
  };

  localStorage.setItem("initialGame", JSON.stringify(data));
  localStorage.setItem("currentGame", JSON.stringify(data));

  return data;
}

async function createBoard(newGame) {
  board.innerHTML = null;

  let data = JSON.parse(localStorage.getItem("initialGame"));

  if (newGame) {
    data = await fetchSudoku();
  }

  const { value, solution } = data.newboard.grids[0];

  startGrid = value;
  solutionGrid = solution;

  for (let x = 0; x < startGrid.length; x++) {
    const row = startGrid[x];

    for (let y = 0; y < row.length; y++) {
      const value = row[y];

      const coordinates = `${x}${y}`;
      let isHidden = false;

      if (value === 0) {
        isHidden = true;
      }

      const item = createItem(coordinates, value, isHidden);

      board.appendChild(item);
    }
  }
}

createBoard(true);

[...numbers].forEach((number) =>
  number.addEventListener("click", (event) => {
    const { number } = event.target.dataset;

    handleNumberClick(number);
  })
);

restartButton.addEventListener("click", () => {
  createBoard(false);
});
