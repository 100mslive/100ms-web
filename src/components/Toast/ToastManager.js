export const ToastManager = {
  toasts: new Map(),
  listeners: new Map(),
  addToast(toast) {
    const id = Date.now();
    this.toasts.set(id, { id, ...toast });
    this.onChange();
    return id;
  },

  clearAllToast() {
    this.toasts.clear();
    this.onChange();
  },

  removeToast(id) {
    this.toasts.delete(id);
    this.onChange();
  },
  replaceToast(id, toast) {
    if (this.isActive(id)) {
      this.toasts.set(id, { ...this.toasts.get(id), ...toast });
      this.onChange();
      return id;
    } else {
      return this.addToast(toast);
    }
  },
  addListener(cb) {
    this.listeners.set(cb, cb);
  },
  removeListener(cb) {
    this.listeners.delete(cb);
  },
  isActive(id) {
    return this.toasts.has(id);
  },
  onChange() {
    const toasts = Array.from(this.toasts.values());
    this.listeners.forEach(listener => listener(toasts));
  },
};
