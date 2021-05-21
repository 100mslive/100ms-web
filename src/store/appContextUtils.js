import LogRocket from "logrocket";

export const convertLoginInfoToJoinConfig = (loginInfo) => {
    const joinConfig = {
        userName: loginInfo.username,
        authToken: loginInfo.token,
        metaData: loginInfo.role,
        initEndpoint: loginInfo.endpoint,
        settings: {
            isAudioMuted: loginInfo.audioMuted,
            isVideoMuted: loginInfo.videoMuted,
            audioInputDeviceId: loginInfo.selectedAudioInput,
            audioOutputDeviceId: loginInfo.selectedAudioOutput,
            videoDeviceId: loginInfo.selectedVideoInput,
        },
    };
    console.debug("app: Config is", joinConfig);
    return joinConfig;
}

export const setUpLogRocket = (loginInfo, localPeer) => {
    LogRocket.identify(localPeer.peerId, {
        name: loginInfo.username,
        role: loginInfo.role,
        token: loginInfo.token,
        audioTrack: localPeer.audioTrack,
        videoTrack: localPeer.videoTrack,
    });
}