export const chunk = (elements, chunkSize, onlyOnePage) =>
  elements.reduce((resultArray, tile, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (chunkIndex > 0 && onlyOnePage) {
      return resultArray;
    }
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(tile);
    return resultArray;
  }, []);

/**
 * Given a list of tracks/elements and some constraints, group the tracks in separate pages.
 * @return 2D list for every page which has the original element and height and width
 * for its tile.
 */
export const chunkElements = ({
  elements,
  tilesInFirstPage,
  onlyOnePage,
  isLastPageDifferentFromFirstPage,
  defaultWidth,
  defaultHeight,
  lastPageWidth,
  lastPageHeight,
}) => {
  const chunks = chunk(elements, tilesInFirstPage, onlyOnePage);
  return chunks.map((ch, page) =>
    ch.map(element => {
      const isLastPage = page === chunks.length - 1;
      const width =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageWidth
          : defaultWidth;
      const height =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageHeight
          : defaultHeight;
      return { ...element, height, width };
    })
  );
};

/**
 * Mathematical mode - the element with the highest occurrence in an array
 * @param array
 */
export function mode(array) {
  if (array.length === 0) {
    return null;
  }
  const modeMap = {};
  let maxEl = array[0];
  let maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    if (modeMap[el] === null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

/**
 * get the aspect ration occurring with the highest frequency
 * @param tracks - video tracks to infer aspect ratios from
 */
export const getModeAspectRatio = tracks =>
  mode(
    tracks
      .filter(track => track.track?.width && track.track?.height)
      .map(track => {
        const width = track.track?.width;
        const height = track.track?.height;
        // Default to 1 if there are no video tracks
        return (width || 1) / (height || 1);
      })
  );

/**
 * Finds the largest rectangle area when trying to place N rectangle into a containing
 * rectangle without rotation.
 *
 * @param {Number}  containerWidth      The width of the container.
 * @param {Number}  containerHeight     The height of the container.
 * @param {Number}  numRects            How many rectangles must fit within.
 * @param {Number}  width               The unscaled width of the rectangles to be placed.
 * @param {Number}  height              The unscaled height of the rectangles to be placed.
 * @return {Object}                     The area and number of rows and columns that fit.
 */
export const largestRect = (
  containerWidth,
  containerHeight,
  numRects,
  width,
  height
) => {
  if (containerWidth < 0 || containerHeight < 0) {
    throw new Error("Container must have a non-negative area");
  }
  if (numRects < 1 || !Number.isInteger(numRects)) {
    throw new Error("Number of shapes to place must be a positive integer");
  }
  const aspectRatio = width && height && width / height;
  if (aspectRatio !== undefined && isNaN(aspectRatio)) {
    throw new Error("Aspect ratio must be a number");
  }

  let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };

  // TODO: Don't start with obviously-`ba`d candidates.
  const startCols = numRects;
  const colDelta = -1;

  // For each combination of rows + cols that can fit the number of rectangles,
  // place them and see the area.
  if (aspectRatio !== undefined) {
    for (let cols = startCols; cols > 0; cols += colDelta) {
      const rows = Math.ceil(numRects / cols);
      const hScale = containerWidth / (cols * aspectRatio);
      const vScale = containerHeight / rows;
      let width;
      let height;
      // Determine which axis is the constraint.
      if (hScale <= vScale) {
        width = containerWidth / cols;
        height = width / aspectRatio;
      } else {
        height = containerHeight / rows;
        width = height * aspectRatio;
      }
      const area = width * height;
      if (area > best.area) {
        best = { area, width, height, rows, cols };
      }
    }
  }
  return best;
};

export const getTileSizesWithColConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const cols = Math.min(
    Math.ceil(
      Math.sqrt(
        (count * (parentWidth / parentHeight)) /
          (aspectRatio.width / aspectRatio.height)
      )
    ),
    maxCount
  );
  let width = parentWidth / cols;
  let height = width / (aspectRatio.width / aspectRatio.height);
  if (height > parentHeight) {
    height = parentHeight;
    width = height / (aspectRatio.height / aspectRatio.width);
  }
  const rows = Math.floor(parentHeight / height);
  console.error({ width, height, cols, rows });
  defaultHeight = height;
  defaultWidth = width;
  tilesInFirstPage = Math.min(count, rows * cols);
  tilesinLastPage = count % (rows * cols);
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > rows * cols;
  if (isLastPageDifferentFromFirstPage) {
    const cols = Math.min(
      Math.ceil(
        Math.sqrt(
          (tilesinLastPage * (parentWidth / parentHeight)) /
            (aspectRatio.width / aspectRatio.height)
        )
      ),
      maxCount
    );
    let width = parentWidth / cols;
    let height = width / (aspectRatio.width / aspectRatio.height);
    if (height > parentHeight) {
      height = parentHeight;
      width = height / (aspectRatio.height / aspectRatio.width);
    }
    lastPageHeight = height;
    lastPageWidth = width;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

export const getTileSizesWithPageConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const { width: initialWidth, height: initialHeight } = largestRect(
    parentWidth,
    parentHeight,
    Math.min(count, maxCount),
    aspectRatio.width,
    aspectRatio.height
  );
  defaultWidth = initialWidth;
  defaultHeight = initialHeight;
  tilesInFirstPage = Math.min(count, maxCount);
  tilesinLastPage = count % maxCount;
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > maxCount;
  if (isLastPageDifferentFromFirstPage) {
    const { width: remWidth, height: remHeight } = largestRect(
      parentWidth,
      parentHeight,
      tilesinLastPage,
      aspectRatio.width,
      aspectRatio.height
    );
    lastPageWidth = remWidth;
    lastPageHeight = remHeight;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

export const getTileSizesWithRowConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const rows = Math.min(
    Math.ceil(
      Math.sqrt(
        (count * (aspectRatio.width / aspectRatio.height)) /
          (parentWidth / parentHeight)
      )
    ),
    maxCount
  );
  const height = parentHeight / rows;
  const width = height * (aspectRatio.width / aspectRatio.height);
  const cols = Math.floor(parentWidth / width);
  defaultWidth = width;
  defaultHeight = height;
  tilesInFirstPage = Math.min(count, rows * cols);
  tilesinLastPage = count % (rows * cols);
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > rows * cols;
  if (isLastPageDifferentFromFirstPage) {
    const rows = Math.min(
      Math.ceil(
        Math.sqrt(
          (tilesinLastPage * (aspectRatio.width / aspectRatio.height)) /
            (parentWidth / parentHeight)
        )
      ),
      maxCount
    );
    const height = parentHeight / rows;
    const width = height * (aspectRatio.width / aspectRatio.height);
    lastPageHeight = height;
    lastPageWidth = width;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

const getLayoutSizes = ({
  tiles,
  maxColCount,
  aspectRatio,
  parentWidth,
  parentHeight,
}) => {
  const cols = Math.min(maxColCount, Math.ceil(Math.sqrt(tiles)));
  const rows = Math.ceil(tiles / cols);
  let height = parentHeight / rows;
  let width = height * (aspectRatio.width / aspectRatio.height);
  if (width * cols > parentWidth) {
    width = parentWidth / cols;
    height = width / (aspectRatio.width / aspectRatio.height);
  }
  return { width, height, rows, cols };
};

export const getTileSizesWithTileAndColConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  maxColCount,
  aspectRatio,
}) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  let lastPageRows = 0;
  let lastPageCols = 0;
  const tiles = Math.min(count, maxCount);
  const { rows, cols, width, height } = getLayoutSizes({
    tiles,
    maxColCount,
    parentWidth,
    parentHeight,
    aspectRatio,
  });
  defaultWidth = width;
  defaultHeight = height;
  tilesInFirstPage = Math.min(count, rows * cols, maxCount);
  tilesinLastPage = count % (rows * cols);
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > rows * cols;
  if (isLastPageDifferentFromFirstPage) {
    const { width, height, rows, cols } = getLayoutSizes({
      tiles: tilesinLastPage,
      maxColCount,
      parentWidth,
      parentHeight,
      aspectRatio,
    });
    lastPageHeight = height;
    lastPageWidth = width;
    lastPageRows = rows;
    lastPageCols = cols;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
    rows,
    cols,
    lastPageCols,
    lastPageRows,
  };
};

export function calculateLayoutSizes({
  count,
  parentWidth,
  parentHeight,
  maxTileCount,
  maxRowCount,
  maxColCount,
  aspectRatio,
}) {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let rows = 0;
  let cols = 0;
  let lastPageCols = 0;
  let lastPageRows = 0;

  if (count === 0) {
    // no tracks to show
    return {
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    };
  }

  if (maxTileCount && maxColCount) {
    ({
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
    } = getTileSizesWithTileAndColConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxTileCount,
      maxRowCount,
      maxColCount,
      aspectRatio,
    }));
  } else if (maxTileCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithPageConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxTileCount,
      aspectRatio,
    }));
  } else if (maxRowCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithRowConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxRowCount,
      aspectRatio,
    }));
  } else if (maxColCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithColConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxColCount,
      aspectRatio,
    }));
  } else {
    const { width, height } = largestRect(
      parentWidth,
      parentHeight,
      count,
      aspectRatio.width,
      aspectRatio.height
    );
    defaultWidth = width;
    defaultHeight = height;
    tilesInFirstPage = count;
  }
  return {
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
  };
}

/**
 * given list of peers and all tracks in the room, get a list of tile objects to show in the UI
 * @param peers
 * @param tracks
 * @param includeScreenShareForPeer - fn will be called to check whether to include screenShare for the peer in returned tiles
 * @param filterNonPublishingPeers - by default a peer with no tracks won't be counted towards final tiles
 */
export const getVideoTracksFromPeers = (
  peers,
  tracks,
  includeScreenShareForPeer,
  filterNonPublishingPeers = true
) => {
  if (!peers || !tracks || !includeScreenShareForPeer) {
    return [];
  }
  const peerTiles = [];
  for (const peer of peers) {
    const onlyAudioTrack =
      peer.videoTrack === undefined &&
      peer.audioTrack &&
      tracks[peer.audioTrack];
    if (onlyAudioTrack) {
      peerTiles.push({ peer: peer });
    } else if (peer.videoTrack && tracks[peer.videoTrack]) {
      peerTiles.push({ track: tracks[peer.videoTrack], peer: peer });
    } else if (!filterNonPublishingPeers) {
      peerTiles.push({ peer: peer });
    }
    // Handle video tracks in auxiliary tracks as well.
    if (peer.auxiliaryTracks.length > 0) {
      peer.auxiliaryTracks.forEach(trackId => {
        const track = tracks[trackId];
        if (track?.type === "video" && track?.source === "regular") {
          peerTiles.push({ track, peer });
        }
      });
    }
    if (includeScreenShareForPeer(peer) && peer.auxiliaryTracks.length > 0) {
      const screenShareTrackID = peer.auxiliaryTracks.find(trackID => {
        const track = tracks[trackID];
        return track?.type === "video" && track?.source === "screen";
      });
      // Don't show tile if screenshare only has audio
      if (screenShareTrackID) {
        peerTiles.push({ track: tracks[screenShareTrackID], peer: peer });
      }
    }
  }
  return peerTiles;
};
