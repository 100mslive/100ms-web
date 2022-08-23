export function getRandomVirtualBackground() {
  let backgroundList = [
    "blur",
    "https://www.100ms.live/images/vb-1.jpeg",
    "https://www.100ms.live/images/vb-2.jpg",
    "https://www.100ms.live/images/vb-3.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms1.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms2.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms3.png",
    "https://d2qi07yyjujoxr.cloudfront.net/webapp/vb/hms4.png",
  ];

  if (process.env["REACT_APP_VIDEO_VB"]) {
    let gifList = ["https://www.100ms.live/images/vb-1.gif"];
    backgroundList.push(...gifList);

    /* //Not Supporting video backgrounds until web worker issue is resolved
    let videoList = [
      "https://www.100ms.live/images/video-1.mp4",
      "https://www.100ms.live/images/video-2.mp4",
      "https://www.100ms.live/images/video-5.mp4",
      "https://www.100ms.live/images/video-7.mp4",
      "https://www.100ms.live/images/video-8.mp4",
    ];
    backgroundList.push(...videoList);*/
  }

  let randomIdx = Math.floor(Math.random() * backgroundList.length);
  if (randomIdx === 0) {
    return "blur";
  } else if (randomIdx <= 7) {
    const img = document.createElement("img");
    img.alt = "VB";
    img.src = backgroundList[randomIdx];
    return img;
  } else if (randomIdx === 8) {
    return backgroundList[randomIdx];
  }
  /*} else {
    const videoEl = document.createElement("video");
    videoEl.src = backgroundList[randomIdx];
    return videoEl;
  }*/
}
