const drinkMap = {
  'bourbon': {
    'color': '#A18950',
    'pattern': 'stripes',
    'patternColor': '#000000',
  },
  'whiskey': {
    'color': '#CCB47C',
    'pattern': 'stripes',
    'patternColor': '#000000',
  },
  'brandy': {
    'color': '#968432',
    'pattern': 'stripes',
    'patternColor': '#CCC08D',
  },
  'rum': {
    'color': '#D6C163',
  },
  'creme de menthe': {
    'color': '#DFF7D5',
  },
  'creme de cacao': {
    'color': '#D6C47A',
  },
  'kahlua': {
    'color': '#AD7F42',
  },
  'tequila': {
    'color': '#E6FAE6',
  },
  'gin': {
    'color': '#F7F5B5',
  },
  'vodka': {
    'color': '#DEF9FF',
  },
  'cola': {
    'color': '#B5A276',
    'pattern': 'dots',
    'patternColor': '#E0D8C5',
  },
  'sprite': {
    'color': '#F7FAAF',
    'pattern': 'dots',
    'patternColor': '#ffffff',
  },
  'champagne': {
    'color': '#F2E896',
    'pattern': 'dots',
    'patternColor': '#ffffff',
  },
  'iced tea': {
    'color': '#E3BA3D',
  },
  'cherry juice': {
    'color': '#9C4343',
  },
  'ginger ale': {
    'color': '#DEC357',
    'pattern': 'dots',
    'patternColor': '#ffffff',
  },
  'lime juice': {
    'color': '#9FF27E',
  },
  'lemon juice': {
    'color': '#F5F5B3',
  },
  'tomato juice': {
    'color': '#D66413',
  },
  'pineapple juice': {
    'color': '#F2ED4E',
  },
  'orange juice': {
    'color': '#F5C451',
  },
  'tonic water': {
    'color': '#F2F1CE',
    'pattern': 'dots',
    'patternColor': '#ffffff',
  },
  'water': {
    'color': '#EDF7F6',
    'pattern': 'stripes',
    'patternColor': '#ffffff',
  },
  'milk': {
    'color': '#ffffff',
  },
  'cream': {
    'color': '#FAFAE3',
    'pattern': 'stripes',
    'patternColor': '#ffffff',
  },
  'sweet and sour mix': {
    'color': '#EDF5C4',
    'pattern': 'dots',
    'patternColor': '#FFFC4D',
  },
  'hard cider': {
    'color': '#DBC51F',
    'pattern': 'dots',
    'patternColor': '#F2E052',
  },
  'fireball': {
    'color': '#EBAF0C',
  },
  "peach schnapps": {
    'color': '#EBB65B',
  },
  "grenadine": {
    'color': '#D67E7E',
  },
};

const glassHeight = 100;
const glassWidth = 150;

let ctx;
let drinkInput;
let errorDiv;

const convertToPercent = (drink) => {
  const total = drink.reduce((curVal, item) => {
    return curVal + item[1];
  }, 0);
  drink.forEach((item) => {
    item[1] = item[1] / total;
  });
  return drink;
};

const fillWithPattern = (drinkInfo, start, height) => {
  if (!drinkInfo.pattern) {
    return;
  }
  ctx.globalCompositeOperation = 'source-atop';
  switch (drinkInfo.pattern) {
    case 'dots':
      fillWithDots(0, start, glassWidth + 10, height + 10, drinkInfo.patternColor, drinkInfo.patternOffset);
      break;
    case 'stripes':
      fillWithStripes(0, start, glassWidth + 10, height + 10, drinkInfo.patternColor);
      break;
  }
  ctx.globalCompositeOperation = 'source-over';
}

const fillWithDots = (x,y,width,height,color,offset) => {
  ctx.fillStyle = color;
  let shiftAmt = 5;
  for(let j = y + 5; j < y + height; j+=7) {
    if (offset !== false) {
      shiftAmt = shiftAmt === 3 ? 6 : 3;
    }
    for(let i = x + shiftAmt; i < x + width; i+=7) {      
      ctx.beginPath();
      ctx.arc(i,j,1,0,360);
      ctx.fill();
    }
  }
};

const fillWithStripes = (x,y,width,height,color) => {
  ctx.strokeStyle = color;
  for (let i = x; i < x + width + height; i+= 7) {
    ctx.beginPath();
    ctx.moveTo(i, y);
    ctx.lineTo(i - height - 10, y + height + 10);
    ctx.stroke();
  }

  ctx.strokeStyle = '#000000';
};

const drawLayer = (layer, start) => {
  const height = Math.floor(layer[1] * glassHeight);
  const drinkInfo = drinkMap[layer[0]];
  ctx.fillStyle = drinkInfo.color;
  ctx.fillRect(10, start, glassWidth, height);
  fillWithPattern(drinkInfo, start, height);
  ctx.strokeRect(10.5, start+0.5, glassWidth, height);
  return start + height;
};

const drawDrink = (drink) => {
  drink = convertToPercent(drink);
  let pos = 10;
  drink.reverse().forEach((item) => {
    pos = drawLayer(item, pos);
  });

  // Draw the glass.
  ctx.beginPath();
  ctx.moveTo(10.5,10.5);
  ctx.lineTo(10.5,8.5);
  ctx.lineTo(5.5,8.5);
  ctx.lineTo(5.5,glassHeight + 12.5);
  ctx.lineTo(glassWidth + 15.5,glassHeight + 12.5);
  ctx.lineTo(glassWidth + 15.5,8.5);
  ctx.lineTo(glassWidth + 10.5,8.5);
  ctx.lineTo(glassWidth + 10.5,10.5);
  ctx.stroke();
};

const handleClick = () => {
  if (errorDiv.innerText !== '') {
    return;
  }
  drawDrink(JSON.parse(drinkInput.value));
};

const checkForError = () => {
  try {
    JSON.parse(drinkInput.value);
  } catch(e) {
    errorDiv.innerText = 'Error: invalid JSON';
    return;
  }
  errorDiv.innerText = '';
};

const main = () => {
  ctx = document.getElementById('canvas').getContext('2d');
  ctx.strokeStyle = '#000000';
  drinkInput = document.getElementById('data');
  errorDiv = document.getElementById('error');
  document.getElementById('submit').onclick = handleClick;
  drinkInput.onkeyup = checkForError;

  let drinkListHtml = '<h3>Drinks:</h3><ul>';
  let inputStartStr = '[';
  Object.keys(drinkMap).forEach((item) => {
    drinkListHtml += `<li>${item}</li>`;
    if(inputStartStr.length > 1) {
      inputStartStr += ',';
    }
    inputStartStr += `["${item}", 1]`;
  });
  drinkListHtml += '</ul>';
  inputStartStr += `]`;
  document.getElementById('info').innerHTML = drinkListHtml;
  
  drinkInput.innerText = inputStartStr;

};

window.onload = main;