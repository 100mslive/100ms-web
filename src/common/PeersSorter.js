import { selectDominantSpeaker } from "@100mslive/hms-video-store";

class PeersSorter {
  listeners = new Set();
  storeUnsubscribe;

  constructor(store) {
    this.store = store;
    this.peers = new Map();
    this.lruPeers = new Set();
    this.speaker = undefined;
  }

  setPeersAndTilesPerPage = ({ peers, tilesPerPage }) => {
    this.tilesPerPage = tilesPerPage;
    const peerIds = new Set(peers.map(peer => peer.id));
    // remove existing peers which are no longer provided
    this.peers.forEach((_, key) => {
      if (!peerIds.has(key)) {
        this.peers.delete(key);
      }
    });
    this.lruPeers = new Set(
      [...this.lruPeers].filter(peerId => peerIds.has(peerId))
    );
    peers.forEach(peer => {
      this.peers.set(peer.id, peer);
      if (this.lruPeers.size < tilesPerPage) {
        this.lruPeers.add(peer.id);
      }
    });
    if (!this.storeUnsubscribe) {
      this.storeUnsubscribe = this.store.subscribe(
        this.onDominantSpeakerChange,
        selectDominantSpeaker
      );
    }
    this.moveSpeakerToFront(this.speaker);
  };

  onUpdate = cb => {
    this.listeners.add(cb);
  };

  stop = () => {
    this.updateListeners();
    this.listeners.clear();
    this.storeUnsubscribe?.();
  };

  moveSpeakerToFront = speaker => {
    if (!speaker) {
      this.updateListeners();
      return;
    }
    if (
      this.lruPeers.has(speaker.id) &&
      this.lruPeers.size <= this.tilesPerPage
    ) {
      this.updateListeners();
      return;
    }
    // delete to insert at beginning
    this.lruPeers.delete(speaker.id);
    let lruPeerArray = Array.from(this.lruPeers);
    while (lruPeerArray.length >= this.tilesPerPage) {
      lruPeerArray.pop();
    }
    this.lruPeers = new Set([speaker.id, ...lruPeerArray]);
    this.updateListeners();
  };

  onDominantSpeakerChange = speaker => {
    if (speaker && speaker.id !== this?.speaker?.id) {
      this.speaker = speaker;
      this.moveSpeakerToFront(speaker);
    }
  };

  updateListeners = () => {
    const orderedPeers = [];
    this.lruPeers.forEach(key => {
      const peer = this.peers.get(key);
      if (peer) {
        orderedPeers.push(peer);
      }
    });
    this.peers.forEach(peer => {
      if (!this.lruPeers.has(peer.id) && peer) {
        orderedPeers.push(peer);
      }
    });
    this.listeners.forEach(listener => listener?.(orderedPeers));
  };
}

export default PeersSorter;
