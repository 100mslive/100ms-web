import { PictureInPicture } from "./PIPManager";

describe("pip manager tests", () => {
  /**
   * Ensure that if a track is showing in both before and after, it's at the
   * same position.
   */
  test("merging old and new tracks to show avoids shuffling", () => {
    const makeTestData = (oldArr, newArr, result) => {
      return { oldArr, newArr, result };
    };

    const examples = [
      makeTestData([1, 5, 9, 3], [3, 8, 2, 9], [8, 2, 9, 3]),
      makeTestData([1, 3, 5], [5, 3, 1], [1, 3, 5]),
      makeTestData([2, 7, 9, 4], [9, 2, 4, 6], [2, 6, 9, 4]),
      makeTestData([1, 2, 3], [4, 5, 6], [4, 5, 6]),
      makeTestData([1, 2], [4, 5, 2, 1], [1, 2, 4, 5]),
      makeTestData([4, 1, 2, 3], [1, 3], [3, 1]),
      makeTestData([4, 5, 1, 3], [1, 3], [1, 3]),
      makeTestData([], [1, 3], [1, 3]),
      makeTestData([1, 3], [], []),
      makeTestData([1], [4, 2, 1, 3], [1, 4, 2, 3]),
      makeTestData([4, 2, 1, 3], [1], [1]),
      makeTestData([], [], []),
    ];

    examples.forEach(example => {
      expect(
        PictureInPicture.orderNewTracksToShow(example.newArr, example.oldArr)
      ).toEqual(example.result);
    });
  });

  /**
   * It's very important that detach is properly called for old tracks to guarantee
   * no unnecessary bandwidth consumption.
   * For simplicity's sake currently, detach/attach is done if position of
   * the track changes as well. That is earlier it was showing on third position
   * but not it's on second position(because there are only two tracks left to show).
   */
  test("attach and detach are called properly after tracks in view changes", async () => {
    const makeTestData = (oldTracks, newTracks, detachFor, attachFor) => {
      return { oldTracks, newTracks, detachFor, attachFor };
    };

    let attachCalledFor = [];
    let detachCalledFor = [];
    PictureInPicture.hmsActions = {
      attachVideo: jest.fn(track => attachCalledFor.push(track)),
      detachVideo: jest.fn(track => detachCalledFor.push(track)),
    };

    const examples = [
      makeTestData([1, 2], [3, 4], [1, 2], [3, 4]),
      makeTestData([1, 2], [1, 2], [], []),
      makeTestData([1, 5, 9, 3], [8, 2, 9, 3], [1, 5], [8, 2]),
      makeTestData([1, 5, 9], [6, 5, 9], [1], [6]),
      makeTestData([], [1, 3], [], [1, 3]),
      makeTestData([1, 3], [], [1, 3], []),
      makeTestData([1], [4, 2, 1, 3], [1], [4, 2, 1, 3]),
      makeTestData([4, 2, 1, 3], [1], [4, 2, 1, 3], [1]),
      makeTestData([], [], [], []),
    ];

    for (let example of examples) {
      attachCalledFor = [];
      detachCalledFor = [];
      await PictureInPicture.detachOldAttachNewTracks(
        example.oldTracks,
        example.newTracks
      );
      expect(attachCalledFor).toEqual(example.attachFor);
      expect(detachCalledFor).toEqual(example.detachFor);
    }
  });
});
