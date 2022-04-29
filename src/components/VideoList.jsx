import React, { useEffect, useState } from "react";
import { Freeze } from "react-freeze";
import { StyledVideoList, getLeft, useTheme } from "@100mslive/react-ui";
import { useVideoList } from "@100mslive/react-sdk";
import VideoTile from "./VideoTile";
import ScreenshareTile from "./ScreenshareTile";
import { FeatureFlags } from "../services/FeatureFlags";
import { Pagination } from "./Pagination";

const List = ({
  maxTileCount,
  peers,
  showStatsOnTiles,
  maxColCount,
  maxRowCount,
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
  const useFreeze = FeatureFlags.freezeVideoList();
  return (
    <StyledVideoList.Root ref={ref}>
      <StyledVideoList.Container>
        {pagesWithTiles && pagesWithTiles.length > 0
          ? pagesWithTiles.map((tiles, pageNo) => (
              <Freeze freeze={useFreeze && page !== pageNo}>
                <StyledVideoList.View
                  css={{
                    left: getLeft(pageNo, page),
                    transition: "left 0.3s ease-in-out",
                  }}
                  key={pageNo}
                >
                  {tiles.map((tile, i) =>
                    tile.track?.source === "screen" ? (
                      <ScreenshareTile
                        showStatsOnTiles={showStatsOnTiles}
                        key={tile.track.id}
                        width={tile.width}
                        height={tile.height}
                        peerId={tile.peer.id}
                      />
                    ) : (
                      <VideoTile
                        showStatsOnTiles={showStatsOnTiles}
                        key={tile.track?.id || tile.peer.id}
                        width={tile.width}
                        height={tile.height}
                        peerId={tile.peer?.id}
                        index={i}
                      />
                    )
                  )}
                </StyledVideoList.View>
              </Freeze>
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
