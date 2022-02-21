// @ts-check
import * as React from "react";
import { useRoom } from "./useRoom";
import { WhiteboardEvents as Events } from "./WhiteboardEvents";

/**
 * Ref: https://github.com/tldraw/tldraw/blob/main/apps/www/hooks/useMultiplayerState.ts
 */
export function useMultiplayerState(roomId) {
  const [app, setApp] = React.useState(null);
  const [isReady, setIsReady] = React.useState(false);
  const room = useRoom();

  /**
   * Stores current state(shapes, bindings, [assets]) of the whiteboard
   */
  const rLiveShapes = React.useRef(new Map());
  const rLiveBindings = React.useRef(new Map());

  const getCurrentState = React.useCallback(() => {
    return {
      shapes: rLiveShapes.current
        ? Object.fromEntries(rLiveShapes.current)
        : {},
      bindings: rLiveBindings.current
        ? Object.fromEntries(rLiveBindings.current)
        : {},
    };
  }, []);

  const sendCurrentState = React.useCallback(() => {
    if (room.amIWhiteboardOwner && isReady) {
      room.broadcastEvent(Events.CURRENT_STATE, getCurrentState());
    }
  }, [room, isReady, getCurrentState]);

  const updateLocalState = React.useCallback(
    ({ shapes, bindings, merge = true }) => {
      if (!(shapes && bindings)) return;

      if (merge) {
        const lShapes = rLiveShapes.current;
        const lBindings = rLiveBindings.current;

        if (!(lShapes && lBindings)) return;
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) {
            lShapes.delete(id);
          } else {
            lShapes.set(shape.id, shape);
          }
        });

        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) {
            lBindings.delete(id);
          } else {
            lBindings.set(binding.id, binding);
          }
        });
      } else {
        rLiveShapes.current = new Map(Object.entries(shapes));
        rLiveBindings.current = new Map(Object.entries(bindings));
      }
    },
    []
  );

  const applyStateToBoard = React.useCallback(
    state => {
      app === null || app === void 0
        ? void 0
        : app.replacePageContent(
            state.shapes,
            state.bindings,
            {} // Object.fromEntries(lAssets.entries())
          );
    },
    [app]
  );

  // Callbacks --------------
  // Put the state into the window, for debugging.
  const onMount = React.useCallback(
    app => {
      app.loadRoom(roomId);
      app.pause(); // Turn off the app's own undo / redo stack
      // window.app = app;
      setApp(app);
    },
    [roomId]
  );

  // Update the live shapes when the app's shapes change.
  const onChangePage = React.useCallback(
    (_app, shapes, bindings, _assets) => {
      updateLocalState({ shapes, bindings });
      room.broadcastEvent(Events.STATE_CHANGE, { shapes, bindings });

      /**
       * Tldraw thinks that the next update passed to replacePageContent after onChangePage is the own update triggered by onChangePage
       * and the replacePageContent doesn't have any effect if it is a valid update from remote.
       *
       * To overcome this replacePageContent locally onChangePage(not costly - returns from first line).
       *
       * Refer: https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/state/TldrawApp.ts#L684
       */
      applyStateToBoard(getCurrentState());
    },
    [room, updateLocalState, applyStateToBoard, getCurrentState]
  );

  // Handle presence updates when the user's pointer / selection changes
  // const onChangePresence = React.useCallback((app, user) => {
  //   updateMyPresence({ id: app.room?.userId, user });
  // }, [][updateMyPresence]);

  // Document Changes --------
  React.useEffect(() => {
    const unsubs = [];
    if (!(app && room)) return;

    // Send the exit event when the tab closes
    function handleExit() {
      if (!(room && (app === null || app === void 0 ? void 0 : app.room)))
        return;
      if (isReady && !room.shouldRequestState) {
        room.storeEvent(Events.CURRENT_STATE, getCurrentState());
      }
    }

    window.addEventListener("beforeunload", handleExit);
    unsubs.push(() => window.removeEventListener("beforeunload", handleExit));

    let stillAlive = true;

    // Setup the document's storage and subscriptions
    async function setupDocument() {
      // Subscribe to changes
      const handleChanges = state => {
        if (!state) {
          return;
        }

        const { shapes, bindings, eventName } = state;
        updateLocalState({
          shapes,
          bindings,
          merge: eventName === Events.STATE_CHANGE,
        });
        applyStateToBoard(getCurrentState());
      };

      if (stillAlive) {
        unsubs.push(room.subscribe(Events.STATE_CHANGE, handleChanges));
        unsubs.push(room.subscribe(Events.CURRENT_STATE, handleChanges));

        // On request state(peer join), send whole current state to update the new peer's whiteboard
        unsubs.push(room.subscribe(Events.REQUEST_STATE, sendCurrentState));

        setIsReady(true);

        if (isReady && room.amIWhiteboardOwner) {
          // On board open, update the document with initial/stored content
          handleChanges(room.getStoredState(Events.CURRENT_STATE));
          // Send current state to other peers in the room currently
          sendCurrentState();
        } else if (room.shouldRequestState) {
          /**
           * Newly joined peers request the owner for current state
           * and update their boards when they receive it
           */
          room.broadcastEvent(Events.REQUEST_STATE);
        }
      }
    }

    setupDocument();

    return () => {
      stillAlive = false;
      handleExit();
      unsubs.forEach(unsub => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, isReady, room]);

  return {
    onMount,
    onChangePage,
  };
}
