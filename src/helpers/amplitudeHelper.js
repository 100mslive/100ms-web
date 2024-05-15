import amplitude from "amplitude-js";
const learner = localStorage.getItem("learner");
console.log("amp", learner);
export const initAmplitude = () => {
  const options = {
    saveEvents: true,
    includeUtm: true,
    includeReferrer: true,
  };
  amplitude.getInstance().init(process.env.AMPLITUDE_KEY, null, options);
  console.log("Amplitude triggered");
  if (learner) {
    console.log("amplitude if block", learner);
    amplitude.getInstance().setUserId(learner);
  }
};

export const p2pquestion_refreshedEvent = (userProperties, eventProperties) => {
  amplitude.getInstance().setUserProperties(userProperties);
  // amplitude.getInstance().logEvent("p2preview_visited", userProperties);
  amplitude.getInstance().logEvent("p2pquestion_refreshed", eventProperties);
  console.log("p2pquestion_refreshed", userProperties);
  console.log("p2pquestion_refreshed", eventProperties);
};

export const p2p_abortedEvent = (userProperties, eventProperties) => {
  amplitude.getInstance().setUserProperties(userProperties);
  // amplitude.getInstance().logEvent("p2preview_visited", userProperties);
  amplitude.getInstance().logEvent("p2p_aborted", eventProperties);
  console.log("p2p_aborted", userProperties);
  console.log("p2p_aborted", eventProperties);
};
