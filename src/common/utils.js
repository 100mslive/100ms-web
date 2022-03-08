export function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor((R * (100 + percent)) / 100);
  G = Math.floor((G * (100 + percent)) / 100);
  B = Math.floor((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export function getRandomVirtualBackground() {
  let backgroundList = [
    "blur",
    "https://www.100ms.live/images/vb-1.jpeg",
    "https://www.100ms.live/images/vb-2.jpg",
    "https://www.100ms.live/images/vb-3.png",
  ];

  if (process.env["REACT_APP_VIDEO_VB"]) {
    let gifList = ["https://www.100ms.live/images/vb-1.gif"];
    backgroundList.push(...gifList);

    let videoList = [
      "https://www.100ms.live/images/video-1.mp4",
      "https://www.100ms.live/images/video-2.mp4",
      "https://www.100ms.live/images/video-5.mp4",
      "https://www.100ms.live/images/video-7.mp4",
      "https://www.100ms.live/images/video-8.mp4",
    ];
    backgroundList.push(...videoList);
  }

  let randomIdx = Math.floor(Math.random() * backgroundList.length);
  if (randomIdx === 0) {
    return "blur";
  } else if (randomIdx <= 3) {
    const img = document.createElement("img");
    img.alt = "VB";
    img.src = backgroundList[randomIdx];
    return img;
  } else if (randomIdx === 4) {
    return backgroundList[randomIdx];
  } else {
    const videoEl = document.createElement("video");
    videoEl.src = backgroundList[randomIdx];
    return videoEl;
  }
}

/**
 * TODO: this is currently an O(N**2) function, don't use with peer lists, it's currently
 * being used to find intersection between list of role names where the complexity shouldn't matter much.
 */
export const arrayIntersection = (a, b) => {
  if (a === undefined || b === undefined) {
    return [];
  }
  var t;
  if (a === undefined || b === undefined) {
    return [];
  }
  if (b.length > a.length) {
    t = b;
    b = a;
    a = t;
  }
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
};

export const getMetadata = metadataString => {
  try {
    return metadataString === "" ? {} : JSON.parse(metadataString);
  } catch (error) {
    return {};
  }
};

export const metadataProps = function (peer, track) {
  return {
    isHandRaised: getMetadata(peer.metadata)?.isHandRaised,
  };
};

export const chatStyle = {
  position: "fixed",
  bottom: "4.5rem",
  zIndex: 40,
  right: 8,
  width: "100%",
  maxWidth: 300,
  minHeight: 440,
};

export const isScreenshareSupported = () => {
  return typeof navigator.mediaDevices.getDisplayMedia !== "undefined";
};
