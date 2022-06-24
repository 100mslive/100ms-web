/**
 * no tile - blank canvas, black image
 * 1 tile - takes full space on canvas
 * 2 tile - vertically equally split
 * 3 tile - two rows two columns - bottom right column is blank
 * 4 tiles - two rows two columns - all equal size
 */
export function drawVideoElementsOnCanvas(videoElements, canvas) {
  let numberOfTiles = videoElements.filter(
    videoElement => videoElement.srcObject !== null
  ).length;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  if (numberOfTiles === 0) {
    // no tile to render, render black image
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    return;
  }
  // TODO: Remove case of 2 tiles after aspect-ratio issue is resolved.
  else if (numberOfTiles === 1 || numberOfTiles === 2) {
    // draw the video element on full canvas
    ctx.drawImage(videoElements[0], 0, 0, canvasWidth, canvasHeight);
    return;
  }

  // if there are more than 2 videos to show, split into two rows
  const numRows = numberOfTiles <= 2 ? 1 : 2;
  const numCols = Number(Math.ceil(numberOfTiles / numRows));
  const tileHeight = canvasHeight / numRows;
  const tileWidth = canvasWidth / numCols;

  fillGridTiles(numRows, numCols, tileHeight, tileWidth, videoElements, ctx);
}

// this is to send some data for stream and resolve video element's play for a
// video element rendering this canvas' capture stream
export function dummyChangeInCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Imagine the canvas as a grid with passed in number of rows and columns. Go
 * over the the tiles in the grid in order while drawing the videoElements upon them.
 */
function fillGridTiles(
  numRows,
  numCols,
  tileHeight,
  tileWidth,
  videoElements,
  ctx
) {
  let videoElementPos = 0;
  for (let row = 0; row < numRows; row++) {
    const startY = row * tileHeight;
    for (let col = 0; col < numCols; col++) {
      const startX = col * tileWidth;
      const video = videoElements[videoElementPos];
      if (!video || video.srcObject === null) {
        ctx.fillRect(startX, startY, tileWidth, tileHeight); // draw black tile
      } else {
        ctx.drawImage(video, startX, startY, tileWidth, tileHeight);
      }
      videoElementPos++;
    }
  }
}
