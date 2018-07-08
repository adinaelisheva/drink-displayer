const formToJSONString = () => {
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
  return '["' + document.querySelector('#glassTypes').value + '",' + drinkJSON+ ']';
}

const formToJSON = () => {
  return JSON.parse(formToJSONString());
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

const download = (content, fileName, contentType) => {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

const saveImage = () => {
  const imgData = document.getElementById('canvas').toDataURL('image/png');
  window.location.href = imgData.replace('image/png', 'application/octet-stream');
}

const saveJSON = () => {
  download(formToJSONString(), 'drink.json', 'application/json');
}
