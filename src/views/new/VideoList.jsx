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
  const { ref, chunkedTracksWithPeer } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
  });
  const [page, setPage] = useState(0);
  useEffect(() => {
    // currentPageIndex should not exceed pages length
    if (page >= chunkedTracksWithPeer.length) {
      setPage(0);
    }
  }, [chunkedTracksWithPeer.length, page]);
  const list = new Array(chunkedTracksWithPeer.length).fill("");
  return (
    <StyledVideoList.Root>
      <StyledVideoList.Container ref={ref}>
        {chunkedTracksWithPeer && chunkedTracksWithPeer.length > 0
          ? chunkedTracksWithPeer.map((l, i) => (
              <StyledVideoList.View
                css={{
                  left: getLeft(i, page),
                  transition: "left 0.3s ease-in-out",
                }}
                key={i}
              >
                {l.map(p => (
                  <HmsVideoTile
                    showStatsOnTiles={showStatsOnTiles}
                    key={p.peer.id}
                    width={p.width}
                    height={p.height}
                    peerId={p.peer.id}
                  />
                ))}
              </StyledVideoList.View>
            ))
          : null}
      </StyledVideoList.Container>
      {chunkedTracksWithPeer.length > 1 ? (
        <Pagination page={page} setPage={setPage} list={list} />
      ) : null}
    </StyledVideoList.Root>
  );
};

export default HmsVideoList;
