// ======================================================
// TWO IMAGES / ONE FOLDING IMAGE
//
// 1. Upload two images
// 2. Crop each image to A4 portrait ratio using COVER
// 3. Drag each preview image to reposition
// 4. Adjust Black & White
// 5. Adjust Zoom
// 6. Divide each image into 8 fixed vertical slices
// 7. Interleave A1 B1 A2 B2 ...
// 8. Add short black scoring marks at top and bottom
// 9. Download final PNG
// ======================================================


// ======================================================
// IMAGES
// ======================================================

let img1 = null;
let img2 = null;

let processed1 = null;
let processed2 = null;

let resultGraphics = null;


// ======================================================
// IMAGE ADJUSTMENT VALUES
// ======================================================

let threshold1 = 120;
let threshold2 = 120;

let zoom1 = 1.0;
let zoom2 = 1.0;

let offsetX1 = 0;
let offsetY1 = 0;

let offsetX2 = 0;
let offsetY2 = 0;


// ======================================================
// DRAGGING
// ======================================================

let draggingPhoto = 0;

let lastMouseX = 0;
let lastMouseY = 0;


// ======================================================
// UI
// ======================================================

let fileInput1;
let fileInput2;

let chooseButton1;
let chooseButton2;

let fileName1 = "No image selected";
let fileName2 = "No image selected";

let thresholdSlider1;
let thresholdSlider2;

let zoomSlider1;
let zoomSlider2;

let saveButton;


// ======================================================
// WORKING SIZE
//
// Each source image:
// A4 portrait ratio
// 1240 × 1754 px
//
// Final image:
// 2480 × 1754 px
// ======================================================

const workW = 1240;
const workH = 1754;


// Fixed number of slices per image
const numSlices = 8;


// ======================================================
// TOP / BOTTOM SCORING MARKS
//
// 1754 px = 297 mm
// approx. 59 px = 10 mm = 1 cm
// ======================================================

const markLength = 59;


// ======================================================
// WEB CANVAS
// ======================================================

const canvasW = 1000;
const canvasH = 1420;


// ======================================================
// PHOTO PREVIEW AREAS
// ======================================================

const preview1 = {
  x: 70,
  y: 290,
  w: 350,
  h: 495
};

const preview2 = {
  x: 580,
  y: 290,
  w: 350,
  h: 495
};


// ======================================================
// SETUP
// ======================================================

function setup() {

  createCanvas(
    canvasW,
    canvasH
  );

  pixelDensity(1);

  noLoop();


  // ====================================================
  // PHOTO 1 FILE INPUT
  // ====================================================

  fileInput1 =
    createFileInput(
      handleFile1
    );

  fileInput1.hide();


  chooseButton1 =
    createButton(
      "CHOOSE IMAGE"
    );

  chooseButton1.position(
    70,
    115
  );

  chooseButton1.style(
    "padding",
    "6px 12px"
  );

  chooseButton1.style(
    "background",
    "white"
  );

  chooseButton1.style(
    "border",
    "1px solid #999"
  );

  chooseButton1.style(
    "border-radius",
    "3px"
  );

  chooseButton1.style(
    "cursor",
    "pointer"
  );

  chooseButton1.mousePressed(
    function () {
      fileInput1.elt.click();
    }
  );


  // ====================================================
  // PHOTO 1 BLACK & WHITE
  // ====================================================

  thresholdSlider1 =
    createSlider(
      0,
      255,
      120,
      1
    );

  thresholdSlider1.position(
    165,
    165
  );

  thresholdSlider1.size(
    170
  );

  thresholdSlider1.input(
    function () {

      threshold1 =
        thresholdSlider1.value();

      updatePhoto1();
    }
  );


  // ====================================================
  // PHOTO 1 ZOOM
  // ====================================================

  zoomSlider1 =
    createSlider(
      100,
      250,
      100,
      1
    );

  zoomSlider1.position(
    165,
    215
  );

  zoomSlider1.size(
    170
  );

  zoomSlider1.input(
    function () {

      zoom1 =
        zoomSlider1.value() / 100;

      updatePhoto1();
    }
  );


  // ====================================================
  // PHOTO 2 FILE INPUT
  // ====================================================

  fileInput2 =
    createFileInput(
      handleFile2
    );

  fileInput2.hide();


  chooseButton2 =
    createButton(
      "CHOOSE IMAGE"
    );

  chooseButton2.position(
    580,
    115
  );

  chooseButton2.style(
    "padding",
    "6px 12px"
  );

  chooseButton2.style(
    "background",
    "white"
  );

  chooseButton2.style(
    "border",
    "1px solid #999"
  );

  chooseButton2.style(
    "border-radius",
    "3px"
  );

  chooseButton2.style(
    "cursor",
    "pointer"
  );

  chooseButton2.mousePressed(
    function () {
      fileInput2.elt.click();
    }
  );


  // ====================================================
  // PHOTO 2 BLACK & WHITE
  // ====================================================

  thresholdSlider2 =
    createSlider(
      0,
      255,
      120,
      1
    );

  thresholdSlider2.position(
    675,
    165
  );

  thresholdSlider2.size(
    170
  );

  thresholdSlider2.input(
    function () {

      threshold2 =
        thresholdSlider2.value();

      updatePhoto2();
    }
  );


  // ====================================================
  // PHOTO 2 ZOOM
  // ====================================================

  zoomSlider2 =
    createSlider(
      100,
      250,
      100,
      1
    );

  zoomSlider2.position(
    675,
    215
  );

  zoomSlider2.size(
    170
  );

  zoomSlider2.input(
    function () {

      zoom2 =
        zoomSlider2.value() / 100;

      updatePhoto2();
    }
  );


  // ====================================================
  // DOWNLOAD BUTTON
  // ====================================================

  saveButton =
    createButton(
      "DOWNLOAD IMAGE"
    );

  saveButton.position(
    canvasW / 2,
    1295
  );

  saveButton.style(
    "transform",
    "translateX(-50%)"
  );

  saveButton.style(
    "padding",
    "7px 16px"
  );

  saveButton.style(
    "background",
    "white"
  );

  saveButton.style(
    "border",
    "1px solid #777"
  );

  saveButton.style(
    "border-radius",
    "3px"
  );

  saveButton.style(
    "cursor",
    "pointer"
  );

  saveButton.mousePressed(
    saveFinalImage
  );
}


// ======================================================
// DRAW
// ======================================================

function draw() {

  background(248);


  // ====================================================
  // MAIN TITLE
  // ====================================================

  fill(30);

  noStroke();

  textAlign(
    CENTER,
    CENTER
  );

  textSize(26);

  text(
    "TWO IMAGES / ONE FOLDING IMAGE",
    width / 2,
    30
  );


  // Subtitle

  fill(90);

  textSize(14);

  text(
    "Combine two images into one folding artwork.",
    width / 2,
    58
  );


  // ====================================================
  // PHOTO TITLES
  // ====================================================

  fill(0);

  textSize(18);

  text(
    "PHOTO 1",
    245,
    100
  );

  text(
    "PHOTO 2",
    755,
    100
  );


  // ====================================================
  // FILE NAMES
  // ====================================================

  textAlign(
    LEFT,
    CENTER
  );

  fill(110);

  textSize(11);

  text(
    fileName1,
    205,
    128
  );

  text(
    fileName2,
    715,
    128
  );


  // ====================================================
  // PHOTO 1 CONTROLS
  // ====================================================

  fill(50);

  textSize(13);

  text(
    "Black & White",
    70,
    175
  );

  text(
    "Zoom",
    70,
    225
  );


  text(
    threshold1,
    350,
    175
  );

  text(
    zoom1.toFixed(2) + "×",
    350,
    225
  );


  // PHOTO 1 HELP TEXT

  fill(120);

  textSize(11);

  text(
    "Adjust the amount of black",
    350,
    190
  );

  text(
    "Enlarge the image",
    350,
    240
  );


  // ====================================================
  // PHOTO 2 CONTROLS
  // ====================================================

  fill(50);

  textSize(13);

  text(
    "Black & White",
    580,
    175
  );

  text(
    "Zoom",
    580,
    225
  );


  text(
    threshold2,
    860,
    175
  );

  text(
    zoom2.toFixed(2) + "×",
    860,
    225
  );


  // PHOTO 2 HELP TEXT

  fill(120);

  textSize(11);

  text(
    "Adjust the amount of black",
    860,
    190
  );

  text(
    "Enlarge the image",
    860,
    240
  );


  // ====================================================
  // PHOTO 1 PREVIEW
  // ====================================================

  if (
    processed1 !== null
  ) {

    drawImageExact(
      processed1,
      preview1.x,
      preview1.y,
      preview1.w,
      preview1.h
    );

  } else {

    drawPlaceholder(
      preview1.x,
      preview1.y,
      preview1.w,
      preview1.h,
      "Choose your first image."
    );
  }


  // ====================================================
  // PHOTO 2 PREVIEW
  // ====================================================

  if (
    processed2 !== null
  ) {

    drawImageExact(
      processed2,
      preview2.x,
      preview2.y,
      preview2.w,
      preview2.h
    );

  } else {

    drawPlaceholder(
      preview2.x,
      preview2.y,
      preview2.w,
      preview2.h,
      "Choose your second image."
    );
  }


  // ====================================================
  // DRAG INSTRUCTIONS
  // ====================================================

  textAlign(
    CENTER,
    CENTER
  );

  fill(110);

  textSize(12);

  text(
    "Drag the image to adjust its position.",
    245,
    810
  );

  text(
    "Drag the image to adjust its position.",
    755,
    810
  );


  // ====================================================
  // SHORT INSTRUCTION
  // ====================================================

  fill(100);

  textSize(13);

  text(
    "Adjust both images until you are happy with your final artwork.",
    width / 2,
    855
  );


  // ====================================================
  // FINAL IMAGE TITLE
  // ====================================================

  fill(0);

  textSize(22);

  text(
    "FINAL IMAGE",
    width / 2,
    910
  );


  // ====================================================
  // FINAL IMAGE PREVIEW
  // ====================================================

  if (
    resultGraphics !== null
  ) {

    drawImageContain(
      resultGraphics,
      50,
      950,
      900,
      320
    );

  } else {

    drawPlaceholder(
      50,
      950,
      900,
      320,
      "Choose both images to create the final image."
    );
  }


  // ====================================================
  // EMAIL INSTRUCTIONS
  // ====================================================

  fill(80);

  textSize(15);

  textAlign(
    CENTER,
    CENTER
  );

  textStyle(NORMAL);

text(
  "Download your image, rename the file with your nickname,",
  width / 2,
  1345
);


// Second line - bold
textStyle(BOLD);

text(
  "and send it to aaa@naver.com.",
  width / 2,
  1367
);


// Return to normal
textStyle(NORMAL);
}


// ======================================================
// MOUSE PRESSED
// ======================================================

function mousePressed() {

  // PHOTO 1

  if (

    img1 !== null &&

    mouseX >= preview1.x &&
    mouseX <= preview1.x + preview1.w &&

    mouseY >= preview1.y &&
    mouseY <= preview1.y + preview1.h

  ) {

    draggingPhoto = 1;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    return;
  }


  // PHOTO 2

  if (

    img2 !== null &&

    mouseX >= preview2.x &&
    mouseX <= preview2.x + preview2.w &&

    mouseY >= preview2.y &&
    mouseY <= preview2.y + preview2.h

  ) {

    draggingPhoto = 2;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}


// ======================================================
// MOUSE DRAGGED
// ======================================================

function mouseDragged() {

  if (
    draggingPhoto === 0
  ) {

    return;
  }


  let dx =
    mouseX -
    lastMouseX;


  let dy =
    mouseY -
    lastMouseY;


  // Convert preview movement
  // to working image coordinates

  let scaleX =
    workW /
    preview1.w;


  let scaleY =
    workH /
    preview1.h;


  // PHOTO 1

  if (
    draggingPhoto === 1
  ) {

    offsetX1 +=
      dx *
      scaleX;


    offsetY1 +=
      dy *
      scaleY;


    updatePhoto1();
  }


  // PHOTO 2

  if (
    draggingPhoto === 2
  ) {

    offsetX2 +=
      dx *
      scaleX;


    offsetY2 +=
      dy *
      scaleY;


    updatePhoto2();
  }


  lastMouseX =
    mouseX;


  lastMouseY =
    mouseY;


  return false;
}


// ======================================================
// MOUSE RELEASED
// ======================================================

function mouseReleased() {

  draggingPhoto = 0;
}


// ======================================================
// PHOTO 1 FILE
// ======================================================

function handleFile1(file) {

  if (
    file.type !== "image"
  ) {

    return;
  }


  fileName1 =
    file.name;


  loadImage(

    file.data,

    function (loadedImage) {

      img1 =
        loadedImage;


      zoom1 = 1.0;

      offsetX1 = 0;
      offsetY1 = 0;


      zoomSlider1.value(
        100
      );


      updatePhoto1();
    }
  );
}


// ======================================================
// PHOTO 2 FILE
// ======================================================

function handleFile2(file) {

  if (
    file.type !== "image"
  ) {

    return;
  }


  fileName2 =
    file.name;


  loadImage(

    file.data,

    function (loadedImage) {

      img2 =
        loadedImage;


      zoom2 = 1.0;

      offsetX2 = 0;
      offsetY2 = 0;


      zoomSlider2.value(
        100
      );


      updatePhoto2();
    }
  );
}


// ======================================================
// UPDATE PHOTO 1
// ======================================================

function updatePhoto1() {

  if (
    img1 === null
  ) {

    return;
  }


  processed1 =
    makeA4Image(
      img1,
      zoom1,
      offsetX1,
      offsetY1,
      threshold1
    );


  makeCombinedImage();

  redraw();
}


// ======================================================
// UPDATE PHOTO 2
// ======================================================

function updatePhoto2() {

  if (
    img2 === null
  ) {

    return;
  }


  processed2 =
    makeA4Image(
      img2,
      zoom2,
      offsetX2,
      offsetY2,
      threshold2
    );


  makeCombinedImage();

  redraw();
}


// ======================================================
// A4 COVER + BLACK & WHITE
// ======================================================

function makeA4Image(
  sourceImg,
  zoomValue,
  offsetX,
  offsetY,
  thresholdValue
) {

  let temp =
    createGraphics(
      workW,
      workH
    );


  temp.pixelDensity(1);

  temp.background(255);


  // ====================================================
  // COVER
  // ====================================================

  let baseScale =
    max(
      workW /
      sourceImg.width,

      workH /
      sourceImg.height
    );


  let finalScale =
    baseScale *
    zoomValue;


  let newW =
    sourceImg.width *
    finalScale;


  let newH =
    sourceImg.height *
    finalScale;


  // ====================================================
  // CENTER + USER DRAG
  // ====================================================

  let x =
    (
      workW -
      newW
    ) /
    2
    +
    offsetX;


  let y =
    (
      workH -
      newH
    ) /
    2
    +
    offsetY;


  temp.image(
    sourceImg,
    x,
    y,
    newW,
    newH
  );


  // ====================================================
  // BINARY BLACK & WHITE
  // ====================================================

  temp.filter(
    THRESHOLD,
    thresholdValue /
    255
  );


  let result =
    temp.get();


  temp.remove();


  return result;
}


// ======================================================
// COMBINE TWO IMAGES
// ======================================================

function makeCombinedImage() {

  if (
    processed1 === null ||
    processed2 === null
  ) {

    resultGraphics =
      null;

    return;
  }


  let sliceWidth =
    workW /
    numSlices;


  if (
    resultGraphics !== null
  ) {

    resultGraphics.remove();
  }


  resultGraphics =
    createGraphics(
      workW * 2,
      workH
    );


  resultGraphics.pixelDensity(1);

  resultGraphics.background(255);


  // ====================================================
  // A1 B1 A2 B2 ...
  // ====================================================

  for (
    let i = 0;
    i < numSlices;
    i++
  ) {

    let sourceX =
      i *
      sliceWidth;


    // PHOTO 1

    resultGraphics.image(
      processed1,

      i *
      2 *
      sliceWidth,

      0,

      sliceWidth,

      workH,

      sourceX,

      0,

      sliceWidth,

      workH
    );


    // PHOTO 2

    resultGraphics.image(
      processed2,

      (
        i * 2 + 1
      ) *
      sliceWidth,

      0,

      sliceWidth,

      workH,

      sourceX,

      0,

      sliceWidth,

      workH
    );
  }


  // Add short scoring marks

  drawCutMarks(
    resultGraphics
  );
}


// ======================================================
// TOP / BOTTOM SCORING MARKS
// ======================================================

function drawCutMarks(g) {

  let totalPanels =
    numSlices *
    2;


  let panelW =
    g.width /
    totalPanels;


  g.push();

  g.stroke(0);

  g.strokeWeight(2);


  for (
    let i = 1;
    i < totalPanels;
    i++
  ) {

    let x =
      i *
      panelW;


    // Top mark

    g.line(
      x,
      0,
      x,
      markLength
    );


    // Bottom mark

    g.line(
      x,
      g.height,
      x,
      g.height -
      markLength
    );
  }


  g.pop();
}


// ======================================================
// PHOTO PREVIEW
// ======================================================

function drawImageExact(
  source,
  x,
  y,
  w,
  h
) {

  image(
    source,
    x,
    y,
    w,
    h
  );


  noFill();

  stroke(190);

  strokeWeight(1);


  rect(
    x,
    y,
    w,
    h
  );
}


// ======================================================
// FINAL IMAGE PREVIEW
// ======================================================

function drawImageContain(
  source,
  x,
  y,
  boxW,
  boxH
) {

  let scaleFactor =
    min(
      boxW /
      source.width,

      boxH /
      source.height
    );


  let displayW =
    source.width *
    scaleFactor;


  let displayH =
    source.height *
    scaleFactor;


  let dx =
    x +
    (
      boxW -
      displayW
    ) /
    2;


  let dy =
    y +
    (
      boxH -
      displayH
    ) /
    2;


  image(
    source,
    dx,
    dy,
    displayW,
    displayH
  );


  return {

    x: dx,
    y: dy,
    w: displayW,
    h: displayH

  };
}


// ======================================================
// EMPTY PREVIEW
// ======================================================

function drawPlaceholder(
  x,
  y,
  w,
  h,
  message
) {

  fill(255);

  stroke(210);


  rect(
    x,
    y,
    w,
    h
  );


  noStroke();

  fill(135);


  textAlign(
    CENTER,
    CENTER
  );


  textSize(15);


  text(
    message,
    x +
    w / 2,
    y +
    h / 2
  );
}


// ======================================================
// DOWNLOAD FINAL IMAGE
// ======================================================

function saveFinalImage() {

  if (
    resultGraphics === null
  ) {

    console.log(
      "Please choose both images first."
    );

    return;
  }


  save(
    resultGraphics,
    "folding_image.png"
  );
}
