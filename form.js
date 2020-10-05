function formToJSONString(container) {
  const glassJSON = `"${container.querySelector('#glassTypes').value}",`;
  let drinkJSON = '[';
  let first = true;
  const children = container.querySelector('#form').children;
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
  const nameJSON = `,"${container.querySelector('#name').value}"`;
  return `[${glassJSON}${drinkJSON}${nameJSON}]`;
}

function formToJSON(container) {
  return JSON.parse(formToJSONString(container));
}

function drawDrinks(event, drinkLimit) {
  const drinks =  document.querySelectorAll('.drinkContainer');
  const limit = drinkLimit ? drinkLimit : drinks.length;
  for (let i = 0; i < limit; i++) {
    drawDrink(drinks[i], formToJSON(drinks[i]));
  }
};

function surpriseMe() {
  // Surprise me only applies to drink #1
  const parent = document.querySelector('.drinkContainer');
  const rows = document.querySelector('#form').children;

  if (rows.length < 3) {
    // add more if the drink will be boring
    const goalRows = Math.floor(Math.random() * 3) + 3;
    const rowsToAdd = goalRows - rows.length;
    for(let i = 0; i < rowsToAdd; i++) {
      addRow(parent, rows[0].id);
    }
  }

  const glasses = Object.keys(glassTypeSizeMap); 
  let index = Math.floor(Math.random() * glasses.length);
  document.querySelector('#glassTypes').value = glasses[index];

  const drinks = Object.keys(drinkMap).sort();
  for(let i = 0; i < rows.length; i++) {
    const row = rows[i];
    index = Math.floor(Math.random() * drinks.length);
    row.querySelector('select.drink').value = drinks[index];
    row.querySelector('input.amount').value = Math.ceil(Math.random()*10);
  }

  const first = Math.floor(Math.random() * firstWords.length);
  const second = Math.floor(Math.random() * secondWords.length);;
  document.querySelector('#name').value = `${firstWords[first]} ${secondWords[second]}`;

  // no event to pass in, but limit it to drawing 1 drink
  drawDrinks(null, 1);

}

function removeRow(container, id) {
  const parent = container.querySelector('#form');
  const row = parent.querySelector(`#row${id}`);
  if (row && parent.childElementCount > 1) {
    parent.removeChild(row);
  }
  if (parent.childElementCount === 1) {
    parent.querySelector('.minusButton').setAttribute('disabled', 'true');
  }
}

function addRow(container, siblingId) {
  const parent = container.querySelector('#form');
  const id = parent.childElementCount + 1;

  if (parent.childElementCount === 1) {
    // enable the "minus" button
    parent.querySelector('.minusButton').removeAttribute('disabled');
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('formrow');
  rowDiv.classList.add('ingredient');
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
  minus.classList.add('minusButton');
  if (parent.childElementCount === 0) {
    minus.setAttribute('disabled', 'true');
  }
  minus.onclick = () => { removeRow(container, id); }
  rowDiv.appendChild(minus);

  const plus = document.createElement('button');
  plus.innerHTML = '+';
  plus.onclick = () => { addRow(container, id); };
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

function download(content, fileName, contentType) {
  var a = document.createElement('a');
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function saveImages() {
  drawDrinks();
  saveImage(0);
}

function saveImage(i) {
  const drinks =  document.querySelectorAll('.drinkContainer');
  if (i === drinks.length) {
    return;
  }
  const imgData = drinks[i].querySelector('#canvas').toDataURL('image/png');
  window.location.href = imgData.replace('image/png', 'application/octet-stream');
  setTimeout(() => {
    saveImage(i+1);
  }, 500);
}

function saveJSON() {
  const drinks =  document.querySelectorAll('.drinkContainer');
  let jsonString = '[';
  for (let i = 0; i < drinks.length; i++) {
    if (i > 0) {
      jsonString += ',';
    }
    jsonString += formToJSONString(drinks[i]);
  }
  jsonString += ']';
  download(jsonString, 'drinks.json', 'application/json');  
}

function addDrink() {
  const buttonContainer = document.querySelector('.containerButtons');
  const drinkContainer = document.querySelector('.drinkContainer');
  const newDrinkContainer = drinkContainer.cloneNode(true);

  // delete the copied rows and add a new one to start
  const formRows = newDrinkContainer.querySelectorAll('#form .formrow');
  for (let i = 0; i < formRows.length; i++) {
    const row = formRows[i];
    row.parentElement.removeChild(row);
  }
  addRow(newDrinkContainer);

  buttonContainer.insertAdjacentElement('beforebegin', newDrinkContainer);
  
  // There will always be > 1 drink after adding one, so enable the delete button
  document.querySelector('#deleteDrink').removeAttribute('disabled');

  const container = document.querySelector('.container');
  container.scrollLeft = container.scrollWidth;
}
function deleteDrink() {
  const drinkContainers = document.querySelectorAll('.drinkContainer');
  if(drinkContainers.length == 2) {
    document.querySelector('#deleteDrink').setAttribute('disabled', '');
  }
  const toDelete = drinkContainers[drinkContainers.length - 1];
  toDelete.parentElement.removeChild(toDelete);
}