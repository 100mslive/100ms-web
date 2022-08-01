import Hls from "hls.js";
import { EventEmitter2 as EventEmitter } from "eventemitter2";
import { FeatureFlags } from "../../services/FeatureFlags";
import {
  getSecondsFromTime,
  isAlreadyInMetadataMap,
  parseAttributesFromMetadata,
  parseTagsList,
} from "./HLSUtils";

export const HLS_TIMED_METADATA_LOADED = "hls-timed-metadata";
export const HLS_STREAM_NO_LONGER_LIVE = "hls-stream-no-longer-live";
export const HLS_DEFAULT_ALLOWED_MAX_LATENCY_DELAY = 10; // seconds

export class HLSController {
  hls;
  videoRef;
  metadataByTimeStamp = new Map();
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
    this.metadataByTimeStamp = null;
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
   * @param { Number } currentLevel - currentLevel we want to
   * set the stream to. -1 for Auto
   */
  setCurrentLevel(currentLevel) {
    this.hls.currentLevel = currentLevel;
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
    if (this.ControllerEvents.indexOf(eventName) === -1) {
      this.hls.on(eventName, eventCallback);
    } else {
      this.eventEmitter.addListener(eventName, eventCallback);
    }
  }

  // listen for pause, play as well to show not live if paused
  enableTimeUpdateListener() {
    this.videoRef.current.addEventListener("timeupdate", _ => {
      if (this.hls) {
        const videoEl = this.videoRef.current;
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
     * Everytime a fragment is appended to the buffer,
     * we parse the tags and see if the metadata is
     * in the tags. If it does, we parse the metadatastrings
     * and create a metadataMap. This metadataMap is a map of key value
     * pairs with timeinSeconds as key and the value is an array of objects
     * of the parsed metadata.
     * (e.g)
     *  {
     *   36206: [{
     *     duration: "20",
     *     id: "c382fce1-d551-4862-bdb3-c255ca668154",
     *     payload: "hello2572",
     *     startTime: Tue Jun 28 2022 10:03:26 GMT+0530 (India Standard Time)
     *   }]
     * }
     */
    this.hls.on(Hls.Events.BUFFER_APPENDED, (_, { frag }) => {
      try {
        const tagList = frag?.tagList;
        const tagsMap = parseTagsList(tagList);
        // There could be more than one EXT-X-DATERANGE tags in a fragment.
        const metadataStrings = tagsMap.rawTags["EXT-X-DATERANGE"] || [];
        if (metadataStrings.length > 0) {
          for (let metadataString of metadataStrings) {
            const tagMetadata = parseAttributesFromMetadata(metadataString);
            const timeSegment = getSecondsFromTime(tagMetadata.startTime);
            /**
             * a single timestamp can have upto 3 DATERANGE tags.
             * so we accumulate everything into a single key such that
             * <timesegment>: [mt1, mt2, mt3]
             */
            if (this.metadataByTimeStamp.has(timeSegment)) {
              // entry already exist in metadatamap
              const metadataByTimeStampEntries =
                this.metadataByTimeStamp.get(timeSegment);

              /**
               * Backend will keep sending the same metadata tags in each fragments
               * until the fragment programtime exceed metadata starttime. so to prevent
               * same tags getting parsed into metadataMap, we do a quick check here.
               */
              if (
                !isAlreadyInMetadataMap(metadataByTimeStampEntries, tagMetadata)
              ) {
                // append current metadata to existing timestamp
                this.metadataByTimeStamp.get(timeSegment).push(tagMetadata);
              }
            } else {
              // no entry in metadataMap exist. So add a new entry
              this.metadataByTimeStamp.set(timeSegment, [
                {
                  ...tagMetadata,
                },
              ]);
            }
          }
        }
      } catch (e) {
        console.error("Error in extracting timemetadata", e);
      }
    });

    /**
     * on Every Fragment change, we check if the fragment's
     * PROGRAM_TIME is nearby a possible metadata's START_TIME
     * If it does, we start a setTimeout and try to emit an event
     * on the right time.
     * NOTE: Javascript cannot gaurantee exact time, it
     * only gaurantees minimum time before trying to emit.
     */
    this.hls.on(Hls.Events.FRAG_CHANGED, (_, { frag }) => {
      try {
        const tagsList = parseTagsList(frag?.tagList);

        const timeSegment = getSecondsFromTime(tagsList.fragmentStartAt);
        const timeStamps = [];
        this.metadataByTimeStamp.forEach((value, key) => {
          timeStamps.push(key);
        });

        let nearestTimeStamp = timeSegment;
        timeStamps.push(timeSegment);
        timeStamps.sort();

        const whereAmI = timeStamps.indexOf(timeSegment);
        nearestTimeStamp = timeStamps[whereAmI + 1];

        /**
         * This check is if timestamp ends up on the
         * end of the array after sorting. Meaning,
         * there is no possible future events.
         * Hence NearestTimeStamp will be undefined.
         */
        if (isNaN(nearestTimeStamp)) {
          return;
        }

        /**
         * at this point its gauranteed that we have a timesegment and a possible
         * future event very close. We now take the difference between them.
         * The difference must always be between 0(start of the fragment) and INF duration(end of the fragment)
         * if it is not, then the metadata doesn't belong to this fragment and we leave it
         * 'as-is' so future fragments can try to parse it.
         *
         * (e.g) timestamp => [5,11,12,15,20,22], duration = 2.
         *
         * Fragment1_timesegment = 11 => nearestTimeStamp=>11 => 11 - 11 = 0 (play at start of the fragment)
         *
         * Fragment2_timesegment = 14 => nearestTimeStamp=>15 => 15 - 14 = 1 (still inside duration.
         * so play after 1 sec of the start of the fragment)
         *
         * Fragment3_timesegment = 15 => nearestTimeStamp=>20 => 20 - 15 = 5 (5 is greated than duration 2. so
         * this does not belong to this fragment. ignore and move on to next fragment)
         *
         * Fragment4_timesegment = 19 => nearestTimeStamp=>20 => 20 - 19 = 1 (valid)
         *
         */

        const timeDifference = nearestTimeStamp - timeSegment;
        if (timeDifference >= 0 && timeDifference < tagsList.duration) {
          const payload = this.metadataByTimeStamp
            .get(nearestTimeStamp)
            .map(metadata => metadata.payload);
          /**
           * we start a timeout for difference seconds.
           * NOTE: Due to how setTimeout works, the time is only the minimum gauranteed
           * time JS will wait before calling emit(). It's not guaranteed even
           * for timeDifference = 0.
           */
          setTimeout(() => {
            /**
             * finally emit event letting the user know its time to
             * do whatever they want with the payload
             */
            this.eventEmitter.emit(HLS_TIMED_METADATA_LOADED, payload);
            /** we delete the occured events from the metadataMap. This is not
             * needed for the operation. Just a bit of optimisation as a really
             * long stream with many metadata can quickly make the metadataMap really big.
             */
            this.metadataByTimeStamp.delete(nearestTimeStamp);
          }, timeDifference * 1000);
        }
      } catch (e) {
        console.error("Frag changed event listener error:", e);
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
