// @ts-check
import { useCallback, useEffect, useState } from "react";
import throttle from "lodash.throttle";
import {
  doc,
  room,
  provider,
  setupProviderAndRoom,
  undoManager,
  yBindings,
  yShapes,
} from "./store";

export function useMultiplayerState(roomId) {
  /**
   * @type {[import('@tldraw/tldraw').TldrawApp, import("react").Dispatch<import('@tldraw/tldraw').TldrawApp>]}
   */
  const [app, setApp] = useState();
  const [loading, setLoading] = useState(true);

  const onMount = useCallback(
    app => {
      app.loadRoom(roomId);
      app.pause();
      setApp(app);
      setupProviderAndRoom(roomId);
    },
    [roomId]
  );

  const onChangePage = useCallback((app, shapes, bindings) => {
    undoManager.stopCapturing();
    doc.transact(() => {
      Object.entries(shapes).forEach(([id, shape]) => {
        if (!shape) {
          yShapes.delete(id);
        } else {
          yShapes.set(shape.id, shape);
        }
      });
      Object.entries(bindings).forEach(([id, binding]) => {
        if (!binding) {
          yBindings.delete(id);
        } else {
          yBindings.set(binding.id, binding);
        }
      });
    });
  }, []);

  const onUndo = useCallback(() => {
    undoManager.undo();
  }, []);

  const onRedo = useCallback(() => {
    undoManager.redo();
  }, []);

  /**
   * Callback to update user's (self) presence
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangePresence = useCallback(
    throttle((app, user) => {
      if (!app.room) return;
      room.setPresence({ id: app.room.userId, tdUser: user });
    }, 150),
    []
  );

  /**
   * Update app users whenever there is a change in the room users
   */
  useEffect(() => {
    if (!app || !room) return;

    const unsubOthers = room.subscribe("others", users => {
      if (!app.room) return;

      const ids = users
        .filter(user => user.presence)
        .map(user => user.presence.tdUser.id);

      // remove any user that is not connected in the room
      Object.values(app.room.users).forEach(user => {
        var _a;
        if (
          user &&
          !ids.includes(user.id) &&
          user.id !==
            ((_a = app.room) === null || _a === void 0 ? void 0 : _a.userId)
        ) {
          app.removeUser(user.id);
        }
      });

      app.updateUsers(
        users
          .filter(user => user.presence)
          .map(other => other.presence.tdUser)
          .filter(Boolean)
      );
    });

    return () => {
      unsubOthers();
    };
  }, [app]);

  useEffect(() => {
    if (!app) return;

    function handleDisconnect() {
      provider.disconnect();
    }

    window.addEventListener("beforeunload", handleDisconnect);

    function handleChanges() {
      app === null || app === void 0
        ? void 0
        : app.replacePageContent(
            Object.fromEntries(yShapes.entries()),
            Object.fromEntries(yBindings.entries()),
            {}
          );
    }

    async function setup() {
      yShapes.observeDeep(handleChanges);
      handleChanges();
      setLoading(false);
    }

    setup();

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      yShapes.unobserveDeep(handleChanges);
    };
  }, [app]);

  return {
    onMount,
    onChangePage,
    onUndo,
    onRedo,
    loading,
    onChangePresence,
  };
}
