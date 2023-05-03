import React, { useEffect, useState } from "react";
import {
  selectLocalPeerID,
  useHMSStore,
  useVideoList,
} from "@100mslive/react-sdk";
import { getLeft, StyledVideoList, useTheme } from "@100mslive/react-ui";
import { Pagination } from "./Pagination";
import ScreenshareTile from "./ScreenshareTile";
import VideoTile from "./VideoTile";
import { useAppConfig } from "./AppData/useAppConfig";
import { useIsHeadless, useUISettings } from "./AppData/useUISettings";
import { UI_SETTINGS } from "../common/constants";

const List = ({
  maxTileCount,
  peers,
  maxColCount,
  maxRowCount,
  includeScreenShareForPeer,
}) => {
  const { aspectRatio } = useTheme();
  const tileOffset = useAppConfig("headlessConfig", "tileOffset");
  const isHeadless = useIsHeadless();
  const hideLocalVideo = useUISettings(UI_SETTINGS.hideLocalVideo);
  const localPeerId = useHMSStore(selectLocalPeerID);
  if (hideLocalVideo && peers.length > 1) {
    peers = filterPeerId(peers, localPeerId);
  }
  const { ref, pagesWithTiles } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
    includeScreenShareForPeer,
    aspectRatio,
    offsetY: getOffset({ isHeadless, tileOffset }),
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
                key={pageNo}
                css={{
                  left: getLeft(pageNo, page),
                  transition: "left 0.3s ease-in-out",
                }}
              >
                {tiles.map(tile => {
                  if (tile.width === 0 || tile.height === 0) {
                    return null;
                  }
                  return tile.track?.source === "screen" ? (
                    <ScreenshareTile
                      key={tile.track.id}
                      width={tile.width}
                      height={tile.height}
                      peerId={tile.peer.id}
                    />
                  ) : (
                    <VideoTile
                      key={tile.track?.id || tile.peer.id}
                      width={tile.width}
                      height={tile.height}
                      peerId={tile.peer?.id}
                      trackId={tile.track?.id}
                      visible={pageNo === page}
                    />
                  );
                })}
              </StyledVideoList.View>
            ))
          : null}
      </StyledVideoList.Container>
      {!isHeadless && pagesWithTiles.length > 1 ? (
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

/**
 * returns a new array of peers with the peer with peerId removed,
 * keeps the reference same if peer is not found
 */
function filterPeerId(peers, peerId) {
  const oldPeers = peers; // to keep the reference same if peer is not found
  let foundPeerToFilterOut = false;
  peers = [];
  for (let i = 0; i < oldPeers.length; i++) {
    if (oldPeers[i].id === peerId) {
      foundPeerToFilterOut = true;
    } else {
      peers.push(oldPeers[i]);
    }
  }
  if (!foundPeerToFilterOut) {
    peers = oldPeers;
  }
  return peers;
}

const getOffset = ({ tileOffset, isHeadless }) => {
  if (!isHeadless || isNaN(Number(tileOffset))) {
    return 32;
  }
  return Number(tileOffset);
};

export default VideoList;
