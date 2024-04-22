let numButtonHtml;
function renderNumbersGrid() {
  numButtonHtml = JSON.parse(localStorage.getItem('numButtonHtml')) || '';
  if(numButtonHtml !== '') {
    const gridElement = document.querySelector('.js-numbers-grid-layout');
    gridElement.innerHTML = numButtonHtml;
    addNumberButtonEvents();
    return;
  }

  const nums = [];
  for(let i = 0; i < 25; i++) 
    nums[i] = i + 1;

  let buttonCount = 1;
  while(nums.length !== 0) {
    const randIndex = Math.floor(Math.random() * nums.length);
    numButtonHtml += `
      <button class="js-number-button-${buttonCount} number-button">
        ${nums[randIndex]}
      </button>
    `;
    nums.splice(randIndex, 1);
    buttonCount++;
  }
  const gridElement = document.querySelector('.js-numbers-grid-layout');
  gridElement.innerHTML = numButtonHtml;
  addNumberButtonEvents();
  localStorage.setItem('numButtonHtml', JSON.stringify(numButtonHtml));
}
renderNumbersGrid();

function addNumberButtonEvents() {
  document.querySelectorAll('.number-button').forEach((btnElem, index) => {
    btnElem.addEventListener('click', () => {
      highlightMove(index + 1);
    });
  });
}

let colorLettersCount = 0;
let preColorLettersCount = null;
function coloringLetters() {
  if(preColorLettersCount === colorLettersCount)
    return;

  for(let i = 1; i <= 5; i++) {
    const letterElem = document.querySelector(`.js-letter:nth-last-child(${i})`);
    if(i <= colorLettersCount && !letterElem.classList.contains('add-color-to-letter')) {
      letterElem.classList.add('add-color-to-letter');
    } else if(i > colorLettersCount && letterElem.classList.contains('add-color-to-letter')) {
      letterElem.classList.remove('add-color-to-letter');
    }
  }

  const colorLetters = document.querySelectorAll('.color-letter');
  const disableCard = document.querySelector('.disable-card');
  const youWinElem = document.querySelector('.you-win');
  if(colorLettersCount === 5) {
    colorLetters.forEach((colorLetterElem) => {
      colorLetterElem.classList.add('animate-letter')
    });
    disableCard.classList.add('activate-disable-card');
    youWinElem.classList.add('animate-you-win');
  } else {
    colorLetters.forEach((colorLetterElem) => {
      colorLetterElem.classList.remove('animate-letter')
    });
    disableCard.classList.remove('activate-disable-card');
    youWinElem.classList.remove('animate-you-win');
  }
  preColorLettersCount = colorLettersCount;
}