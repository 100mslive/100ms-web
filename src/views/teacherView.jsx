import React from "react";
import {
  Header,
  VideoList,
  VideoTile,
  ControlBar,
} from "@100mslive/sdk-components";
import { useHMSRoom } from '@100mslive/sdk-components';

export const TeacherView = () => {

  const { peers } = useHMSRoom();

  console.log("PEERS ARE ", peers);

  const videoStreamsWithInfo = peers && peers.length>0 && peers[0] && peers
    .filter((peer) => Boolean(peer.videoTrack))
    .map((peer) => {
      return {
        stream: peer.videoTrack.stream.nativeStream,
        peer: {
          id: peer.videoTrack.stream.id,
          displayName: peer.name || peer.peerId,
        },
        videoSource: "camera",
        audioLevel: 0,
        isLocal: peer.isLocal,
      };
    });

  const screenShareStreamsWithInfo = peers && peers.length>0 && peers[0] && peers
    .filter((peer) => Boolean(peer.auxiliaryTracks) && Boolean(peer.auxiliaryTracks.length>0))
    .map((peer) => {
      return {
        stream: peer.auxiliaryTracks[0].stream.nativeStream,
        peer: {
          id: peer.auxiliaryTracks[0].stream.id,
          displayName: peer.name || peer.peerId,
        },
        videoSource: "camera",
        audioLevel: 0,
        isLocal: peer.isLocal,
      }
    });
  
  let streamsWithInfo = [];

  if (videoStreamsWithInfo && videoStreamsWithInfo.length>0)
    streamsWithInfo = [...streamsWithInfo, ...videoStreamsWithInfo];

  if (screenShareStreamsWithInfo && screenShareStreamsWithInfo.length>0)
    streamsWithInfo = [...streamsWithInfo, ...screenShareStreamsWithInfo];

  return (
    <React.Fragment>
      <div className="w-full h-full ">
        {streamsWithInfo && streamsWithInfo.length>0 && <VideoList
          streams={streamsWithInfo}
          classes={{
            root: "",
            videoTileParent: " p-4 rounded-lg",
            //video: "rounded-3xl",
          }}
          showAudioMuteStatus={true}
          allowRemoteMute={true}
        //maxTileCount={9}
        />}
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
