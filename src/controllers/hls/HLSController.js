import { EventEmitter2 as EventEmitter } from "eventemitter2";
import Hls from "hls.js";
import { FeatureFlags } from "../../services/FeatureFlags";

export const HLS_TIMED_METADATA_LOADED = "hls-timed-metadata";
export const HLS_STREAM_NO_LONGER_LIVE = "hls-stream-no-longer-live";
export const HLS_DEFAULT_ALLOWED_MAX_LATENCY_DELAY = 3; // seconds

export class HLSController {
  hls;
  videoRef;
  eventEmitter = new EventEmitter();
  isLive = true;
  constructor(hlsUrl, videoRef) {
    this.hls = new Hls(this.getHLSConfig());
    this.videoRef = videoRef;
    this.hls.loadSource(hlsUrl);
    this.hls.attachMedia(videoRef.current);
    this.handleHLSTimedMetadataParsing();
    this.ControllerEvents = [
      HLS_TIMED_METADATA_LOADED,
      HLS_STREAM_NO_LONGER_LIVE,
    ];
  }

  reset() {
    if (this.hls && this.hls.media) {
      this.hls.detachMedia();
      this.hls = null;
    }
    this.eventEmitter = null;
  }

  /**
   *
   * @returns returns a Number which represents current
   * quality level. -1 if currentlevel is set to "Auto"
   */
  getCurrentLevel() {
    return this.hls.currentLevel;
  }

  /**
   *
   * @param { Hls.Level } currentLevel - currentLevel we want to
   * set the stream to. -1 for Auto
   */
  setCurrentLevel(currentLevel) {
    const newLevel = this.hls.levels.findIndex(
      level =>
        level.height === currentLevel.height &&
        level.width === currentLevel.width
    );
    this.hls.currentLevel = newLevel;
  }

  getHlsJsInstance() {
    return this.hls;
  }

  jumpToLive() {
    const videoEl = this.videoRef.current;
    videoEl.currentTime = this.hls.liveSyncPosition;
    if (videoEl.paused) {
      try {
        videoEl.play();
      } catch (err) {
        console.error("Attempt to jump to live position Failed.", err);
      }
    }
  }

  /**
   * Event listener. Also takes HLS JS events. If its
   * not a Controller's event, it just forwards the
   * request to hlsjs
   * @param {string | Hls.Events} eventName
   * @param {Function} eventCallback
   */
  on(eventName, eventCallback) {
    /**
     * slight optimization. If the user is not
     * interested in HLS_STREAM_NO_LONGER_LIVE,
     * we don't have to register time_update event
     * as it is a bit costly.
     */
    if (eventName === HLS_STREAM_NO_LONGER_LIVE) {
      this.enableTimeUpdateListener();
    }
    if (!this.ControllerEvents.includes(eventName)) {
      this.hls.on(eventName, eventCallback);
    } else {
      this.eventEmitter.addListener(eventName, eventCallback);
    }
  }

  off(eventName, eventCallback) {
    if (!this.ControllerEvents.includes(eventName)) {
      this.hls?.off(eventName, eventCallback);
    } else {
      this.eventEmitter?.removeListener(eventName, eventCallback);
    }
  }

  // listen for pause, play as well to show not live if paused
  enableTimeUpdateListener() {
    this.videoRef.current.addEventListener("timeupdate", _ => {
      const videoEl = this.videoRef.current;
      if (this.hls && videoEl) {
        const allowedDelay =
          this.getHLSConfig().liveMaxLatencyDuration ||
          HLS_DEFAULT_ALLOWED_MAX_LATENCY_DELAY;
        this.isLive =
          this.hls.liveSyncPosition - videoEl.currentTime <= allowedDelay;
        if (!this.isLive) {
          this.eventEmitter.emit(HLS_STREAM_NO_LONGER_LIVE);
        }
      }
    });
  }
  handleHLSTimedMetadataParsing() {
    /**
     * Metadata are automatically parsed and added to the video element's
     * textTrack cue by hlsjs as they come through the stream.
     * in FRAG_CHANGED, we read the cues and emit HLS_METADATA_LOADED
     * when the current fragment has a metadata to play.
     */
    this.hls.on(Hls.Events.FRAG_CHANGED, (_, { frag }) => {
      try {
        if (this.videoRef.current.textTracks.length === 0) {
          return;
        }

        const fragStartTime = frag.start;
        /**
         * this destructuring is needed because the cues array not a pure
         * JS array and prevents us from
         * performing array operations like map(),filter() etc.
         */
        const metadata = [...this.videoRef.current.textTracks[0].cues];
        /**
         * filter out only the metadata that have startTime set to future.
         * (i.e) more than the current fragment's startime.
         */
        const metadataAfterFragStart = metadata.filter(mt => {
          return mt.startTime >= fragStartTime;
        });

        metadataAfterFragStart.forEach(mt => {
          const timeDifference = mt.startTime - fragStartTime;
          const fragmentDuration = frag.end - frag.start;

          if (timeDifference < fragmentDuration) {
            const payload = mt.value.data;
            /**
             * we start a timeout for difference seconds.
             * NOTE: Due to how setTimeout works, the time is only the minimum gauranteed
             * time JS will wait before calling emit(). It's not guaranteed even
             * for timeDifference = 0.
             */
            setTimeout(() => {
              /** Even though duration comes as an attribute in the stream,
               * HlsJs doesn't give us a property duration directly. So
               * we calculate it ouselves. This is same as reading
               * EXT-INF tag.
               */
              const duration = mt.endTime - mt.startTime;

              /**
               * finally emit event letting the user know its time to
               * do whatever they want with the payload
               */
              this.eventEmitter.emit(HLS_TIMED_METADATA_LOADED, {
                payload,
                duration,
                metadata: mt,
              });
            }, timeDifference * 1000);
          }
        });
      } catch (e) {
        console.error("FRAG_CHANGED event error", e);
      }
    });
  }

  getHLSConfig() {
    if (FeatureFlags.optimiseHLSLatency()) {
      // should reduce the latency by around 2-3 more seconds. Won't work well without good internet.
      return {
        enableWorker: true,
        liveSyncDuration: 1,
        liveMaxLatencyDuration: 5,
        liveDurationInfinity: true,
        highBufferWatchdogPeriod: 1,
      };
    }
    return {
      enableWorker: true,
      maxBufferLength: 20,
      backBufferLength: 10,
    };
  }
}
