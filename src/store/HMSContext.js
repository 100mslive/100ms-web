import React, { useState, useContext, createContext, useEffect } from 'react';
import HMSSdk from '@100mslive/100ms-web-sdk';

const createListener = (
    incomingListener,
    setPeers,
    setLocalPeer,
    sdk
) => {
    const myListener = {
        onJoin: (room) => {
            console.log("INSIDE MY LISTENER ONJOIN");

            setPeers(sdk.getPeers());
            setLocalPeer(sdk.getLocalPeer());
            incomingListener.onJoin(room);
        },

        onPeerUpdate: (type, peer) => {
            console.log("INSIDE MY LISTENER ONPEERUPDATE");

            setPeers(sdk.getPeers());
            incomingListener.onPeerUpdate(type, peer);
        },

        onRoomUpdate: (type, room) => { 
            console.log("INSIDE MY LISTENER ONROOMUPDATE");
        },

        onTrackUpdate: (type, track, peer) => {
            console.log("INSIDE MY LISTENER ONTRACKUPDATE");

            incomingListener.onTrackUpdate(type, track, peer);
        },

        onError: (exception) => {
            console.log("INSIDE MY LISTENER ONERROR");

            incomingListener.onError(exception);
        },
    };

    return myListener;
};

const sdk = new HMSSdk();

const HMSContext = createContext(null);

export const HMSRoomProvider = props => {

    const [peers, setPeers] = useState(sdk.getPeers());

    const [localPeer, setLocalPeer] = useState(sdk.getLocalPeer());

    const join = (config, listener) => {
        sdk.join(config, createListener(listener, setPeers, setLocalPeer, sdk));
    };

    const leave = () => {
        sdk.leave();
    };

    const toggleMute = (track) => {
        track.setEnabled(!track.enabled);
    };

    window.onunload = () => {
        leave();
    };
    
    return (
        <HMSContext.Provider
            value={{
                peers: peers,
                localPeer: localPeer,
                join: join,
                leave: leave,
                toggleMute: toggleMute,
            }}
        >
            {props.children}
        </HMSContext.Provider>
    );
};

export const useHMSRoom = () => {
    const HMSContextConsumer = useContext(HMSContext);

    if (HMSContextConsumer === null) {
        throw new Error('HMSContext state variables are not set');
    }

    return HMSContextConsumer;
};