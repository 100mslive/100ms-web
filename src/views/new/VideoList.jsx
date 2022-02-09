import React, { useEffect, useState } from "react";
import { StyledVideoList, getLeft, Pagination } from "@100mslive/react-ui";
import { useVideoList } from "@100mslive/react-sdk";
import HmsVideoTile from "./VideoTile";
import HmsScreenshareTile from "./ScreenshareTile";

const VideoList = ({
  maxTileCount,
  peers,
  showStatsOnTiles,
  maxColCount,
  maxRowCount,
  includeScreenShareForPeer,
}) => {
  const { ref, pagesWithTiles } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
    includeScreenShareForPeer,
  });
  const [page, setPage] = useState(0);
  useEffect(() => {
    // currentPageIndex should not exceed pages length
    if (page >= pagesWithTiles.length) {
      setPage(0);
    }
  }, [pagesWithTiles.length, page]);
  return (
    <StyledVideoList.Root>
      <StyledVideoList.Container ref={ref}>
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
                    <HmsScreenshareTile
                      showStatsOnTiles={showStatsOnTiles}
                      key={tile.track.id}
                      width={tile.width}
                      height={tile.height}
                      trackId={tile.track.id}
                    />
                  ) : (
                    <HmsVideoTile
                      showStatsOnTiles={showStatsOnTiles}
                      key={tile.track?.id || tile.peer.id}
                      width={tile.width}
                      height={tile.height}
                      trackId={tile.track?.id}
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

const HmsVideoList = React.memo(VideoList);

export default HmsVideoList;
