// ======================================================
// TWO IMAGES / ONE FOLDING IMAGE
// RESPONSIVE DESKTOP + MOBILE VERSION
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
const desktopH = 1420;


// ======================================================
// PREVIEW AREAS
// ======================================================

let preview1 = {
  x: 70,
  y: 290,
  w: 350,
  h: 495
};

let preview2 = {
  x: 580,
  y: 290,
  w: 350,
  h: 495
};


// ======================================================
// LAYOUT
// ======================================================

let layout = {};


// ======================================================
// DRAGGING
// ======================================================

let draggingPhoto = 0;

let lastPointerX = 0;
let lastPointerY = 0;


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

let saveButton;


// ======================================================
// FINAL IMAGE SIZE
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


// 8 slices per source image
const numSlices = 8;


// ======================================================
// TOP / BOTTOM MARKS
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


  let initialW;

  if (isMobile) {

    initialW =
      min(windowWidth, 520);

  } else {

    initialW =
      desktopW;
  }


  createCanvas(
    initialW,
    isMobile ? 2300 : desktopH
  );


  pixelDensity(1);


  // ====================================================
  // FILE INPUT 1
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
  // FILE INPUT 2
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
    y: 290,
    w: 350,
    h: 495
  };


  preview2 = {
    x: 580,
    y: 290,
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

    bw2Y: 175,
    zoom2Y: 225,

    drag1Y: 810,
    drag2Y: 810,

    instructionY: 855,

    finalTitleY: 910,

    finalX: 50,
    finalY: 950,
    finalW: 900,
    finalH: 320,

    downloadY: 1295,

    email1Y: 1345,
    email2Y: 1367
  };


  chooseButton1.position(
    70,
    115
  );


  thresholdSlider1.position(
    165,
    165
  );

  thresholdSlider1.size(
    170
  );


  zoomSlider1.position(
    165,
    215
  );

  zoomSlider1.size(
    170
  );


  chooseButton2.position(
    580,
    115
  );


  thresholdSlider2.position(
    675,
    165
  );

  thresholdSlider2.size(
    170
  );


  zoomSlider2.position(
    675,
    215
  );

  zoomSlider2.size(
    170
  );


  saveButton.position(
    width / 2,
    layout.downloadY
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

  let preview1Y = 365;


  preview1 = {

    x: margin,
    y: preview1Y,
    w: previewW,
    h: previewH

  };


  let drag1Y =
    preview1.y +
    preview1.h +
    25;


  // ====================================================
  // PHOTO 2
  // ====================================================

  let photo2TitleY =
    drag1Y +
    85;


  let choose2Y =
    photo2TitleY +
    30;


  let bw2Y =
    photo2TitleY +
    110;


  let zoom2Y =
    photo2TitleY +
    180;


  let preview2Y =
    photo2TitleY +
    250;


  preview2 = {

    x: margin,
    y: preview2Y,
    w: previewW,
    h: previewH

  };


  let drag2Y =
    preview2.y +
    preview2.h +
    25;


  // ====================================================
  // FINAL
  // ====================================================

  let instructionY =
    drag2Y +
    55;


  let finalTitleY =
    instructionY +
    60;


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
    70;


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

    bw2Y: bw2Y,
    zoom2Y: zoom2Y,

    drag1Y: drag1Y,
    drag2Y: drag2Y,

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
  // PHOTO 1 DOM CONTROLS
  // ====================================================

  chooseButton1.position(
    margin,
    choose1Y
  );


  thresholdSlider1.position(
    165,
    bw1Y - 10
  );

  thresholdSlider1.size(
    max(
      120,
      mobileW - 220
    )
  );


  zoomSlider1.position(
    165,
    zoom1Y - 10
  );

  zoomSlider1.size(
    max(
      120,
      mobileW - 220
    )
  );


  // ====================================================
  // PHOTO 2 DOM CONTROLS
  // ====================================================

  chooseButton2.position(
    margin,
    choose2Y
  );


  thresholdSlider2.position(
    165,
    bw2Y - 10
  );

  thresholdSlider2.size(
    max(
      120,
      mobileW - 220
    )
  );


  zoomSlider2.position(
    165,
    zoom2Y - 10
  );

  zoomSlider2.size(
    max(
      120,
      mobileW - 220
    )
  );


  // ====================================================
  // DOWNLOAD
  // ====================================================

  saveButton.position(
    mobileW / 2,
    downloadY
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
// DESKTOP
// ======================================================

function drawDesktop() {

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

  fill(50);

  textSize(13);


  text(
    "Black & White",
    70,
    layout.bw1Y
  );


  text(
    "Zoom",
    70,
    layout.zoom1Y
  );


  text(
    threshold1,
    350,
    layout.bw1Y
  );


  text(
    zoom1.toFixed(2) + "×",
    350,
    layout.zoom1Y
  );


  fill(120);

  textSize(11);


  text(
    "Adjust the amount of black",
    350,
    layout.bw1Y + 15
  );


  text(
    "Enlarge the image",
    350,
    layout.zoom1Y + 15
  );


  // ====================================================
  // PHOTO 2 CONTROLS
  // ====================================================

  fill(50);

  textSize(13);


  text(
    "Black & White",
    580,
    layout.bw2Y
  );


  text(
    "Zoom",
    580,
    layout.zoom2Y
  );


  text(
    threshold2,
    860,
    layout.bw2Y
  );


  text(
    zoom2.toFixed(2) + "×",
    860,
    layout.zoom2Y
  );


  fill(120);

  textSize(11);


  text(
    "Adjust the amount of black",
    860,
    layout.bw2Y + 15
  );


  text(
    "Enlarge the image",
    860,
    layout.zoom2Y + 15
  );


  // ====================================================
  // PREVIEWS
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


  textAlign(
    CENTER,
    CENTER
  );

  fill(110);

  textSize(12);


  text(
    "Drag the image to adjust its position.",
    245,
    layout.drag1Y
  );


  text(
    "Drag the image to adjust its position.",
    755,
    layout.drag2Y
  );


  fill(100);

  textSize(13);


  text(
    "Adjust both images until you are happy with your final artwork.",
    width / 2,
    layout.instructionY
  );


  // ====================================================
  // FINAL
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

  fill(80);

  textSize(15);

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
}


// ======================================================
// MOBILE
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

  fill(0);

  textSize(18);


  text(
    "PHOTO 1",
    width / 2,
    layout.photo1TitleY
  );


  textAlign(
    LEFT,
    CENTER
  );

  fill(110);

  textSize(10);


  text(
    shortFileName(fileName1),
    170,
    layout.choose1Y + 15
  );


  drawMobileControlLabels(
    1,
    layout.bw1Y,
    layout.zoom1Y
  );


  drawPhotoPreview(
    processed1,
    preview1,
    "Choose your first image."
  );


  textAlign(
    CENTER,
    CENTER
  );

  fill(110);

  textSize(11);


  text(
    "Drag the image to adjust its position.",
    width / 2,
    layout.drag1Y
  );


  // ====================================================
  // PHOTO 2
  // ====================================================

  fill(0);

  textSize(18);


  text(
    "PHOTO 2",
    width / 2,
    layout.photo2TitleY
  );


  textAlign(
    LEFT,
    CENTER
  );

  fill(110);

  textSize(10);


  text(
    shortFileName(fileName2),
    170,
    layout.choose2Y + 15
  );


  drawMobileControlLabels(
    2,
    layout.bw2Y,
    layout.zoom2Y
  );


  drawPhotoPreview(
    processed2,
    preview2,
    "Choose your second image."
  );


  textAlign(
    CENTER,
    CENTER
  );

  fill(110);

  textSize(11);


  text(
    "Drag the image to adjust its position.",
    width / 2,
    layout.drag2Y
  );


  // ====================================================
  // INSTRUCTION
  // ====================================================

  fill(100);

  textSize(11);


  text(
    "Adjust both images until you are happy with your final artwork.",
    width / 2,
    layout.instructionY
  );


  // ====================================================
  // FINAL
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

  fill(80);

  textSize(12);

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
}


// ======================================================
// MOBILE CONTROL LABELS
// ======================================================

function drawMobileControlLabels(
  photoNumber,
  bwY,
  zoomY
) {

  let thresholdValue =
    photoNumber === 1
      ? threshold1
      : threshold2;


  let zoomValue =
    photoNumber === 1
      ? zoom1
      : zoom2;


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


  textAlign(
    RIGHT,
    CENTER
  );


  text(
    thresholdValue,
    width - 15,
    bwY
  );


  text(
    zoomValue.toFixed(2) + "×",
    width - 15,
    zoomY
  );


  textAlign(
    LEFT,
    CENTER
  );


  fill(120);

  textSize(9);


  text(
    "Adjust the amount of black",
    165,
    bwY + 20
  );


  text(
    "Enlarge the image",
    165,
    zoomY + 20
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
// FILE 1
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
// FILE 2
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
// SCHEDULE UPDATE
// ======================================================

function schedulePhotoUpdate(photoNumber) {

  let delay =
    isMobile
      ? 140
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
  // CENTER + USER OFFSET
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


  // Prevent empty gaps

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
// TOP / BOTTOM MARKS
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


    g.line(
      x,
      0,
      x,
      markLength
    );


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
// DRAG HELPERS
// ======================================================

function beginDragAt(
  pointerX,
  pointerY
) {

  if (
    img1 !== null &&
    pointInsidePreview(
      pointerX,
      pointerY,
      preview1
    )
  ) {

    draggingPhoto = 1;

    lastPointerX =
      pointerX;

    lastPointerY =
      pointerY;

    return true;
  }


  if (
    img2 !== null &&
    pointInsidePreview(
      pointerX,
      pointerY,
      preview2
    )
  ) {

    draggingPhoto = 2;

    lastPointerX =
      pointerX;

    lastPointerY =
      pointerY;

    return true;
  }


  return false;
}


// ======================================================
// DRAG MOVE
// ======================================================

function dragTo(
  pointerX,
  pointerY
) {

  if (
    draggingPhoto === 0
  ) {

    return false;
  }


  let dx =
    pointerX -
    lastPointerX;


  let dy =
    pointerY -
    lastPointerY;


  let activePreview =
    draggingPhoto === 1
      ? preview1
      : preview2;


  let scaleX =
    workW /
    activePreview.w;


  let scaleY =
    workH /
    activePreview.h;


  if (
    draggingPhoto === 1
  ) {

    offsetX1 +=
      dx *
      scaleX;


    offsetY1 +=
      dy *
      scaleY;


    schedulePhotoUpdate(1);

  } else {

    offsetX2 +=
      dx *
      scaleX;


    offsetY2 +=
      dy *
      scaleY;


    schedulePhotoUpdate(2);
  }


  lastPointerX =
    pointerX;


  lastPointerY =
    pointerY;


  return true;
}


// ======================================================
// END DRAG
// ======================================================

function endDrag() {

  let finishedPhoto =
    draggingPhoto;


  draggingPhoto = 0;


  if (
    finishedPhoto === 1
  ) {

    clearTimeout(
      updateTimer1
    );

    updatePhoto1();

  } else if (
    finishedPhoto === 2
  ) {

    clearTimeout(
      updateTimer2
    );

    updatePhoto2();
  }
}


// ======================================================
// POINT TEST
// ======================================================

function pointInsidePreview(
  px,
  py,
  preview
) {

  return (

    px >= preview.x &&

    px <=
      preview.x +
      preview.w &&

    py >= preview.y &&

    py <=
      preview.y +
      preview.h

  );
}


// ======================================================
// DESKTOP MOUSE
// ======================================================

function mousePressed() {

  beginDragAt(
    mouseX,
    mouseY
  );
}


function mouseDragged() {

  if (
    dragTo(
      mouseX,
      mouseY
    )
  ) {

    return false;
  }
}


function mouseReleased() {

  endDrag();
}


// ======================================================
// MOBILE TOUCH
//
// IMPORTANT:
// Page scrolling is allowed unless
// the user is actively dragging an image.
// ======================================================

function touchStarted() {

  if (
    touches.length === 0
  ) {

    return;
  }


  let tx =
    touches[0].x;


  let ty =
    touches[0].y;


  let started =
    beginDragAt(
      tx,
      ty
    );


  // Only stop browser behavior
  // when touching an editable image

  if (started) {

    return false;
  }
}


// ======================================================
// TOUCH MOVE
// ======================================================

function touchMoved() {

  // Not dragging an image:
  // allow normal browser scrolling.

  if (
    draggingPhoto === 0
  ) {

    return;
  }


  if (
    touches.length === 0
  ) {

    return;
  }


  dragTo(
    touches[0].x,
    touches[0].y
  );


  // Prevent scrolling only while
  // actively moving an image.

  return false;
}


// ======================================================
// TOUCH END
// ======================================================

function touchEnded() {

  if (
    draggingPhoto !== 0
  ) {

    endDrag();

    return false;
  }
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


// ======================================================
// WINDOW RESIZE
//
// On smartphones the browser address bar
// can trigger resize events while scrolling.
// Therefore layout is rebuilt only if
// the width changes meaningfully.
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


  // Re-layout only when:
  // 1. device mode changes, or
  // 2. width changes significantly
  //    (rotation / real window resize)

  if (
    newMobileState !== isMobile ||
    widthDifference > 40
  ) {

    applyResponsiveLayout();
  }
}
