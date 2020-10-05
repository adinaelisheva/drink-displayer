const selectContents = (() => {
  let ret = '';
  Object.keys(drinkMap).sort().forEach((key) => {    
    ret += `<option value="${key}">${key}</option>`;
  });
  return ret;
})();

const main = () => {
  document.querySelector('#submit').onclick = drawDrinks;
  document.querySelector('#random').onclick = surpriseMe;
  document.querySelector('#saveImg').onclick = saveImages;
  document.querySelector('#saveJSON').onclick = saveJSON;
  document.querySelector('#addDrink').onclick = addDrink;
  document.querySelector('#deleteDrink').onclick = deleteDrink;
  addRow(document.querySelector('.drinkContainer'));
};

window.onload = main;