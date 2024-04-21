const diaLeftToRightNums = [1, 7, 13, 19, 25];
const diaRightToLeftNums = [5, 9, 13, 17, 21];

const stackHighlightNum = JSON.parse(localStorage.getItem('stackHighlightNum')) || [];
stackHighlightNum.forEach(btnNum => {
  const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
  btnElem.classList.add('highlight-number');
});

const stackActiveLine = JSON.parse(localStorage.getItem('stackActiveLine')) || {
  vertical: [],
  horizontal: [],
  diaLeftToRight: false,
  diaRightToLeft: false
};

const stackRedo = JSON.parse(localStorage.getItem('stackRedo')) || [];

function newGame() {
  localStorage.removeItem('numButtonHtml');
  renderNumbersGrid();
  if(stackHighlightNum.length === 0)
    return;
  while(stackHighlightNum.length !== 0) {
    const btnNum = stackHighlightNum.pop();
    const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
    btnElem.classList.remove('highlight-number');
  }
  updateStackHighlightNum();

  stackRedo.length = 0;
  updateStackRedo();

  colorLettersCount = 0;

  stackActiveLine.vertical.length = 0;
  stackActiveLine.horizontal.length = 0;
  stackActiveLine.diaLeftToRight = false;
  stackActiveLine.diaRightToLeft = false;
  updateStackActiveLine();
  
  coloringLetters();

  const allActiveLineElem = document.querySelectorAll('.active-line');
  allActiveLineElem.forEach(LineElem => {
    LineElem.classList.remove('active-line');
  });
}

function restoreVisualData() {
  if(stackHighlightNum.length < 5) 
    return;

  if(stackActiveLine.diaLeftToRight) {
    diaLeftToRightNums.forEach(btnNum => {
      const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
      if(!btnElem.classList.contains('inline-number'))
        btnElem.classList.add('inline-number');
    });
    const diaLeftToRightElem = document.querySelector('.diagonal-left-to-right');
    diaLeftToRightElem.classList.add('active-line');
    if(checkForWin()) return;
  }

  if(stackActiveLine.diaRightToLeft) {
    diaRightToLeftNums.forEach(btnNum => {
      const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
      if(!btnElem.classList.contains('inline-number'))
      btnElem.classList.add('inline-number');
    });
    const diaRightToLeftElem = document.querySelector('.diagonal-right-to-left');
    diaRightToLeftElem.classList.add('active-line');
    if(checkForWin()) return;
  }

  for(let lineIdx = 0; lineIdx < stackActiveLine.vertical.length; lineIdx++) {
    const verticalLineCode = stackActiveLine.vertical[lineIdx];
    for(let i = 0; i < 5; i++) {
      const btnElem = document.querySelector(`.js-number-button-${verticalLineCode + (5 * i)}`);
      if(!btnElem.classList.contains('inline-number'))
        btnElem.classList.add('inline-number');
    }
    const verticalLineElem = document.querySelector(`.js-vertical-line-${verticalLineCode}`);
    verticalLineElem.classList.add('active-line');
    if(checkForWin()) return;
  }

  for(let lineIdx = 0; lineIdx < stackActiveLine.horizontal.length; lineIdx++) {
    const horizontalLineCode = stackActiveLine.horizontal[lineIdx];
    for(let i = 1; i <= 5; i++) {
      const btnElem = document.querySelector(`.js-number-button-${(horizontalLineCode * 5) + i}`);
      if(!btnElem.classList.contains('inline-number'))
        btnElem.classList.add('inline-number');
    }
    const horizontalLineElem =document.querySelector(`.js-horizontal-line-${horizontalLineCode}`);
    horizontalLineElem.classList.add('active-line');
    if(checkForWin()) return;
  }
}
restoreVisualData();
coloringLetters();

function highlightMove(btnNum) {
  const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
  if(btnElem.classList.contains('highlight-number'))
    return;

  btnElem.classList.add('highlight-number');
  stackHighlightNum.push(btnNum);
  updateStackHighlightNum();
  stackRedo.length = 0;
  updateStackRedo();

  if(stackHighlightNum.length >= 5) {
    checkForPossibleLines(stackHighlightNum[stackHighlightNum.length - 1]);
    updateStackActiveLine();
    coloringLetters();
  }
}

function undoMove() {
  if(stackHighlightNum.length === 0)
    return;

  const btnNum = stackHighlightNum.pop();
  stackRedo.push(btnNum);
  const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
  btnElem.classList.remove('highlight-number');
  if(btnElem.classList.contains('inline-number')) {
    btnElem.classList.remove('inline-number');
    removePossibleLines(btnNum);
    updateStackActiveLine();
    coloringLetters();
  }
  updateStackHighlightNum();
  updateStackRedo();
}

function redoMove() {
  if(stackRedo.length === 0)
    return;

  const btnNum = stackRedo.pop();
  stackHighlightNum.push(btnNum);
  const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
  btnElem.classList.add('highlight-number');
  if(!btnElem.classList.contains('inline-number')) {
    checkForPossibleLines(btnNum);
    updateStackActiveLine();
    coloringLetters();
  }
  updateStackHighlightNum();
  updateStackRedo();
}

function checkForPossibleLines(currentBtnNum) {
  if(!stackActiveLine.diaLeftToRight && diaLeftToRightNums.find( btnNum => btnNum === currentBtnNum)) {
    let diaLefttoRightEligible = true;
    for(let i = 0; i < diaLeftToRightNums.length; i++) {
      const btnElem = document.querySelector(`.js-number-button-${diaLeftToRightNums[i]}`);
      if(!btnElem.classList.contains('highlight-number')) {
        diaLefttoRightEligible = false;
        break;
      }
    }
    if(diaLefttoRightEligible) {
      diaLeftToRightNums.forEach((btnNum) => {
        const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
        if(!btnElem.classList.contains('inline-number'))
          btnElem.classList.add('inline-number');
      });
      const diaLeftToRightElem = document.querySelector(`.diagonal-left-to-right`);
      diaLeftToRightElem.classList.add('active-line');
      stackActiveLine.diaLeftToRight = true;
      if(checkForWin()) return;
    }
  }

  if(!stackActiveLine.diaRightToLeft && diaRightToLeftNums.find( btnNum => btnNum === currentBtnNum)) {
    let diaRightToLeftEligible = true;
    for(let i = 0; i < diaRightToLeftNums.length; i++) {
      const btnElem = document.querySelector(`.js-number-button-${diaRightToLeftNums[i]}`);
      if(!btnElem.classList.contains('highlight-number')) {
        diaRightToLeftEligible = false;
        break;
      }
    }
    if(diaRightToLeftEligible) {
      diaRightToLeftNums.forEach((btnNum) => {
        const btnElem = document.querySelector(`.js-number-button-${btnNum}`);
        if(!btnElem.classList.contains('inline-number'))
          btnElem.classList.add('inline-number');
      });
      const diaRightToLeftElem = document.querySelector(`.diagonal-right-to-left`);
      diaRightToLeftElem.classList.add('active-line');
      stackActiveLine.diaRightToLeft = true;
      if(checkForWin()) return;
    }
  }

  const verticalLineCode = currentBtnNum % 5 || 5;
  let verticalLineEligible = true;
  for(let i = 0; i < 5; i++) {
    const btnElem = document.querySelector(`.js-number-button-${verticalLineCode + (5 * i)}`);
    if(!btnElem.classList.contains('highlight-number')) {
      verticalLineEligible = false;
      break;
    }
  }
  if(verticalLineEligible) {
    for(let i = 0; i < 5; i++) {
      const btnElem = document.querySelector(`.js-number-button-${verticalLineCode + (5 * i)}`);
      if(!btnElem.classList.contains('inline-number'))
        btnElem.classList.add('inline-number');
    }
    const verticalLineElem = document.querySelector(`.js-vertical-line-${verticalLineCode}`);
    verticalLineElem.classList.add('active-line');
    stackActiveLine.vertical.push(verticalLineCode);
    if(checkForWin()) return;
  }

  const horizontalLineCode = Math.floor(currentBtnNum / 5) - (currentBtnNum % 5 === 0 ? 1 : 0);
  let horizontalLineEligible = true;
  for(let i = 1; i <= 5; i++) {
    const btnElem = document.querySelector(`.js-number-button-${(horizontalLineCode * 5) + i}`);
    if(!btnElem.classList.contains('highlight-number')) {
      horizontalLineEligible = false;
      break;
    }
  }
  if(horizontalLineEligible) {
    for(let i = 1; i <= 5; i++) {
      const btnElem = document.querySelector(`.js-number-button-${(horizontalLineCode * 5) + i}`);
      if(!btnElem.classList.contains('inline-number'))
        btnElem.classList.add('inline-number');
    }
    const horizontalLineElem = document.querySelector(`.js-horizontal-line-${horizontalLineCode}`);
    horizontalLineElem.classList.add('active-line');
    stackActiveLine.horizontal.push(horizontalLineCode);
    if(checkForWin()) return;
  }
}

function checkForWin() {
  colorLettersCount++;
  if(colorLettersCount === 5)
    return true;
  return false;
}

function removePossibleLines(currentBtnNum) {  
  if(stackActiveLine.diaLeftToRight && diaLeftToRightNums.find(btnNum => btnNum === currentBtnNum)) {
    const diaLeftToRightElem = document.querySelector(`.js-diagonal-left-to-right`);
    diaLeftToRightElem.classList.remove('active-line');
    stackActiveLine.diaLeftToRight = false;
    colorLettersCount--;
  }

  if(stackActiveLine.diaRightToLeft && diaRightToLeftNums.find(btnNum => btnNum === currentBtnNum)) {
    const diaRightToLeftElem = document.querySelector(`.js-diagonal-right-to-left`);
    diaRightToLeftElem.classList.remove('active-line');
    stackActiveLine.diaRightToLeft = false;
    colorLettersCount--;
  }

  const verticalLineCode = currentBtnNum % 5 || 5;
  if(document.querySelector(`.js-vertical-line-${verticalLineCode}`).classList.contains('active-line')) {
    const verticalLineElem = document.querySelector(`.js-vertical-line-${verticalLineCode}`);
    verticalLineElem.classList.remove('active-line');
    stackActiveLine.vertical.pop();
    colorLettersCount--;
  }

  const horizontalLineCode = Math.floor(currentBtnNum / 5) - (currentBtnNum % 5 === 0 ? 1 : 0);
  if(document.querySelector(`.js-horizontal-line-${horizontalLineCode}`).classList.contains('active-line')) {
    const horizontalLineElem = document.querySelector(`.js-horizontal-line-${horizontalLineCode}`);
    horizontalLineElem.classList.remove('active-line');
    stackActiveLine.horizontal.pop();
    colorLettersCount--;
  }

  removeNonInlineNums();
}

function removeNonInlineNums() {
  stackHighlightNum.forEach(currentBtnNum => {
    const verticalLineCode = currentBtnNum % 5 || 5;
    const verticalLineElemActive = document.querySelector(`.js-vertical-line-${verticalLineCode}`).classList.contains('active-line');

    const horizontalLineCode = Math.floor(currentBtnNum / 5) - (currentBtnNum % 5 === 0 ? 1 : 0);
    const horizontalLineElemActive = document.querySelector(`.js-horizontal-line-${horizontalLineCode}`).classList.contains('active-line');
    
    let diaLeftToRightElemActive = false;
    if(stackActiveLine.diaLeftToRight && diaLeftToRightNums.find( btnNum => btnNum === currentBtnNum ))
      diaLeftToRightElemActive = true;

    let diaRightToLeftElemActive = false;
    if(stackActiveLine.diaRightToLeft && diaRightToLeftNums.find( btnNum => btnNum === currentBtnNum ))
      diaRightToLeftElemActive = true;

    if(!verticalLineElemActive
        && !horizontalLineElemActive
        && !diaLeftToRightElemActive
        && !diaRightToLeftElemActive)
      document.querySelector(`.js-number-button-${currentBtnNum}`).classList.remove('inline-number');
  });
}

function updateStackHighlightNum() {
  if(stackHighlightNum.length !== 0)
    localStorage.setItem('stackHighlightNum', JSON.stringify(stackHighlightNum));
  else
    localStorage.removeItem('stackHighlightNum');
}

function updateStackRedo() {
  if(stackRedo.length !== 0)
    localStorage.setItem('stackRedo', JSON.stringify(stackRedo));
  else
    localStorage.removeItem('stackRedo');
}

function updateStackActiveLine() {
  console.log(preColorLettersCount);
  console.log(colorLettersCount);
  if(preColorLettersCount !== colorLettersCount)
    localStorage.setItem('stackActiveLine', JSON.stringify(stackActiveLine));
  else
    localStorage.removeItem('stackActiveLine');
}