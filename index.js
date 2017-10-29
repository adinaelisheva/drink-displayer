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
  "bitters": {
    'color': '#C2BA99',
    'pattern': 'dots',
    'patternColor': '#FFFFFF',
  }
};

const selectContents = (() => {
  let ret = '';
  Object.keys(drinkMap).forEach((key) => {    
    ret += `<option value="${key}">${key}</option>`;
  });
  return ret;
})();


const glassHeight = 100;
const glassWidth = 150;

let ctx;

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
  //drawDrink(???)
};

const removeRow = (id) => {
  const parent = document.querySelector('#form');
  const row = parent.querySelector(`#row${id}`);
  if (row && parent.childElementCount > 1) {
    parent.removeChild(row);
  }
}

const addRow = (siblingId) => {
  const parent = document.querySelector('#form');
  const id = parent.childElementCount + 1;

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('formrow');
  rowDiv.id = `row${id}`;

  const drinkList = document.createElement('select');
  drinkList.classList.add('drink');
  drinkList.innerHTML = selectContents;
  rowDiv.appendChild(drinkList);

  const drinkAmount = document.createElement('input');
  drinkAmount.classList.add('amount');
  drinkAmount.setAttribute('type','number');
  rowDiv.appendChild(drinkAmount);

  const minus = document.createElement('button');
  minus.innerHTML = '-';
  minus.onclick = () => { removeRow(id); }
  rowDiv.appendChild(minus);

  const plus = document.createElement('button');
  plus.innerHTML = '+';
  plus.onclick = () => { addRow(id); };
  rowDiv.appendChild(plus);

  if (!siblingId) {
    parent.appendChild(rowDiv);
    return;
  }

  const sibling = parent.querySelector(`#row${siblingId}`);
  if (sibling && sibling.nextSibling) {
    parent.insertBefore(rowDiv, sibling.nextSibling);
    return;
  }

  parent.appendChild(rowDiv);

}

const main = () => {
  ctx = document.getElementById('canvas').getContext('2d');
  ctx.strokeStyle = '#000000';
  document.querySelector('#submit').onclick = handleClick;

  addRow();

};

window.onload = main;