const selectContents = (() => {
  let ret = '';
  Object.keys(drinkMap).sort().forEach((key) => {    
    ret += `<option value="${key}">${key}</option>`;
  });
  return ret;
})();

const main = () => {
  ctx = document.getElementById('canvas').getContext('2d');
  ctx.strokeStyle = '#000000';
  document.querySelector('#submit').onclick = handleClick;
  document.querySelector('#random').onclick = surpriseMe;
  addRow();
};

window.onload = main;