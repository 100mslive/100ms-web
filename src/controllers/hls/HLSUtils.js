/**
 *
 * @param {Array[][]} tagList are the fragment tags sent
 * from backend. Their follow the following structure
 * [
 *  [
 *    "INF",
 *    "2"
 *  ],
 *  [
 *    "EXT-PROGRAM-TIME",
 *    "2022-07-01T08:41:46+0000"
 *  ],
 *  [
 *    "EXT-DATE-RANGE",
 *    "somethignsomething;duration='2';payload='Hello'"
 *  ]
 * ]
 * @returns an object with parsed tags. Original
 * tags are available in rawTags property as Key/Value pairs.
 */
export function parseTagsList(tagList) {
  const tagMap = {};
  for (const tags of tagList) {
    if (tagMap[tags[0]]) {
      tagMap[tags[0]].push(removeQuotes(tags[1]));
    } else {
      tagMap[tags[0]] = [removeQuotes(tags[1])];
    }
  }

  const result = {
    rawTags: {
      ...tagMap,
    },
    duration: Number(tagMap["INF"][0]),
    fragmentStartAt: tagMap["PROGRAM-DATE-TIME"]
      ? new Date(tagMap["PROGRAM-DATE-TIME"][0])
      : undefined,
  };
  return result;
}

/**
 *
 * @param {string} metadatastring the raw EXT-X-DATERANGE value
 * @returns an object of parsed data.
 */
export function parseAttributesFromMetadata(metadatastring) {
  const metadataAttributes = metadatastring.split(",");

  const attributesByKey = {};
  for (const attribute of metadataAttributes) {
    const [attribKey, attribValue] = attribute.split("=");
    attributesByKey[attribKey] = removeQuotes(attribValue);
  }

  return {
    duration: attributesByKey["DURATION"],
    id: attributesByKey["ID"],
    startTime: new Date(attributesByKey["START-DATE"]),
    payload: attributesByKey["X-100MSLIVE-PAYLOAD"],
  };
}

/**
 *
 * @param {Date} time
 * @returns total seconds from 00:00:00 to 'time'
 */
export function getSecondsFromTime(time) {
  if (time) {
    return (
      time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds()
    );
  }
}

export function isAlreadyInMetadataMap(fragsTimeStamps, tagMetadata) {
  const alreadyExistingmetadata = fragsTimeStamps.filter(
    fragsTimeStamp => fragsTimeStamp.id === tagMetadata.id
  );

  return !!alreadyExistingmetadata.length;
}

/**
 * Removes qoutes in string.
 * (e.g) removeQoutes('Hello "Ram"!') // returns 'hello Ram!'
 * @param {string} str - string to remove the qoutes from.
 * @returns
 */
function removeQuotes(str) {
  return str.replace(/^"(.*)"$/, "$1");
}
