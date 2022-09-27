// @ts-check
import Pusher from "pusher-js";

const stringifyWithNull = obj =>
  JSON.stringify(obj, (k, v) => (v === undefined ? null : v));

/**
 * On whiteboard close, owner sends current state to remote peers.
 * Remote peers tear down too quickly(unsubscribing listeners) and are unable to store the last state.
 *
 * Hack: To overcome this, attach 2 listeners:
 * one for storing the message(won't be unsubscribed),
 * one for calling the actual whiteboard callback(will be unsubscribed on whiteboard close)
 *
 * This way the last state is always received and stored
 */

/**
 * Base class which can be extended to use various realtime communication services.
 * Methods to broadcast and subscribe to events.
 *
 * Stores the last message received/broadcasted to resend when required(when board is ready)
 */

class PusherCommunicationProvider {
  constructor() {
    /** @private */
    this.initialized = false;
    /** @private */
    this.lastMessage = {};
  }

  init = (roomId = "") => {
    if (this.initialized) {
      return;
    }

    /** @private */
    this.pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
      cluster: "ap2",
      authEndpoint: process.env.REACT_APP_PUSHER_AUTHENDPOINT,
    });

    // Pusher.default.logToConsole = true;

    /** @private */
    this.channel = this.pusher.subscribe(`private-${roomId}`);

    /**
     * When events(peer-join) are sent too early before subscribing to a channel,
     * resend last event after subscription has succeeded.
     */
    this.channel.bind("pusher:subscription_succeeded", this.resendLastEvents);

    console.log("Whiteboard initialized communication through Pusher");
    this.initialized = true;
  };

  /**
   * @param {string} eventName
   * @param {any} message
   */
  storeEvent = (eventName, message) => {
    this.lastMessage[eventName] = { eventName, ...message };
  };

  /**
   * @param {string} eventName
   * @returns {any}
   */
  getStoredEvent = eventName => {
    return this.lastMessage[eventName];
  };

  /**
   * @param {string} eventName
   * @param {Object} arg
   */
  broadcastEvent = (eventName, arg = {}) => {
    this.storeEvent(eventName, arg);

    this.channel?.trigger(
      `client-${eventName}`,
      stringifyWithNull({ eventName, ...arg })
    );
  };

  /**
   *
   * @param {string} eventName
   * @param {Function} cb
   */
  subscribe = (eventName, cb) => {
    this.channel?.bind(`client-${eventName}`, message =>
      this.storeEvent(eventName, message)
    );
    this.channel?.bind(`client-${eventName}`, cb);
    return () => {
      this.channel?.unbind(`client-${eventName}`, cb);
    };
  };

  /** @private */
  resendLastEvents = () => {
    for (const eventName in this.lastMessage) {
      if (this.lastMessage[eventName]) {
        this.channel?.trigger(
          `client-${eventName}`,
          this.lastMessage[eventName]
        );
      }
    }
  };
}

/**
 * @type {PusherCommunicationProvider}
 */
export const provider = new PusherCommunicationProvider();
