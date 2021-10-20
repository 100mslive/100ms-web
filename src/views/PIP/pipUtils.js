import { MAX_NUMBER_OF_TILES_IN_PIP } from "../../common/constants";

export const drawImageOnCanvas = (videoTracks, canvas) => {
  const numberOfParticipants = videoTracks.length;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  /**
   * Handle cases when either 0 or 1 remote peer is present.
   * If no remote peers are present, a black image is rendered on the canvas.
   */
  if (numberOfParticipants === 0) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  } else if (numberOfParticipants === 1) {
    ctx.drawImage(videoTracks[0], 0, 0, canvasWidth, canvasHeight);
    return;
  }

  /**
   * total number of tiles to show, which is either less that or equal to MAX_NUMBER_OF_TILES_IN_PIP.
   * */
  let tilesToShow = Math.min(numberOfParticipants, MAX_NUMBER_OF_TILES_IN_PIP);

  /**
   * Even tiles correspond to the number of even video tiles in pip element.
   * If tilesToShow is odd, we subtract one to get even video tiles.
   */
  const evenTiles = tilesToShow % 2 === 0 ? tilesToShow : tilesToShow - 1;

  /**
   * total number of tiles to show in pip video ie. if tilesToShow is even
   * we display the tiles, and of its not even we add on black tile to it.
   */
  tilesToShow = tilesToShow % 2 === 0 ? tilesToShow : Number(tilesToShow) + 1;

  // Dimensions of each pip tile.
  const pipTileWidth = canvasWidth / 2;
  const pipTileHeight = canvasHeight / (tilesToShow / 2);

  // Initial Coordinates to start drawing on canvas.
  let startX = 0,
    startY = 0;

  /**
   * Draw image for all the even tiles based on their position in videoTracks Array.
   * Drawing 2 tiles along the width.
   */
  let trackNumber = 0;
  for (; trackNumber < evenTiles; trackNumber += 2) {
    ctx.drawImage(
      videoTracks[trackNumber],
      startX,
      startY,
      pipTileWidth,
      pipTileHeight
    );
    ctx.drawImage(
      videoTracks[trackNumber + 1],
      startX + pipTileWidth,
      startY,
      pipTileWidth,
      pipTileHeight
    );
    startY += pipTileHeight;
  }

  /**
   * In case when tilesToShow != evenTiles, then odd number of peers are present.
   * Drawing the image for the last peer and one black tile.
   */
  if (tilesToShow !== evenTiles) {
    ctx.drawImage(
      videoTracks[trackNumber],
      startX,
      startY,
      pipTileWidth,
      pipTileHeight
    );
    ctx.fillRect(startX + pipTileWidth, startY, pipTileWidth, pipTileHeight);
  }
};
