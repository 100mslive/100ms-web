import React, { Fragment, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useMedia } from "react-use";
import {
  selectAppData,
  selectLocalPeer,
  selectRemotePeers,
  selectRolesMap,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, config as cssConfig, Flex } from "@100mslive/roomkit-react";
import { FirstPersonDisplay } from "../components/FirstPersonDisplay";
import VideoTile from "../components/VideoTile";
import { useRolePreference } from "../components/hooks/useFeatures";
import { APP_DATA } from "../common/constants";

const getAspectRatio = ({ roleMap, roleName, isMobile }) => {
  const role = roleMap[roleName];
  const { width, height } = role.publishParams.video;
  return isMobile ? height / width : width / height;
};

export function InsetView() {
  const remotePeers = useHMSStore(selectRemotePeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const isMobile = useMedia(cssConfig.media.md);
  const isLandscape = useMedia(cssConfig.media.ls);
  const roleMap = useHMSStore(selectRolesMap);
  const rolePreference = useRolePreference();
  let centerPeers = [];
  let sidepanePeers = [];
  if (rolePreference) {
    const center = rolePreference[localPeer.roleName]?.split(",") || [];
    for (const peer of remotePeers) {
      if (center.includes(peer.roleName)) {
        centerPeers.push(peer);
      } else {
        sidepanePeers.push(peer);
      }
    }
    if (centerPeers.length === 0 && sidepanePeers.length > 0) {
      centerPeers = sidepanePeers;
      sidepanePeers = [];
    }
  } else {
    centerPeers = remotePeers;
  }
  const hideInset = sidepanePeers.length > 0 && (isMobile || isLandscape);

  return (
    <Fragment>
      <Box
        css={{
          display: "grid",
          gridTemplateColumns: sidepanePeers.length > 0 ? "3fr 1fr" : "100%",
          gridTemplateRows: "1fr",
          gap: "$8",
          px: "$10",
          size: "100%",
          "@md": {
            gridTemplateColumns: "1fr",
            gridTemplateRows: sidepanePeers.length > 0 ? `3fr 1fr` : "100%",
          },
        }}
      >
        <Flex
          align="center"
          justify="center"
          css={{
            size: "100%",
            gap: "$8",
            flexWrap: "wrap",
            placeContent: "center",
            minHeight: 0,
            minWidth: 0,
            "@lg": { flexFlow: "column" },
            "@ls": { flexFlow: "row" },
          }}
        >
          {centerPeers.length > 0 ? (
            centerPeers.map(peer => (
              <VideoTile
                key={peer.videoTrack || peer.id}
                peerId={peer.id}
                trackId={peer.videoTrack}
                rootCSS={{
                  aspectRatio: getAspectRatio({
                    roleMap,
                    roleName: peer.roleName,
                    isMobile,
                  }),
                  padding: 0,
                  height: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  minHeight: 0,
                  flex: remotePeers.length === 1 ? undefined : "1 1 0",
                  display: "flex",
                  alignItems: "center",
                  "@lg": {
                    display: "block",
                    padding: "0 !important",
                    width: "100%",
                  },
                }}
                objectFit="contain"
              />
            ))
          ) : (
            <FirstPersonDisplay />
          )}
        </Flex>
        {sidepanePeers.length > 0 && (
          <Flex
            align="center"
            justify="center"
            css={{
              size: "100%",
              gap: "$4",
              flexFlow: "row wrap",
              placeContent: "center",
            }}
          >
            {(hideInset ? [...sidepanePeers, localPeer] : sidepanePeers).map(
              (peer, _, arr) => (
                <VideoTile
                  key={peer.videoTrack || peer.id}
                  peerId={peer.id}
                  trackId={peer.videoTrack}
                  rootCSS={{
                    aspectRatio: getAspectRatio({
                      roleMap,
                      roleName: peer.roleName,
                      isMobile: false,
                    }),
                    flexBasis: "100%",
                    "@ls": {
                      aspectRatio: 1,
                      flexBasis: "calc(50% - $4)",
                    },
                    "@md": {
                      aspectRatio: 1,
                      flexBasis:
                        arr.length < 4 ? "calc(50% - $4)" : "calc(33% - $4)",
                    },
                    "@sm": {
                      flexBasis:
                        arr.length <= 4 ? "calc(50% - $4)" : "calc(33% - $4)",
                    },
                    padding: 0,
                  }}
                  objectFit="contain"
                />
              )
            )}
          </Flex>
        )}
      </Box>
      {!hideInset && (
        <InsetTile
          roleMap={roleMap}
          isMobile={isMobile}
          isLandscape={isLandscape}
        />
      )}
    </Fragment>
  );
}

const InsetTile = ({ isMobile, roleMap, isLandscape }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const sidepane = useHMSStore(selectAppData(APP_DATA.sidePane));
  const aspectRatio = getAspectRatio({
    roleMap,
    roleName: localPeer.roleName,
    isMobile,
  });
  let height = 180;
  let width = height * aspectRatio;
  if (isLandscape && width > 240) {
    width = 240;
    height = width / aspectRatio;
  }
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current || !window.ResizeObserver) {
      return;
    }
    const node = nodeRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === node.parentElement) {
          // reset to original position on resize
          node.style.transform = `translate(0,0)`;
        }
      });
    });
    resizeObserver.observe(node.parentElement);
    return () => {
      node?.parentElement && resizeObserver?.unobserve(node.parentElement);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef}>
      <Box
        ref={nodeRef}
        css={{
          position: "absolute",
          bottom: 0,
          right: sidepane ? "$100" : "$10",
          mr: sidepane ? "$14" : 0,
          boxShadow: "0 0 8px 0 rgba(0,0,0,0.3)",
          zIndex: 10,
          aspectRatio: aspectRatio,
          h: height,
        }}
      >
        <VideoTile
          peerId={localPeer.id}
          trackid={localPeer.videoTrack}
          rootCSS={{
            size: "100%",
            padding: 0,
          }}
          width={width}
          height={height}
        />
      </Box>
    </Draggable>
  );
};
