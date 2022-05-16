// @ts-check
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Room } from "@y-presence/client";

// Create the doc
export const doc = new Y.Doc();

// Create a websocket provider
/** @type {import("y-websocket").WebsocketProvider} */
export let provider;

/** @type {import("@y-presence/client").Room} */
export let room;

/**
 * @param {string} roomID
 */
export const setupProviderAndRoom = roomID => {
  if (!(provider && room)) {
    console.log("Whiteboard initialising WS connection and presence room");
    provider = new WebsocketProvider(
      process.env.REACT_APP_WHITEBOARD_WEBSOCKET_ENDPOINT,
      roomID,
      doc,
      { connect: true }
    );
    room = new Room(provider.awareness);
  }
};

/**
 * @type {import("yjs").Map<import("@tldraw/tldraw").TDShape>}
 */
export const yShapes = doc.getMap("shapes");
/**
 * @type {import("yjs").Map<import("@tldraw/tldraw").TDBinding>}
 */
export const yBindings = doc.getMap("bindings");

// Create an undo manager for the shapes and binding maps
export const undoManager = new Y.UndoManager([yShapes, yBindings]);
