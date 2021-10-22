import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_NUMBER_OF_TILES_IN_PIP,
  PIP_FPS as FPS,
} from "../../common/constants";
import { hmsToast } from "../components/notifications/hms-toast";
import * as workerTimers from "worker-timers";

class PipManager {
  constructor() {
    this.canvas = null;
    this.pipVideo = null;
    this.canvasInterval = null;
    this.videoElements = this.initializeVideoElements();
    this.tracksToShow = [];

    this.initializeCanvas();
    this.initializePIPVideoElement();
  }
  initializeCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
  }
  initializePIPVideoElement() {
    this.pipVideo = document.createElement("video");
    this.pipVideo.srcObject = this.canvas.captureStream();
  }
  initializeVideoElements() {
    let videoElements = [];
    let numberOfVideoElements = MAX_NUMBER_OF_TILES_IN_PIP;
    while (numberOfVideoElements--) {
      const videoElement = document.createElement("video");
      videoElement.autoplay = true;
      videoElement.playsinline = true;
      videoElements.push(videoElement);
    }

    return videoElements;
  }
  /**
   * @param tracksMap {Object}
   * @param peers {Array} All Remote Peers present in call.
   * @param hmsActions
   * */
  async update(tracksMap, peers, hmsActions) {
    let newTracksToShow = [];
    let numberOfTracks = 0;
    for (const peer of peers) {
      if (numberOfTracks === MAX_NUMBER_OF_TILES_IN_PIP) {
        break;
      }

      const track = tracksMap[peer.videoTrack];
      if (track && track.enabled === true && track.displayEnabled === true) {
        newTracksToShow.push(track.id);
        numberOfTracks++;
      }
    }

    // avoid flicker
    const totalNewTracks = newTracksToShow.length;
    for (let i = 0; i < totalNewTracks; ) {
      const indexOfNewTrackInTracksToShow = this.tracksToShow.findIndex(
        track => track === newTracksToShow[i]
      );

      if (indexOfNewTrackInTracksToShow === i) {
        i++;
      } else if (
        indexOfNewTrackInTracksToShow !== -1 &&
        indexOfNewTrackInTracksToShow < totalNewTracks
      ) {
        let tempElement = newTracksToShow[i];
        newTracksToShow[i] = newTracksToShow[indexOfNewTrackInTracksToShow];
        newTracksToShow[indexOfNewTrackInTracksToShow] = tempElement;
      } else {
        i++;
      }
    }

    this.tracksToShow = newTracksToShow;

    this.detachVideoTracks();
    try {
      await this.attachTracksToVideoElements(hmsActions);
    } catch (error) {
      hmsToast(error.message);
    }
  }

  detachVideoTracks() {
    this.videoElements.forEach(videoElement => (videoElement.srcObject = null));
  }

  async attachTracksToVideoElements(hmsActions) {
    for (const [index, track] of this.tracksToShow.entries()) {
      await hmsActions.attachVideo(track, this.videoElements[index]);
    }
  }

  async start() {
    this.canvasInterval = workerTimers.setInterval(() => {
      this.drawImageOnCanvas();
    }, 1000 / FPS);

    await this.pipVideo.play();

    this.requestPIP();
  }

  stop() {
    if (this.canvasInterval) {
      workerTimers.clearInterval(this.canvasInterval);
      this.canvasInterval = null;
    }
  }

  leavePIPEventListener(setIsPipOn) {
    this.stop();
    setIsPipOn(false);
  }

  registerEventListeners(setIsPipOn) {
    this.pipVideo.addEventListener(
      "leavepictureinpicture",
      () => this.leavePIPEventListener(setIsPipOn),
      false
    );
  }

  deregisterEventListeners(setIsPipOn) {
    this.pipVideo.removeEventListener(
      "leavepictureinpicture",
      () => this.leavePIPEventListener(setIsPipOn),
      false
    );
  }

  requestPIP() {
    if (!this.pipVideo.disablePictureInPicture) {
      try {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
        }
        this.pipVideo.requestPictureInPicture();
      } catch (error) {
        console.error(error);
      }
    }
  }

  drawImageOnCanvas() {
    const numberOfParticipants = this.videoElements.filter(
      videoElement => videoElement.srcObject !== null
    ).length;

    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    /**
     * Handle cases when either 0 or 1 remote peer is present.
     * If no remote peers are present, a black image is rendered on the canvas.
     */
    if (numberOfParticipants === 0) {
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      return;
    } else if (numberOfParticipants === 1) {
      ctx.drawImage(this.videoElements[0], 0, 0, canvasWidth, canvasHeight);
      return;
    }

    /**
     * total number of tiles to show, which is either less that or equal to MAX_NUMBER_OF_TILES_IN_PIP.
     * */
    let tilesToShow = Math.min(
      numberOfParticipants,
      MAX_NUMBER_OF_TILES_IN_PIP
    );

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
        this.videoElements[trackNumber],
        startX,
        startY,
        pipTileWidth,
        pipTileHeight
      );
      ctx.drawImage(
        this.videoElements[trackNumber + 1],
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
        this.videoElements[trackNumber],
        startX,
        startY,
        pipTileWidth,
        pipTileHeight
      );
      ctx.fillRect(startX + pipTileWidth, startY, pipTileWidth, pipTileHeight);
    }
  }
}

export const PIP = new PipManager();
