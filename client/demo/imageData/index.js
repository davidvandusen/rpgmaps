import * as imageData from '../../src/common/imageData';

function demoMaskContiguousArea(width, heightOrPixels, startIndex = 0) {
  let pixels;
  if (typeof heightOrPixels === 'number') {
    pixels = new Uint32Array(width * heightOrPixels);
  } else {
    pixels = heightOrPixels;
  }
  const start = Date.now();
  const mask = imageData.describeContiguousArea(pixels, width, startIndex).mask;
  console.log(`Took: ${Date.now() - start}ms`);
  for (let row = 0; row < mask.height; row++) {
    let line = '';
    for (let col = 0; col < mask.width; col++) {
      line += mask.at(col, row) ? '[]' : '  ';
    }
    console.log(`${row}: ${line}`);
  }
}

const demos = [];

const width = 4;
const height = 4;

demos.push(() => {
  demoMaskContiguousArea(width, height);
});

for (let i = 0; i < 10; i++) {
  demos.push(() => {
    const pixels = new Uint8Array(width * height);
    pixels[Math.floor(Math.random() * pixels.length)] = 1;
    demoMaskContiguousArea(width, pixels, Math.floor(Math.random() * pixels.length));
  });
}

demos.forEach(demo => demo());
