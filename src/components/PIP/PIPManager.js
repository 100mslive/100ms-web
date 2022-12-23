import * as workerTimers from "worker-timers";
import {
  drawVideoElementsOnCanvas,
  dummyChangeInCanvas,
  resetPIPCanvasColors,
} from "./pipUtils";
const MAX_NUMBER_OF_TILES_IN_PIP = 4;
const DEFAULT_FPS = 30;
const DEFAULT_CANVAS_WIDTH = 480;
const DEFAULT_CANVAS_HEIGHT = 320;
const LEAVE_EVENT_NAME = "leavepictureinpicture";

const PIPStates = {
  starting: "starting",
  started: "started",
  stopping: "stopping",
  stopped: "stopped",
};

/**
 * video elements are stitched together as a canvas which is converted to
 * another video element converted to PIP.
 * The task is split into two parts -
 * 1. a function which gets hit when the input changes and updates the tracks
 * to show
 * 2. an independent loop which updates the canvas periodically based on the current
 * tracks which should be shown.
 */
class PipManager {
  constructor() {
    this.reset();
  }

  /**
   * @private
   */
  reset() {
    console.debug("resetting PIP state");
    resetPIPCanvasColors();
    this.canvas = null; // where stitching will take place
    this.pipVideo = null; // the element which will be sent in PIP
    this.timeoutRef = null; // setTimeout reference so it can be cancelled
    this.hmsActions = null; // for attaching detaching
    this.videoElements = []; // for attaching tracks
    this.tracksToShow = [];
    this.onStateChange = () => {}; // for user of this class to listen to changes
    this.state = PIPStates.stopped;
  }

  /**
   * check if PIP is supported in this browser env
   */
  isSupported() {
    return !!document.pictureInPictureEnabled;
  }

  /**
   * check if pip is currently turned on
   */
  isOn() {
    return !!document.pictureInPictureElement;
  }

  /**
   * request browser to start pip and start the render loop updating the pip
   * video element with peer tracks.
   * @param hmsActions
   * @param onStateChangeFn {function(bool):void} callback called to notify change in pip state
   */
  async start(hmsActions, onStateChangeFn) {
    if (!this.isSupported()) {
      throw new Error("pip is not supported on this browser");
    }
    console.debug("starting PIP, current state", this.state);
    if (this.state === PIPStates.started) {
      await this.stop(); // if anything is already running
    } else if (this.state === PIPStates.starting) {
      return; // ignore double clicks
    }
    this.state = PIPStates.starting;
    try {
      await this.init(hmsActions, onStateChangeFn);
      // when user closes pip, call internal stop
      this.pipVideo.addEventListener(LEAVE_EVENT_NAME, this.stop);
      this.renderLoop();
      if (!this.isOn()) {
        await this.requestPIP();
      }
      console.debug("pip started");
      this.state = PIPStates.started;
      this.onStateChange(true);
    } catch (err) {
      console.error("error in request pip", err);
      this.state = PIPStates.stopped;
    }
  }

  stop = async () => {
    if (this.state === PIPStates.stopped) {
      return;
    }
    this.state = PIPStates.stopping;
    this.pipVideo?.removeEventListener(LEAVE_EVENT_NAME, this.stop);
    if (this.timeoutRef) {
      workerTimers.clearTimeout(this.timeoutRef);
    }
    if (this.isOn()) {
      this.exitPIP();
    }
    // detach all to avoid bandwidth consumption
    await this.detachOldAttachNewTracks(this.tracksToShow, []);
    this.onStateChange(false); // notify parent about this
    this.reset(); // cleanup
    this.state = PIPStates.stopped;
  };

  /**
   * @param peers {Array} All Remote Peers present in call.
   * @param tracksMap {Object} map of track id to track
   * */
  async updatePeersAndTracks(peers, tracksMap) {
    if (!this.canvas) {
      return;
    }
    const newTracksToShowUnordered = this.pickTracksToShow(peers, tracksMap);
    const currentTracksShowing = this.tracksToShow;
    this.tracksToShow = this.orderNewTracksToShow(
      newTracksToShowUnordered,
      currentTracksShowing
    );
    try {
      await this.detachOldAttachNewTracks(
        currentTracksShowing,
        this.tracksToShow,
        tracksMap
      );
    } catch (error) {
      console.error("error in detaching/attaching tracks", error);
    }
  }

  // ------- Private function --------------

  /**
   * @private
   */
  async init(hmsActions, onStateChangeFn) {
    await this.initMediaElements();
    this.hmsActions = hmsActions;
    this.onStateChange = onStateChangeFn;
  }

  async initMediaElements() {
    if (!this.canvas) {
      const { canvas, pipVideo } = this.initializeCanvasAndVideoElement();
      this.canvas = canvas; // where stitching will take place
      this.pipVideo = pipVideo; // the element which will be sent in PIP
      this.videoElements = this.initializeVideoElements(); // for attaching tracks
      const videoPlayPromise = this.pipVideo.play();
      dummyChangeInCanvas(this.canvas);
      await videoPlayPromise;
    }
  }

  initializeCanvasAndVideoElement() {
    const canvas = document.createElement("canvas");
    canvas.width = DEFAULT_CANVAS_WIDTH;
    canvas.height = DEFAULT_CANVAS_HEIGHT;
    const pipVideo = document.createElement("video");
    pipVideo.width = DEFAULT_CANVAS_WIDTH;
    pipVideo.height = DEFAULT_CANVAS_HEIGHT;
    pipVideo.muted = true;
    pipVideo.srcObject = canvas.captureStream();
    return { canvas, pipVideo };
  }

  initializeVideoElements() {
    let videoElements = [];
    for (let i = 0; i < MAX_NUMBER_OF_TILES_IN_PIP; i++) {
      const videoElement = document.createElement("video");
      videoElement.autoplay = true;
      videoElement.playsinline = true;
      videoElements.push(videoElement);
    }
    return videoElements;
  }

  /**
   * render loop is responsible for rendering the video elements on canvas/pip.
   * in each loop current video elements are stitched and painted on canvas
   */
  renderLoop() {
    const delay = 1000 / DEFAULT_FPS;
    this.timeoutRef = workerTimers.setTimeout(() => {
      if (
        this.state === PIPStates.stopping ||
        this.state === PIPStates.stopped
      ) {
        return;
      }
      if (this.state === PIPStates.started) {
        drawVideoElementsOnCanvas(this.videoElements, this.canvas);
      }
      this.renderLoop();
    }, delay);
  }

  async requestPIP() {
    try {
      if (this.isOn()) {
        this.exitPIP(); // is this really needed?
      }
      await this.pipVideo.requestPictureInPicture();
    } catch (error) {
      console.error("error in requestpip", error, "state", this.state);
      throw error;
    }
  }

  exitPIP() {
    document.exitPictureInPicture();
  }

  /**
   * Logic - pick only enabled video tracks
   * @param peers {Array<any>}
   * @param tracksMap {Record<string, any>}
   */
  pickTracksToShow(peers, tracksMap) {
    const tracksToShow = [];
    for (const peer of peers) {
      if (tracksToShow.length === MAX_NUMBER_OF_TILES_IN_PIP) {
        break;
      } else if (peer.videoTrack && tracksMap[peer.videoTrack]?.enabled) {
        tracksToShow.push(peer.videoTrack);
      }
    }
    return tracksToShow;
  }

  /**
   * there has to be a smart reordering of new tracks based on currently showing
   * ones to reduce unnecessary displacement. If someone was showing up both
   * earlier and now, it's a better UX to keep their position same instead
   * of letting it change.
   * The returned array is a shuffled version of newTracks with position of
   * tracks present in the old tracks intact.
   * eg. old = [1,5,9,3], new = [3,8,2,9], result = [8,2,9,3]
   * @param oldTracks {Array}
   * @param newTracks {Array}
   * @return {Array}
   */
  orderNewTracksToShow(newTracks, oldTracks) {
    const betterNewTracks = [];
    const leftOvers = [];
    // put the common ones in right position
    newTracks.forEach(track => {
      const oldPosition = oldTracks.indexOf(track);
      if (oldPosition !== -1 && oldPosition < newTracks.length) {
        // if track is there currently and we can put it on the same position
        betterNewTracks[oldPosition] = track;
      } else {
        leftOvers.push(track);
      }
    });
    // put the left overs in remaining empty positions
    for (let i = 0; i < newTracks.length; i++) {
      if (!betterNewTracks[i]) {
        betterNewTracks[i] = leftOvers.shift();
      }
    }
    return betterNewTracks;
  }

  /**
   * call detach for tracks which no longer need to be shown and attach for
   * new ones which are to be shown now.
   * Note: oldTracks and newTracks are not necessarily of same length
   * @param oldTracks {Array<String>}
   * @param newTracks {Array<String>}
   * @param tracksMap {Record<String, any>}
   */
  async detachOldAttachNewTracks(oldTracks, newTracks, tracksMap = null) {
    const numTracks = Math.max(oldTracks.length, newTracks.length);
    for (let i = 0; i < numTracks; i++) {
      if (oldTracks[i] === newTracks[i]) {
        continue; // it would already have been attached previously
      } else if (oldTracks[i]) {
        // old track is there but not equal to new track, detach
        // no need to call detach if we know for sure track is no longer in store
        if (!tracksMap || tracksMap[oldTracks[i]]) {
          await this.hmsActions.detachVideo(
            oldTracks[i],
            this.videoElements[i]
          );
        }
        if (this.videoElements[i]) {
          // even if old track got removed from the room, element needs to be cleaned up
          this.videoElements[i].srcObject = null;
        }
      }
      if (newTracks[i]) {
        await this.hmsActions.attachVideo(newTracks[i], this.videoElements[i]);
      }
    }
  }
}

export const PictureInPicture = new PipManager();
// PictureInPicture.initMediaElements().catch(console.error);  // for safari, init early
