// ======================================================
// TWO IMAGES / ONE FOLDING IMAGE
//
// RESPONSIVE DESKTOP + MOBILE VERSION
//
// Controls:
// Black & White
// Zoom
// Move X
// Move Y
//
// No mouse/touch image dragging.
// This allows normal mobile page scrolling.
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
// RESPONSIVE
// ======================================================

let isMobile = false;

let lastLayoutWidth = 0;

const mobileBreakpoint = 700;

const desktopW = 1000;
const desktopH = 1490;


// ======================================================
// PREVIEW AREAS
// ======================================================

let preview1 = {
  x: 70,
  y: 370,
  w: 350,
  h: 495
};

let preview2 = {
  x: 580,
  y: 370,
  w: 350,
  h: 495
};


// ======================================================
// LAYOUT
// ======================================================

let layout = {};


// ======================================================
// PERFORMANCE
// ======================================================

let updateTimer1 = null;
let updateTimer2 = null;


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

let moveXSlider1;
let moveXSlider2;

let moveYSlider1;
let moveYSlider2;

let saveButton;


// ======================================================
// WORKING SIZE
//
// Each source image:
// A4 portrait ratio
// 1240 × 1754 px
//
// Final:
// 2480 × 1754 px
// ======================================================

const workW = 1240;
const workH = 1754;


// Fixed number of slices
const numSlices = 8;


// ======================================================
// MOVEMENT RANGE
// ======================================================

const moveXMin = -600;
const moveXMax = 600;

const moveYMin = -800;
const moveYMax = 800;


// ======================================================
// TOP / BOTTOM SCORING MARKS
//
// approx. 1 cm
// ======================================================

const markLength = 59;


// ======================================================
// SETUP
// ======================================================

function setup() {

  isMobile =
    windowWidth <= mobileBreakpoint;

  lastLayoutWidth =
    windowWidth;


  let initialW =
    isMobile
      ? min(windowWidth, 520)
      : desktopW;


  createCanvas(
    initialW,
    isMobile ? 2800 : desktopH
  );


  pixelDensity(1);


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

  styleChooseButton(
    chooseButton1
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


  thresholdSlider1.input(
    function () {

      threshold1 =
        thresholdSlider1.value();

      schedulePhotoUpdate(1);

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


  zoomSlider1.input(
    function () {

      zoom1 =
        zoomSlider1.value() / 100;

      schedulePhotoUpdate(1);

    }
  );


  // ====================================================
  // PHOTO 1 MOVE X
  // ====================================================

  moveXSlider1 =
    createSlider(
      moveXMin,
      moveXMax,
      0,
      10
    );


  moveXSlider1.input(
    function () {

      offsetX1 =
        moveXSlider1.value();

      schedulePhotoUpdate(1);

    }
  );


  // ====================================================
  // PHOTO 1 MOVE Y
  // ====================================================

  moveYSlider1 =
    createSlider(
      moveYMin,
      moveYMax,
      0,
      10
    );


  moveYSlider1.input(
    function () {

      offsetY1 =
        moveYSlider1.value();

      schedulePhotoUpdate(1);

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

  styleChooseButton(
    chooseButton2
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


  thresholdSlider2.input(
    function () {

      threshold2 =
        thresholdSlider2.value();

      schedulePhotoUpdate(2);

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


  zoomSlider2.input(
    function () {

      zoom2 =
        zoomSlider2.value() / 100;

      schedulePhotoUpdate(2);

    }
  );


  // ====================================================
  // PHOTO 2 MOVE X
  // ====================================================

  moveXSlider2 =
    createSlider(
      moveXMin,
      moveXMax,
      0,
      10
    );


  moveXSlider2.input(
    function () {

      offsetX2 =
        moveXSlider2.value();

      schedulePhotoUpdate(2);

    }
  );


  // ====================================================
  // PHOTO 2 MOVE Y
  // ====================================================

  moveYSlider2 =
    createSlider(
      moveYMin,
      moveYMax,
      0,
      10
    );


  moveYSlider2.input(
    function () {

      offsetY2 =
        moveYSlider2.value();

      schedulePhotoUpdate(2);

    }
  );


  // ====================================================
  // DOWNLOAD BUTTON
  // ====================================================

  saveButton =
    createButton(
      "DOWNLOAD IMAGE"
    );


  saveButton.style(
    "transform",
    "translateX(-50%)"
  );

  saveButton.style(
    "padding",
    "8px 18px"
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


  applyResponsiveLayout();

  noLoop();
}


// ======================================================
// BUTTON STYLE
// ======================================================

function styleChooseButton(button) {

  button.style(
    "padding",
    "6px 12px"
  );

  button.style(
    "background",
    "white"
  );

  button.style(
    "border",
    "1px solid #999"
  );

  button.style(
    "border-radius",
    "3px"
  );

  button.style(
    "cursor",
    "pointer"
  );
}


// ======================================================
// RESPONSIVE LAYOUT
// ======================================================

function applyResponsiveLayout() {

  isMobile =
    windowWidth <= mobileBreakpoint;


  if (isMobile) {

    setMobileLayout();

  } else {

    setDesktopLayout();
  }


  lastLayoutWidth =
    windowWidth;


  redraw();
}


// ======================================================
// DESKTOP LAYOUT
// ======================================================

function setDesktopLayout() {

  resizeCanvas(
    desktopW,
    desktopH
  );


  preview1 = {
    x: 70,
    y: 370,
    w: 350,
    h: 495
  };


  preview2 = {
    x: 580,
    y: 370,
    w: 350,
    h: 495
  };


  layout = {

    titleY: 30,
    subtitleY: 58,

    photo1TitleY: 100,
    photo2TitleY: 100,

    fileName1X: 205,
    fileName2X: 715,
    fileNameY: 128,

    bw1Y: 175,
    zoom1Y: 225,
    moveX1Y: 275,
    moveY1Y: 325,

    bw2Y: 175,
    zoom2Y: 225,
    moveX2Y: 275,
    moveY2Y: 325,

    instructionY: 900,

    finalTitleY: 950,

    finalX: 50,
    finalY: 990,
    finalW: 900,
    finalH: 320,

    downloadY: 1345,

    email1Y: 1395,
    email2Y: 1419
  };


  // ====================================================
  // PHOTO 1 CONTROLS
  // ====================================================

  chooseButton1.position(
    70,
    115
  );


  positionDesktopSlider(
    thresholdSlider1,
    165,
    layout.bw1Y
  );


  positionDesktopSlider(
    zoomSlider1,
    165,
    layout.zoom1Y
  );


  positionDesktopSlider(
    moveXSlider1,
    165,
    layout.moveX1Y
  );


  positionDesktopSlider(
    moveYSlider1,
    165,
    layout.moveY1Y
  );


  // ====================================================
  // PHOTO 2 CONTROLS
  // ====================================================

  chooseButton2.position(
    580,
    115
  );


  positionDesktopSlider(
    thresholdSlider2,
    675,
    layout.bw2Y
  );


  positionDesktopSlider(
    zoomSlider2,
    675,
    layout.zoom2Y
  );


  positionDesktopSlider(
    moveXSlider2,
    675,
    layout.moveX2Y
  );


  positionDesktopSlider(
    moveYSlider2,
    675,
    layout.moveY2Y
  );


  // ====================================================
  // DOWNLOAD
  // ====================================================

  saveButton.position(
    width / 2,
    layout.downloadY
  );
}


// ======================================================
// DESKTOP SLIDER POSITION
// ======================================================

function positionDesktopSlider(
  slider,
  x,
  centerY
) {

  slider.position(
    x,
    centerY - 10
  );

  slider.size(
    170
  );
}


// ======================================================
// MOBILE LAYOUT
// ======================================================

function setMobileLayout() {

  let mobileW =
    min(windowWidth, 520);


  let margin = 20;


  let previewW =
    mobileW -
    margin * 2;


  let previewH =
    previewW *
    workH /
    workW;


  // ====================================================
  // PHOTO 1
  // ====================================================

  let photo1TitleY = 115;

  let choose1Y = 145;

  let bw1Y = 225;

  let zoom1Y = 295;

  let moveX1Y = 365;

  let moveY1Y = 435;

  let preview1Y = 505;


  preview1 = {

    x: margin,
    y: preview1Y,
    w: previewW,
    h: previewH

  };


  let photo1End =
    preview1.y +
    preview1.h;


  // ====================================================
  // PHOTO 2
  // ====================================================

  let photo2TitleY =
    photo1End +
    70;


  let choose2Y =
    photo2TitleY +
    30;


  let bw2Y =
    photo2TitleY +
    110;


  let zoom2Y =
    photo2TitleY +
    180;


  let moveX2Y =
    photo2TitleY +
    250;


  let moveY2Y =
    photo2TitleY +
    320;


  let preview2Y =
    photo2TitleY +
    390;


  preview2 = {

    x: margin,
    y: preview2Y,
    w: previewW,
    h: previewH

  };


  let photo2End =
    preview2.y +
    preview2.h;


  // ====================================================
  // FINAL
  // ====================================================

  let instructionY =
    photo2End +
    55;


  let finalTitleY =
    instructionY +
    55;


  let finalY =
    finalTitleY +
    40;


  let finalW =
    previewW;


  let finalH =
    finalW *
    workH /
    (workW * 2);


  let downloadY =
    finalY +
    finalH +
    45;


  let email1Y =
    downloadY +
    65;


  let email2Y =
    email1Y +
    24;


  let mobileCanvasH =
    email2Y +
    75;


  resizeCanvas(
    mobileW,
    mobileCanvasH
  );


  layout = {

    titleY: 40,
    subtitleY: 75,

    photo1TitleY: photo1TitleY,
    photo2TitleY: photo2TitleY,

    choose1Y: choose1Y,
    choose2Y: choose2Y,

    bw1Y: bw1Y,
    zoom1Y: zoom1Y,
    moveX1Y: moveX1Y,
    moveY1Y: moveY1Y,

    bw2Y: bw2Y,
    zoom2Y: zoom2Y,
    moveX2Y: moveX2Y,
    moveY2Y: moveY2Y,

    instructionY: instructionY,

    finalTitleY: finalTitleY,

    finalX: margin,
    finalY: finalY,
    finalW: finalW,
    finalH: finalH,

    downloadY: downloadY,

    email1Y: email1Y,
    email2Y: email2Y
  };


  // ====================================================
  // MOBILE SLIDER DIMENSIONS
  // ====================================================

  let sliderX = 155;

  let sliderW =
    max(
      110,
      mobileW - 220
    );


  // PHOTO 1

  chooseButton1.position(
    margin,
    choose1Y
  );


  positionMobileSlider(
    thresholdSlider1,
    sliderX,
    bw1Y,
    sliderW
  );


  positionMobileSlider(
    zoomSlider1,
    sliderX,
    zoom1Y,
    sliderW
  );


  positionMobileSlider(
    moveXSlider1,
    sliderX,
    moveX1Y,
    sliderW
  );


  positionMobileSlider(
    moveYSlider1,
    sliderX,
    moveY1Y,
    sliderW
  );


  // PHOTO 2

  chooseButton2.position(
    margin,
    choose2Y
  );


  positionMobileSlider(
    thresholdSlider2,
    sliderX,
    bw2Y,
    sliderW
  );


  positionMobileSlider(
    zoomSlider2,
    sliderX,
    zoom2Y,
    sliderW
  );


  positionMobileSlider(
    moveXSlider2,
    sliderX,
    moveX2Y,
    sliderW
  );


  positionMobileSlider(
    moveYSlider2,
    sliderX,
    moveY2Y,
    sliderW
  );


  // DOWNLOAD

  saveButton.position(
    mobileW / 2,
    downloadY
  );
}


// ======================================================
// MOBILE SLIDER POSITION
// ======================================================

function positionMobileSlider(
  slider,
  x,
  centerY,
  sliderW
) {

  slider.position(
    x,
    centerY - 10
  );

  slider.size(
    sliderW
  );
}


// ======================================================
// DRAW
// ======================================================

function draw() {

  background(248);


  if (isMobile) {

    drawMobile();

  } else {

    drawDesktop();
  }
}


// ======================================================
// DESKTOP DRAW
// ======================================================

function drawDesktop() {

  // ====================================================
  // TITLE
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
    layout.titleY
  );


  fill(90);

  textSize(14);


  text(
    "Combine two images into one folding artwork.",
    width / 2,
    layout.subtitleY
  );


  // ====================================================
  // PHOTO TITLES
  // ====================================================

  fill(0);

  textSize(18);


  text(
    "PHOTO 1",
    245,
    layout.photo1TitleY
  );


  text(
    "PHOTO 2",
    755,
    layout.photo2TitleY
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
    shortFileName(fileName1),
    layout.fileName1X,
    layout.fileNameY
  );


  text(
    shortFileName(fileName2),
    layout.fileName2X,
    layout.fileNameY
  );


  // ====================================================
  // PHOTO 1 CONTROLS
  // ====================================================

  drawDesktopControls(
    1,
    70,
    350,
    layout.bw1Y,
    layout.zoom1Y,
    layout.moveX1Y,
    layout.moveY1Y
  );


  // ====================================================
  // PHOTO 2 CONTROLS
  // ====================================================

  drawDesktopControls(
    2,
    580,
    860,
    layout.bw2Y,
    layout.zoom2Y,
    layout.moveX2Y,
    layout.moveY2Y
  );


  // ====================================================
  // PHOTO PREVIEWS
  // ====================================================

  drawPhotoPreview(
    processed1,
    preview1,
    "Choose your first image."
  );


  drawPhotoPreview(
    processed2,
    preview2,
    "Choose your second image."
  );


  // ====================================================
  // INSTRUCTION
  // ====================================================

  textAlign(
    CENTER,
    CENTER
  );

  fill(100);

  textSize(13);


  text(
    "Adjust both images until you are happy with your final artwork.",
    width / 2,
    layout.instructionY
  );


  // ====================================================
  // FINAL IMAGE
  // ====================================================

  fill(0);

  textSize(22);


  text(
    "FINAL IMAGE",
    width / 2,
    layout.finalTitleY
  );


  drawFinalPreview();


  // ====================================================
  // EMAIL
  // ====================================================

  drawEmailInstructions(
    15
  );
}


// ======================================================
// DESKTOP CONTROL LABELS
// ======================================================

function drawDesktopControls(
  photoNumber,
  labelX,
  valueX,
  bwY,
  zoomY,
  moveXY,
  moveYY
) {

  let values =
    getPhotoValues(
      photoNumber
    );


  textAlign(
    LEFT,
    CENTER
  );


  fill(50);

  textSize(13);


  text(
    "Black & White",
    labelX,
    bwY
  );


  text(
    "Zoom",
    labelX,
    zoomY
  );


  text(
    "Move X",
    labelX,
    moveXY
  );


  text(
    "Move Y",
    labelX,
    moveYY
  );


  // VALUES

  text(
    values.threshold,
    valueX,
    bwY
  );


  text(
    values.zoom.toFixed(2) + "×",
    valueX,
    zoomY
  );


  text(
    formatMoveValue(
      values.x
    ),
    valueX,
    moveXY
  );


  text(
    formatMoveValue(
      values.y
    ),
    valueX,
    moveYY
  );


  // HELP TEXT

  fill(120);

  textSize(10);


  text(
    "Adjust the amount of black",
    valueX,
    bwY + 15
  );


  text(
    "Enlarge the image",
    valueX,
    zoomY + 15
  );


  text(
    "← Left / Right →",
    valueX,
    moveXY + 15
  );


  text(
    "↑ Up / Down ↓",
    valueX,
    moveYY + 15
  );
}


// ======================================================
// MOBILE DRAW
// ======================================================

function drawMobile() {

  // ====================================================
  // TITLE
  // ====================================================

  fill(30);

  noStroke();

  textAlign(
    CENTER,
    CENTER
  );


  if (width < 390) {

    textSize(17);

  } else {

    textSize(20);
  }


  text(
    "TWO IMAGES / ONE FOLDING IMAGE",
    width / 2,
    layout.titleY
  );


  fill(90);

  textSize(12);


  text(
    "Combine two images into one folding artwork.",
    width / 2,
    layout.subtitleY
  );


  // ====================================================
  // PHOTO 1
  // ====================================================

  drawMobilePhotoSection(
    1,
    fileName1,
    processed1,
    preview1,
    layout.photo1TitleY,
    layout.choose1Y,
    layout.bw1Y,
    layout.zoom1Y,
    layout.moveX1Y,
    layout.moveY1Y,
    "Choose your first image."
  );


  // ====================================================
  // PHOTO 2
  // ====================================================

  drawMobilePhotoSection(
    2,
    fileName2,
    processed2,
    preview2,
    layout.photo2TitleY,
    layout.choose2Y,
    layout.bw2Y,
    layout.zoom2Y,
    layout.moveX2Y,
    layout.moveY2Y,
    "Choose your second image."
  );


  // ====================================================
  // INSTRUCTION
  // ====================================================

  textAlign(
    CENTER,
    CENTER
  );

  fill(100);

  textSize(11);


  text(
    "Adjust both images until you are happy with your final artwork.",
    width / 2,
    layout.instructionY
  );


  // ====================================================
  // FINAL IMAGE
  // ====================================================

  fill(0);

  textSize(20);


  text(
    "FINAL IMAGE",
    width / 2,
    layout.finalTitleY
  );


  drawFinalPreview();


  // ====================================================
  // EMAIL
  // ====================================================

  drawEmailInstructions(
    12
  );
}


// ======================================================
// MOBILE PHOTO SECTION
// ======================================================

function drawMobilePhotoSection(
  photoNumber,
  fileName,
  processed,
  preview,
  titleY,
  chooseY,
  bwY,
  zoomY,
  moveXY,
  moveYY,
  placeholder
) {

  // TITLE

  textAlign(
    CENTER,
    CENTER
  );

  fill(0);

  textSize(18);


  text(
    "PHOTO " + photoNumber,
    width / 2,
    titleY
  );


  // FILE NAME

  textAlign(
    LEFT,
    CENTER
  );

  fill(110);

  textSize(10);


  text(
    shortFileName(fileName),
    170,
    chooseY + 15
  );


  // CONTROLS

  drawMobileControls(
    photoNumber,
    bwY,
    zoomY,
    moveXY,
    moveYY
  );


  // PREVIEW

  drawPhotoPreview(
    processed,
    preview,
    placeholder
  );
}


// ======================================================
// MOBILE CONTROLS
// ======================================================

function drawMobileControls(
  photoNumber,
  bwY,
  zoomY,
  moveXY,
  moveYY
) {

  let values =
    getPhotoValues(
      photoNumber
    );


  // LABELS

  textAlign(
    LEFT,
    CENTER
  );

  fill(50);

  textSize(12);


  text(
    "Black & White",
    20,
    bwY
  );


  text(
    "Zoom",
    20,
    zoomY
  );


  text(
    "Move X",
    20,
    moveXY
  );


  text(
    "Move Y",
    20,
    moveYY
  );


  // VALUES

  textAlign(
    RIGHT,
    CENTER
  );


  text(
    values.threshold,
    width - 15,
    bwY
  );


  text(
    values.zoom.toFixed(2) + "×",
    width - 15,
    zoomY
  );


  text(
    formatMoveValue(
      values.x
    ),
    width - 15,
    moveXY
  );


  text(
    formatMoveValue(
      values.y
    ),
    width - 15,
    moveYY
  );


  // HELP TEXT

  textAlign(
    LEFT,
    CENTER
  );

  fill(120);

  textSize(9);


  text(
    "Adjust the amount of black",
    155,
    bwY + 20
  );


  text(
    "Enlarge the image",
    155,
    zoomY + 20
  );


  text(
    "← Left / Right →",
    155,
    moveXY + 20
  );


  text(
    "↑ Up / Down ↓",
    155,
    moveYY + 20
  );
}


// ======================================================
// GET VALUES
// ======================================================

function getPhotoValues(
  photoNumber
) {

  if (photoNumber === 1) {

    return {

      threshold: threshold1,
      zoom: zoom1,
      x: offsetX1,
      y: offsetY1

    };

  } else {

    return {

      threshold: threshold2,
      zoom: zoom2,
      x: offsetX2,
      y: offsetY2

    };
  }
}


// ======================================================
// FORMAT MOVEMENT VALUE
// ======================================================

function formatMoveValue(value) {

  if (value > 0) {

    return "+" + value;
  }


  return String(value);
}


// ======================================================
// EMAIL INSTRUCTIONS
// ======================================================

function drawEmailInstructions(
  fontSize
) {

  fill(80);

  textSize(fontSize);

  textAlign(
    CENTER,
    CENTER
  );


  textStyle(NORMAL);


  text(
    "Download your image, rename the file with your nickname,",
    width / 2,
    layout.email1Y
  );


  textStyle(BOLD);


  text(
    "and send it to aaa@naver.com.",
    width / 2,
    layout.email2Y
  );


  textStyle(NORMAL);

  text(
    "Please open this page in Chrome or Safari before downloading.",
    width / 2,
    layout.email1Y
  );

   text(
  "Downloads may not work properly in in-app browsers such as KakaoTalk.",

    width / 2,
    layout.email1Y
  );
}


// ======================================================
// PHOTO PREVIEW
// ======================================================

function drawPhotoPreview(
  processed,
  preview,
  placeholder
) {

  if (processed !== null) {

    drawImageExact(
      processed,
      preview.x,
      preview.y,
      preview.w,
      preview.h
    );

  } else {

    drawPlaceholder(
      preview.x,
      preview.y,
      preview.w,
      preview.h,
      placeholder
    );
  }
}


// ======================================================
// FINAL PREVIEW
// ======================================================

function drawFinalPreview() {

  if (resultGraphics !== null) {

    drawImageContain(
      resultGraphics,
      layout.finalX,
      layout.finalY,
      layout.finalW,
      layout.finalH
    );

  } else {

    drawPlaceholder(
      layout.finalX,
      layout.finalY,
      layout.finalW,
      layout.finalH,
      "Choose both images to create the final image."
    );
  }
}


// ======================================================
// SHORT FILE NAME
// ======================================================

function shortFileName(name) {

  if (name.length <= 22) {

    return name;
  }


  return (
    name.substring(0, 18) +
    "..."
  );
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

      moveXSlider1.value(
        0
      );

      moveYSlider1.value(
        0
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

      moveXSlider2.value(
        0
      );

      moveYSlider2.value(
        0
      );


      updatePhoto2();
    }
  );
}


// ======================================================
// SCHEDULE UPDATE
// ======================================================

function schedulePhotoUpdate(
  photoNumber
) {

  let delay =
    isMobile
      ? 130
      : 40;


  if (photoNumber === 1) {

    clearTimeout(
      updateTimer1
    );


    updateTimer1 =
      setTimeout(
        function () {

          updatePhoto1();

        },
        delay
      );

  } else {

    clearTimeout(
      updateTimer2
    );


    updateTimer2 =
      setTimeout(
        function () {

          updatePhoto2();

        },
        delay
      );
  }
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
  // COVER SCALE
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
  // CENTER + SLIDER OFFSET
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


  // ====================================================
  // PREVENT EMPTY WHITE AREAS
  // ====================================================

  x =
    constrain(
      x,
      workW - newW,
      0
    );


  y =
    constrain(
      y,
      workH - newH,
      0
    );


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


    // TOP

    g.line(
      x,
      0,
      x,
      markLength
    );


    // BOTTOM

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


  if (isMobile) {

    textSize(13);

  } else {

    textSize(15);
  }


  text(
    message,
    x +
    w / 2,
    y +
    h / 2
  );
}


// ======================================================
// DOWNLOAD
// ======================================================

// ======================================================
// DOWNLOAD FINAL IMAGE
// Desktop + Mobile
// ======================================================

function saveFinalImage() {

  if (resultGraphics === null) {

    alert(
      "Please choose both images first."
    );

    return;
  }


  // p5.Graphics 내부 canvas 가져오기
  const canvas =
    resultGraphics.canvas;


  canvas.toBlob(

    function(blob) {

      if (!blob) {

        alert(
          "Unable to create the image."
        );

        return;
      }


      // Blob URL 생성
      const url =
        URL.createObjectURL(blob);


      // 임시 다운로드 링크 생성
      const link =
        document.createElement("a");


      link.href =
        url;


      link.download =
        "folding_image.png";


      // 문서에 임시 추가
      document.body.appendChild(
        link
      );


      // 다운로드 실행
      link.click();


      // 제거
      document.body.removeChild(
        link
      );


      // Blob URL 정리
      setTimeout(
        function() {

          URL.revokeObjectURL(
            url
          );

        },
        1000
      );

    },

    "image/png"
  );
}


// ======================================================
// WINDOW RESIZE
//
// Ignore small width changes caused by
// mobile browser address bars.
// ======================================================

function windowResized() {

  let widthDifference =
    abs(
      windowWidth -
      lastLayoutWidth
    );


  let newMobileState =
    windowWidth <=
    mobileBreakpoint;


  if (
    newMobileState !== isMobile ||
    widthDifference > 40
  ) {

    applyResponsiveLayout();
  }
}
