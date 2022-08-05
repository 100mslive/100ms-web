import { ToastConfig } from "./ToastConfig";
import { ToastManager } from "./ToastManager";

export const ToastBatcher = {
  toastsType: new Map(),
  showToastInternal({ notification, duration, type }) {
    let notificationType = type;
    if (!type) {
      notificationType = notification.type;
    }
    const toastType = this.toastsType.has(notificationType);
    if (toastType) {
      let { notifications } = this.toastsType.get(notificationType);
      const { id } = this.toastsType.get(notificationType);
      notifications.push(notification);
      const toastObject = ToastConfig[notificationType].multiple(notifications);
      const toastId = ToastManager.replaceToast(id, {
        ...toastObject,
        duration: duration,
      });
      this.toastsType.set(notificationType, {
        id: toastId,
        notifications: notifications,
        duration: duration,
      });
    } else {
      const toastObject = ToastConfig[notificationType].single(notification);
      const toastId = ToastManager.addToast({
        ...toastObject,
        duration: duration,
      });
      let notifications = [];
      notifications.push(notification);
      this.toastsType.set(notificationType, {
        id: toastId,
        notifications: [...notifications],
        duration: duration,
      });
    }
  },
  showToast({ notification, duration = 3000, type }) {
    try {
      this.showToastInternal({ notification, duration, type });
    } catch (err) {
      console.debug("Notifications", err);
    }
  },
  syncUItoast(toastsDisplaying) {
    for (const [toastType, toastInfo] of this.toastsType.entries()) {
      if (!toastsDisplaying.find(toast => toast.id === toastInfo.id)) {
        this.toastsType.delete(toastType);
      }
    }
  },
};

ToastManager.addListener(ToastBatcher.syncUItoast.bind(ToastBatcher));
