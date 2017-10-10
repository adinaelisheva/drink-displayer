const drinkMap = {
  'rum': {
    'color': '#D6C163',
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
  'coke': {
    'color': '#B5A276',
    'pattern': 'dots',
    'patternColor': '#E0D8C5',
    'patternOffset': true,
  },
  'sprite': {
    'color': '#F7FAAF',
    'pattern': 'dots',
    'patternColor': '#ffffff',
    'patternOffset': true,
  },
  'ginger ale': {
    'color': '#DEC357',
    'pattern': 'dots',
    'patternColor': '#ffffff',
    'patternOffset': true,
  },
  'lime juice': {
    'color': '#C3FAA7',
  },
  'orange juice': {
    'color': '#FAC569',
  },
};

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
      fillWithDots(0, start, 110, height + 10, drinkInfo.patternColor, drinkInfo.patternOffset);
      break;
    case 'stripes':
      fillWithStripes(0, start, 110, height + 10, drinkInfo.patternColor);
      break;
  }
  ctx.globalCompositeOperation = 'source-over';
}

const fillWithDots = (x,y,width,height,color,offset) => {
  ctx.fillStyle = color;
  let shiftAmt = 5;
  for(let j = y + 5; j < y + height; j+=7) {
    if (offset) {
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
  const height = Math.floor(layer[1] * 200);
  const drinkInfo = drinkMap[layer[0]];
  ctx.fillStyle = drinkInfo.color;
  ctx.fillRect(10, start, 100, height);
  fillWithPattern(drinkInfo, start, height);
  ctx.strokeRect(10.5, start+0.5, 100, height);
  return start + height;
};

const drawDrink = (drink) => {
  drink = convertToPercent(drink);
  let pos = 10;
  drink.forEach((item) => {
    pos = drawLayer(item, pos);
  });
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

  drinkInput.innerText = '[["rum",1],[ "gin",2], ["coke", 3]]';
};


window.onload = main;