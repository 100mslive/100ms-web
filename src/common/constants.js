import { parsedUserAgent } from "@100mslive/react-sdk";

export const defaultAudioList = [
  {
    name: "Audio1",
    id: "audio1",
    metadata: {
      description: "Artist1",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio1.mp3",
    type: "audio",
  },
  {
    name: "Audio2",
    id: "audio2",
    metadata: {
      description: "Artist2",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio2.mp3",
    type: "audio",
  },
  {
    name: "Audio3",
    id: "audio3",
    metadata: {
      description: "Artist3",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio3.mp3",
    type: "audio",
  },
  {
    name: "Audio4",
    id: "audio4",
    metadata: {
      description: "Artist4",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio4.mp3",
    type: "audio",
  },
  {
    name: "Audio5",
    id: "audio5",
    metadata: {
      description: "Artist5",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio5.mp3",
    type: "audio",
  },
  {
    name: "Audio6",
    id: "audio6",
    metadata: {
      description: "Artist6",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/audio6.mp3",
    type: "audio",
  },
];

export const defaultVideoList = [
  {
    name: "Video1",
    id: "video1",
    metadata: {
      description: "Artist1",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/video1.mp4",
    type: "video",
  },
  {
    name: "Video2",
    id: "video2",
    metadata: {
      description: "Artist2",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/video2.mp4",
    type: "video",
  },
  {
    name: "Video3",
    id: "video3",
    metadata: {
      description: "Artist2",
    },
    url: "https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/webapp/playlist/video3.mp4",
    type: "video",
  },
];

export const emojiIdMapping = [
  { emojiId: "+1", emoji: "👍" },
  { emojiId: "-1", emoji: "👎" },
  { emojiId: "wave", emoji: "👋" },
  { emojiId: "clap", emoji: "👏" },
  { emojiId: "fire", emoji: "🔥" },
  { emojiId: "tada", emoji: "🎉" },
  { emojiId: "heart_eyes", emoji: "😍" },
  { emojiId: "joy", emoji: "😂" },
  { emojiId: "open_mouth", emoji: "😮" },
  { emojiId: "sob", emoji: "😭" },
];

export const DEFAULT_HLS_ROLE_KEY = "HLS_VIEWER_ROLE";
export const DEFAULT_HLS_VIEWER_ROLE = "hls-viewer";
export const DEFAULT_WAITING_VIEWER_ROLE = "waiting-room";
export const QUERY_PARAM_SKIP_PREVIEW = "skip_preview";
export const QUERY_PARAM_SKIP_PREVIEW_HEADFUL = "skip_preview_headful";
export const QUERY_PARAM_NAME = "name";
export const QUERY_PARAM_VIEW_MODE = "ui_mode";
export const QUERY_PARAM_AUTH_TOKEN = "auth_token";
export const QUERY_PARAM_PREVIEW_AS_ROLE = "preview_as_role";
export const UI_MODE_ACTIVE_SPEAKER = "activespeaker";
export const UI_MODE_GRID = "grid";
export const MAX_TOASTS = 5;
export const RTMP_RECORD_RESOLUTION_MIN = 480;
export const RTMP_RECORD_RESOLUTION_MAX = 1280;
export const RTMP_RECORD_DEFAULT_RESOLUTION = {
  width: 1280,
  height: 720,
};

export const CHAT_SELECTOR = {
  PEER_ID: "peer_id",
  ROLE: "role",
};

export const APP_DATA = {
  uiSettings: "uiSettings",
  chatOpen: "chatOpen",
  chatSelector: "chatSelector",
  chatDraft: "chatDraft",
  appConfig: "appConfig",
  recordingUrl: "recordingUrl",
  sidePane: "sidePane",
  hlsStats: "hlsStats",
  hlsViewerRole: "hlsViewerRole",
  waitingViewerRole: "waitingViewerRole",
  subscribedNotifications: "subscribedNotifications",
  logo: "logo",
  tokenEndpoint: "tokenEndpoint",
  appLayout: "appLayout",
  hlsStarted: "hlsStarted",
  rtmpStarted: "rtmpStarted",
  recordingStarted: "recordingStarted",
  embedConfig: "embedConfig",
  pinnedTrackId: "pinnedTrackId",
};
export const UI_SETTINGS = {
  isAudioOnly: "isAudioOnly",
  isHeadless: "isHeadless",
  maxTileCount: "maxTileCount",
  uiViewMode: "uiViewMode",
  showStatsOnTiles: "showStatsOnTiles",
  enableAmbientMusic: "enableAmbientMusic",
  mirrorLocalVideo: "mirrorLocalVideo",
};

export const SIDE_PANE_OPTIONS = {
  PARTICIPANTS: "Participants",
  CHAT: "Chat",
  STREAMING: "STREAMING",
  TILES: "TILES",
  SCREEN_TILES: "SCREEN_TILES",
};

export const SUBSCRIBED_NOTIFICATIONS = {
  PEER_JOINED: "PEER_JOINED",
  PEER_LEFT: "PEER_LEFT",
  METADATA_UPDATED: "METADATA_UPDATED",
  NEW_MESSAGE: "NEW_MESSAGE",
  ERROR: "ERROR",
};

export const CREATE_ROOM_DOC_URL =
  "https://github.com/100mslive/100ms-web/wiki/Creating-and-joining-a-room";
export const HLS_TIMED_METADATA_DOC_URL =
  "https://www.100ms.live/docs/javascript/v2/how--to-guides/record-and-live-stream/hls/hls-timed-metadata";

export const REMOTE_STOP_SCREENSHARE_TYPE = "REMOTE_STOP_SCREENSHARE";

export const isIOS = parsedUserAgent.getOS()?.name?.toLowerCase() === "ios";
export const isMacOS =
  parsedUserAgent.getOS()?.name?.toLowerCase() === "mac os";
export const isAndroid =
  parsedUserAgent.getOS()?.name?.toLowerCase() === "android";
