let glassHeight;
let glassWidth;

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

const drawStem = (ctx, x1, x2, y) => {
  // Note that this is going from right to left, so down in x.
  ctx.lineTo(x1, y + 100);
  ctx.lineTo(x1 + 20, y + 115);
  ctx.lineTo(x2 - 20, y + 115);
  ctx.lineTo(x2, y + 100);
  ctx.lineTo(x2, y);
};

const drawMartini = () => {
  const halfWidth = Math.floor(glassWidth/2);
  
  //upper left corner
  ctx.moveTo(2.5,3.5);
  
  //inner outline
  ctx.lineTo(8.5,3.5);
  ctx.lineTo(halfWidth + 5.5, glassHeight);
  ctx.lineTo(glassWidth + 12.5, 3.5);
  
  //remove the drink outside the glass
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  
  //upper right corner
  ctx.lineTo(glassWidth + 18.5, 3.5);
  
  //outer outline (with stem)
  ctx.lineTo(halfWidth + 8.5, glassHeight + 5.5);
  drawStem(ctx, halfWidth + 8.5, halfWidth + 2.5, glassHeight + 5.5);
  ctx.lineTo(2.5, 3.5);
  
  ctx.stroke();
  ctx.fill();
};

const drawChampagne = () => {
  const halfWidth = Math.floor(glassWidth/2);
  const r1x = 35;
  const r2x = glassWidth - 17; 
  const ry = glassHeight - 20;
  
  //upper left corner
  ctx.moveTo(5.5,3.5);
  
  // inner outline
  ctx.lineTo(10.5,3.5);
  ctx.lineTo(10.5, ry);
  ctx.arc(r1x, ry, 25, Math.PI, 0.5*Math.PI, true);
  ctx.lineTo(r2x, glassHeight + 5.5);
  ctx.arc(r2x, ry, 25, 0.5*Math.PI, 0, true);
  ctx.lineTo(glassWidth + 8.5, 3.5);
  
  //remove the drink outside the glass
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  //upper right corner
  ctx.lineTo(glassWidth + 13.5, 3.5);
  
  //outer outline (with stem)
  ctx.lineTo(glassWidth + 13.5, ry);
  ctx.arc(r2x, ry, 30, 0, 0.5*Math.PI);
  ctx.lineTo(halfWidth + 8.5, glassHeight + 10.5);
  drawStem(ctx, halfWidth + 8.5, halfWidth + 2.5, glassHeight + 10.5);
  ctx.lineTo(r1x, glassHeight + 10.5);
  ctx.arc(r1x, ry, 30, 0.5*Math.PI, Math.PI);
  ctx.lineTo(5.5, 3.5);
  
  ctx.stroke();
  ctx.fill();
}

const drawHighOrLowball = () => {
  ctx.moveTo(10.5,10.5);
  ctx.lineTo(10.5,3.5);
  ctx.lineTo(5.5,3.5);
  ctx.lineTo(5.5,glassHeight + 20.5);
  ctx.lineTo(glassWidth + 15.5,glassHeight + 20.5);
  ctx.lineTo(glassWidth + 15.5,3.5);
  ctx.lineTo(glassWidth + 10.5,3.5);
  ctx.lineTo(glassWidth + 10.5,10.5);
}

const drawGlass = (glassType) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  switch (glassType) {
    case "highball":
    case "lowball":
      drawHighOrLowball();
      break;
    case "champagne":
      drawChampagne();
      break;
    case "martini":
      drawMartini();
      break;
  }
  ctx.stroke();
}

const drawName = (name, x, y) => {
  ctx.font="14px monospace";
  ctx.fillStyle = "black";
  
  const lineLen = 19;

  if (name.length <= lineLen) {
    ctx.fillText(name, x, y);
    return;
  }
 
  while (name.length > lineLen) {
    // Try to find a breaking char close to lineLen
    let i = lineLen;
    while (name[i] !== ' ' && name[i] !== '-' && i >= 0) {
      i--;
    }
    if (i === -1) {
      i = lineLen;
    }
    const nextLine = name.substring(0, i).trim();
    name = name.substring(i).trim();
    ctx.fillText(nextLine, x, y);
    y += 15;
  }
  ctx.fillText(name, x, y);
};

const drawDrink = (container, json) => {
  const glassType = json[0];
  glassHeight = glassTypeSizeMap[glassType][0];
  glassWidth = glassTypeSizeMap[glassType][1];
  let drink = json[1];
  ctx = container.querySelector('#canvas').getContext('2d');
  ctx.strokeStyle = '#000000';
  ctx.clearRect(0,0,1000,1000);
  drink = convertToPercent(glassType, drink);
  let pos = 10;
  drink.reverse().forEach((item) => {
    pos = drawLayer(item, pos);
  });
  
  drawGlass(glassType);

  const stemHeight = glassType.endsWith('ball') ? 0 : 100;
  
  drawName(json[2],10,glassHeight + stemHeight + 50);
};
