const selectContents = (() => {
  let ret = '';
  Object.keys(drinkMap).sort().forEach((key) => {    
    ret += `<option value="${key}">${key}</option>`;
  });
  return ret;
})();

let glassHeight;
const glassWidth = 150;

let ctx;

const convertToPercent = (glassType, drink) => {
  const total = drink.reduce((curVal, item) => {
    return curVal + item[1];
  }, 0);
  if (glassType === "martini") {
    // fancy trig to get the correct %s of a triangle
    let h1 = 0;
    let h2;
    let aG = glassHeight * glassHeight;
    drink.forEach((item) => {
      const aTrap = Math.floor((item[1] / total) * aG);
      h2 = Math.sqrt(aTrap + (h1 * h1));
      item[1] = (h2 - h1) / glassHeight;
      h1 = h2;
    });
  } else {
    drink.forEach((item) => {
      item[1] = item[1] / total;
    });
  }
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

const drawHighOrLowball = () => {
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(10.5,10.5);
  ctx.lineTo(10.5,3.5);
  ctx.lineTo(5.5,3.5);
  ctx.lineTo(5.5,glassHeight + 20.5);
  ctx.lineTo(glassWidth + 15.5,glassHeight + 20.5);
  ctx.lineTo(glassWidth + 15.5,3.5);
  ctx.lineTo(glassWidth + 10.5,3.5);
  ctx.lineTo(glassWidth + 10.5,10.5);
  ctx.stroke();
}

const drawGlass = (glassType) => {
  switch (glassType) {
    case "highball":
    case "lowball":
      drawHighOrLowball();
      break;
    case "champagne":
      break;
    case "martini":
      break;
  }
}

const drawDrink = (json) => {
  const glassType = json[0];
  glassHeight = glassTypeHeightMap[glassType];
  let drink = json[1];
  ctx.clearRect(0,0,1000,1000);
  drink = convertToPercent(glassType, drink);
  let pos = 10;
  drink.reverse().forEach((item) => {
    pos = drawLayer(item, pos);
  });
  
  drawGlass(glassType);
};

const formToJSON = () => {
  let drinkJSON = '[';
  let first = true;
  const children = document.querySelector('#form').children;
  for(let i = 0; i < children.length; i++) {
    let child = children[i];
    if (!first) {
      drinkJSON += ','
    } else {
      first = false;
    }
    drinkJSON += '["';
    drinkJSON += child.querySelector('select.drink').value;
    drinkJSON += '",';
    drinkJSON += child.querySelector('input.amount').value;
    drinkJSON += ']';
  }
  drinkJSON += ']';
  let ret = '["' + document.querySelector('#glassTypes').value + '",' + drinkJSON+ ']'
  return JSON.parse(ret);
}

const handleClick = () => {
  drawDrink(formToJSON());
};

const surpriseMe = () => {
  const rows = document.querySelector('#form').children;
  const drinks = Object.keys(drinkMap).sort();
  for(let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let index = Math.floor(Math.random() * Object.keys(drinkMap).length);
    row.querySelector('select.drink').value = drinks[index];
    row.querySelector('input.amount').value = Math.ceil(Math.random()*10);
  }
  handleClick();
}

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
  drinkAmount.value = 1;
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
  document.querySelector('#random').onclick = surpriseMe;
  addRow();
};

window.onload = main;