import React, { useEffect, useState, useContext } from "react";
import { VideoList, ChatBox } from "@100mslive/sdk-components";
import { useHMSRoom } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import { isScreenSharing } from "../utlis";

export const TeacherView = () => {
  const { isChatOpen, toggleChat, maxTileCount, aspectRatio } = useContext(AppContext);
  console.log("env aspect ratio is", aspectRatio);
  const { peers, messages, sendMessage } = useHMSRoom();
  const [streamsWithInfo, setStreamsWithInfo] = useState([]);

  useEffect(() => {
    console.debug("app: Old streams info ");
    console.debug("app: Re-rendering video list with new peers ", peers);
    const videoStreamsWithInfo =
      peers && peers.length > 0 && peers[0]
        ? peers
            .filter((peer) => Boolean(peer.videoTrack || peer.audioTrack))
            .map((peer) => {
              console.debug("app: Camera video track", peer.videoTrack);
              console.debug("app: Camera audio track", peer.audioTrack);
              return {
                videoTrack: peer.videoTrack
                  ? peer.videoTrack.nativeTrack
                  : undefined,
                audioTrack: peer.audioTrack
                  ? peer.audioTrack.nativeTrack
                  : undefined,
                peer: {
                  id: peer.videoTrack
                    ? peer.videoTrack.stream.id
                    : peer.audioTrack.stream.id,
                  displayName: peer.name || peer.peerId,
                },
                videoSource: "camera",
                audioLevel: 0,
                isLocal: peer.isLocal
              };
            })
        : [];
    console.debug("app: Computed camera streams info ", videoStreamsWithInfo);

    const screenShareStreamsWithInfo =
      peers && peers.length > 0 && peers[0]
        ? peers
            .filter(
              (peer) =>
                Boolean(peer.auxiliaryTracks) &&
                Boolean(peer.auxiliaryTracks.length > 0) &&
                (Boolean(
                  peer.auxiliaryTracks.find(
                    (track) => track.nativeTrack.kind === "audio"
                  )
                ) ||
                  Boolean(
                    peer.auxiliaryTracks.find(
                      (track) => track.nativeTrack.kind === "video"
                    )
                  ))
            )
            .map((peer) => {
              console.debug(
                "app: Screenshare video track",
                peer.auxiliaryTracks.find(
                  (track) => track.nativeTrack.kind === "video"
                )
              );
              console.debug(
                "app: Screenshare audio track",
                peer.auxiliaryTracks.find(
                  (track) => track.nativeTrack.kind === "audio"
                )
              );
              return {
                videoTrack: peer.auxiliaryTracks.find(
                  (track) => track.nativeTrack.kind === "video"
                )
                  ? peer.auxiliaryTracks.find(
                      (track) => track.nativeTrack.kind === "video"
                    ).nativeTrack
                  : undefined,
                audioTrack: peer.auxiliaryTracks.find(
                  (track) => track.nativeTrack.kind === "audio"
                )
                  ? peer.auxiliaryTracks.find(
                      (track) => track.nativeTrack.kind === "audio"
                    ).nativeTrack
                  : undefined,
                peer: {
                  id: peer.auxiliaryTracks[0].stream.id,
                  displayName: peer.name || peer.peerId,
                },
                videoSource: "camera",
                audioLevel: 0,
                isLocal: peer.isLocal,
              };
            })
        : [];
    console.debug(
      "app: Computed screenshare streams info ",
      screenShareStreamsWithInfo
    );
    setStreamsWithInfo([
      ...videoStreamsWithInfo,
      ...screenShareStreamsWithInfo,
    ]);
  }, [peers]);

  useEffect(() => {
    console.debug("app: Streams with info", streamsWithInfo);
  }, [streamsWithInfo]);

  return (
    <React.Fragment>
      <div className="w-full h-full flex">
        <div className={isChatOpen ? "w-8/10 h-full" : "w-full h-full"}>
          {streamsWithInfo && streamsWithInfo.length > 0 && (
            <VideoList
              streams={streamsWithInfo}
              aspectRatio={aspectRatio}
              classes={{
                root: "",
                videoTileContainer: " p-4 rounded-lg",
                //video: "rounded-3xl",
              }}
              showAudioMuteStatus={true}
              allowRemoteMute={true}
              maxTileCount={maxTileCount}
            />
          )}
        </div>
        {isChatOpen && (
          <div className="flex items-end p-2 w-2/10 h-full">
            <div className="w-full h-5/6">
              <ChatBox
                messages={messages}
                onSend={sendMessage}
                onClose={toggleChat}
              />
            </div>
          </div>
        )}
      </div>

      {/* <VideoList
          streams={streamsWithInfo.filter((peer) => peer.role === "Teacher")}
          classes={{
            videoTileParent: "p-5 rounded-xl",
            video: "rounded-xl",
          }}
          overflow="scroll-x"
          maxTileCount={4}
          showAudioMuteStatus={false}
        /> */}
    </React.Fragment>
  );
};
