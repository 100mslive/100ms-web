import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { selectTracksMap, useHMSVanillaStore } from "@100mslive/react-sdk";
// import { useHMSVanillaStore } from '../primitives/HmsRoomProvider';
import {
  calculateLayoutSizes,
  chunkElements,
  getModeAspectRatio,
  getVideoTracksFromPeers,
} from "./layout";

const DEFAULTS = {
  aspectRatio: {
    width: 1,
    height: 1,
  },
};

/**
 * This hook can be used to build a paginated gallery view of video tiles. You can give the hook
 * a list of all the peers which need to be shown and it tells you how to structure the UI by giving
 * a list of pages with every page having a list of video tiles.
 * Please check the documentation of input and output types for more details.
 */
export const useVideoList = ({
  peers,
  maxTileCount,
  maxColCount,
  maxRowCount,
  includeScreenShareForPeer = () => false,
  aspectRatio = DEFAULTS.aspectRatio,
  filterNonPublishingPeers = true,
  offsetY = 0,
}) => {
  const { width = 0, height = 0, ref } = useResizeDetector();
  const store = useHMSVanillaStore();
  // using vanilla store as we don't need re-rendering every time something in a track changes
  const tracksMap = store.getState(selectTracksMap);
  const tracksWithPeer = getVideoTracksFromPeers(
    peers,
    tracksMap,
    includeScreenShareForPeer,
    filterNonPublishingPeers
  );
  const finalAspectRatio = useMemo(() => {
    if (aspectRatio) {
      return aspectRatio;
    }
    const modeAspectRatio = getModeAspectRatio(tracksWithPeer);
    // Default to 1 if there are no video tracks
    return {
      width: modeAspectRatio || 1,
      height: 1,
    };
  }, [aspectRatio, tracksWithPeer]);
  const count = tracksWithPeer.length;
  const {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
    rows,
    cols,
    lastPageRows,
    lastPageCols,
  } = useMemo(
    () =>
      calculateLayoutSizes({
        count,
        parentWidth: Math.floor(width),
        parentHeight: Math.floor(height) - Math.min(height, offsetY),
        maxTileCount,
        maxRowCount,
        maxColCount,
        aspectRatio: finalAspectRatio,
      }),
    [
      count,
      width,
      height,
      maxTileCount,
      maxRowCount,
      maxColCount,
      finalAspectRatio,
      offsetY,
    ]
  );
  const chunkedTracksWithPeer = useMemo(
    () =>
      chunkElements({
        elements: tracksWithPeer,
        tilesInFirstPage,
        onlyOnePage: false,
        isLastPageDifferentFromFirstPage,
        defaultWidth,
        defaultHeight,
        lastPageWidth,
        lastPageHeight,
      }),
    [
      tracksWithPeer,
      tilesInFirstPage,
      isLastPageDifferentFromFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
    ]
  );
  return {
    pagesWithTiles: chunkedTracksWithPeer,
    rows,
    cols,
    lastPageRows,
    lastPageCols,
    ref,
  };
};
