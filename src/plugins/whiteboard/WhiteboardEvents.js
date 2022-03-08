export const WhiteboardEvents = {
  // To broadcast new changes made in whiteboard
  STATE_CHANGE: "state-change",
  // To broadcast the current whole state of the board by the owner
  CURRENT_STATE: "current-state",
  // For newly joined peers to request current state from owner
  REQUEST_STATE: "request-state",
};
