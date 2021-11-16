import { hmsToast } from "../views/components/notifications/hms-toast";
import screenfull from "screenfull";

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

/**
 * @param {boolean} isParticipantListOpen
 * @param {number} totalPeers
 * @returns {string}
 * This util is to add blur to chatbox when participants are more than 4 below 1024 and
 * more than 7 above 1024 screens
 */
export function getBlurClass(isParticipantListOpen, totalPeers) {
  const OVERLAP_THRESHOLD = window.innerHeight >= 1024 ? 7 : 4;
  return isParticipantListOpen && totalPeers > OVERLAP_THRESHOLD
    ? "filter blur-sm"
    : "";
}

export function getRandomVirtualBackground() {
  let imagesList = [
    "https://www.100ms.live/images/vb-1.jpeg",
    "https://www.100ms.live/images/vb-2.jpg",
    "blur",
  ];

  let randomIdx = Math.floor(Math.random() * imagesList.length);
  if (randomIdx === 2) {
    return "blur";
  }

  const img = document.createElement("img");
  img.alt = "VB";
  img.src = imagesList[randomIdx];
  return img;
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

/**
 * @param {boolean} setFullScreen
 * @return {void}
 * @desc This util function toggles the full screen based on setFullScreen parameter.
 * */
export const setFullScreenEnabled = async setFullScreen => {
  if (setFullScreen) {
    try {
      if (screenfull.isEnabled) {
        await screenfull.request();
      }
    } catch (error) {
      hmsToast(error.message);
    }
  } else {
    try {
      await screenfull.exit();
    } catch (error) {
      hmsToast(error.message);
    }
  }
};

export const getMetadata = metadataString => {
  try {
    return metadataString === "" ? {} : JSON.parse(metadataString);
  } catch (error) {
    return {};
  }
};
