import React, { useEffect, useState } from "react";
import { StyledVideoList, getLeft, Pagination } from "@100mslive/react-ui";
import { useVideoList } from "@100mslive/react-sdk";
import HmsVideoTile from "./VideoTile";

const HmsVideoList = ({
  maxTileCount,
  peers,
  showStatsOnTiles,
  maxColCount,
  maxRowCount,
}) => {
  const { ref, pagesWithTiles } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
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
                {tiles.map(tile => (
                  <HmsVideoTile
                    showStatsOnTiles={showStatsOnTiles}
                    key={tile.peer.id}
                    width={tile.width}
                    height={tile.height}
                    peerId={tile.peer.id}
                  />
                ))}
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

export default HmsVideoList;
