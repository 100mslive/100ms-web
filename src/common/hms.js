import { HMSReactiveStore } from '@100mslive/hms-video-store';

const hms = new HMSReactiveStore();

// by default subscriber is notified about store changes post subscription only, this can be
// changed to call it right after subscribing too using this function.
hms.triggerOnSubscribe(); // optional, recommended

const hmsActions = hms.getHMSActions();
const hmsStore = hms.getStore();
const hmsNotifications = hms.getNotifications();

export { hmsActions, hmsStore, hmsNotifications };