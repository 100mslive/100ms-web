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
 * TODO: this is currently an O(N**2) function, don't use with peer lists, it's currently
 * being used to find intersection between list of role names where the complexity shouldn't matter much.
 */
export const arrayIntersection = (a, b) => {
  if (a === undefined || b === undefined) {
    return [];
  }
  // ensure "a" is the bigger array
  if (b.length > a.length) {
    let t = b;
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

export const metadataProps = function (peer) {
  return {
    isHandRaised: getMetadata(peer.metadata)?.isHandRaised,
  };
};

export const mobileChatStyle = {
  position: "fixed",
  bottom: "6rem",
  zIndex: 40,
  right: 8,
  width: "100%",
  maxWidth: 300,
  height: "65vh",
  maxHeight: 440,
};

export const isScreenshareSupported = () => {
  return typeof navigator.mediaDevices.getDisplayMedia !== "undefined";
};
