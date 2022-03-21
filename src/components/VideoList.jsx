import React, { useEffect, useState } from "react";
import {
  StyledVideoList,
  getLeft,
  Pagination,
  useTheme,
} from "@100mslive/react-ui";
import { useVideoList } from "@100mslive/react-sdk";
import VideoTile from "./VideoTile";
import ScreenshareTile from "./ScreenshareTile";

const List = ({
  maxTileCount,
  peers,
  showStatsOnTiles,
  maxColCount,
  maxRowCount,
  isAudioOnly,
  includeScreenShareForPeer,
}) => {
  const { aspectRatio } = useTheme();
  const { ref, pagesWithTiles } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
    includeScreenShareForPeer,
    aspectRatio,
    offsetY: 32,
  });
  const [page, setPage] = useState(0);
  useEffect(() => {
    // currentPageIndex should not exceed pages length
    if (page >= pagesWithTiles.length) {
      setPage(0);
    }
  }, [pagesWithTiles.length, page]);
  return (
    <StyledVideoList.Root ref={ref}>
      <StyledVideoList.Container>
        {pagesWithTiles && pagesWithTiles.length > 0
          ? pagesWithTiles.map((tiles, pageNo) => (
              <StyledVideoList.View
                css={{
                  left: getLeft(pageNo, page),
                  transition: "left 0.3s ease-in-out",
                }}
                key={pageNo}
              >
                {tiles.map(tile =>
                  tile.track?.source === "screen" ? (
                    <ScreenshareTile
                      showStatsOnTiles={showStatsOnTiles}
                      key={tile.track.id}
                      width={tile.width}
                      height={tile.height}
                      peerId={tile.peer.id}
                      isAudioOnly={isAudioOnly}
                    />
                  ) : (
                    <VideoTile
                      showStatsOnTiles={showStatsOnTiles}
                      key={tile.track?.id || tile.peer.id}
                      width={tile.width}
                      height={tile.height}
                      peerId={tile.peer?.id}
                      isAudioOnly={isAudioOnly}
                    />
                  )
                )}
              </StyledVideoList.View>
            ))
          : null}
      </StyledVideoList.Container>
      {pagesWithTiles.length > 1 ? (
        <Pagination
          page={page}
          setPage={setPage}
          numPages={pagesWithTiles.length}
        />
      ) : null}
    </StyledVideoList.Root>
  );
};

const VideoList = React.memo(List);

export default VideoList;
