import { defineStore } from 'pinia';
import { reactive, watchEffect } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  PROGRESS = 'progress',
}

export interface NotificationOptions {
  closable?: false;
  duration?: number;
  progress?: number;
  id?: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  options: NotificationOptions;
}

/**
 * Usage:
 *
 * const { notification, notifications, remove } = useNotificationStore();
 *
 * const progress = ref<string>();
 *
 * const error = () => {
 *   notification.warning(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test'
 *   );
 *   notification.error(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test'
 *   );
 *   notification.success(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test'
 *   );
 *   notification.info(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test'
 *   );
 *   progress.value = notification.progress(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test',
 *     { progress: 25 }
 *   );
 *   notification.progress(
 *     'Transaction could not be saved on the server testTransaction could not be saved on the server test',
 *     { id: 'test', progress: 0 }
 *   );
 * };
 *
 * const increaseWithId = () => {
 *   notifications['test'].options.progress += 5;
 * };
 *
 * const removeWithId = () => {
 *   removeNotification('test');
 * };
 *
 * const increaseWithRef = () => {
 *   notifications[progress.value].options.progress += 25;
 * };
 */
export const useNotificationStore = defineStore('notification', () => {
  const notifications = reactive<Record<string, NotificationItem>>({});

  const remove = (id: string) => delete notifications[id];

  /**
   * Close all progress notifications that have reached 100 percent
   */
  watchEffect(() => {
    const closableItems = Object.values(notifications).filter(
      notification => notification?.options?.progress === 100
    );
    if (closableItems.length > 0) {
      closableItems.forEach(item => remove(item.id));
    }
  });

  const create = (
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): string => {
    const id = options?.id ?? uuidv4();

    notifications[id] = {
      id,
      type,
      message,
      options,
    };

    if (options?.progress === undefined) {
      setTimeout(() => {
        remove(id);
      }, options?.duration ?? 5000);
    }

    return id;
  };

  /**
   * Create an error notification with the given message
   * returns the notification id
   *
   * @param message
   * @param options
   */
  const error = (message: string, options?: NotificationOptions): string =>
    create(NotificationType.ERROR, message, options);

  /**
   * Create a success notification with the given message
   * returns the notification id
   *
   * @param message
   * @param options
   */
  const success = (message: string, options?: NotificationOptions): string =>
    create(NotificationType.SUCCESS, message, options);

  /**
   * Create a warning notification with the given message
   * returns the notification id
   *
   * @param message
   * @param options
   */
  const warning = (message: string, options?: NotificationOptions): string =>
    create(NotificationType.WARNING, message, options);

  /**
   * Create an info notification with the given message
   * returns the notification id
   *
   * @param message
   * @param options
   */
  const info = (message: string, options?: NotificationOptions): string =>
    create(NotificationType.PROGRESS, message, options);

  /**
   * Create a progress notification with the given message
   * returns the notification id
   *
   * @param message
   * @param options
   */
  const progress = (message: string, options?: NotificationOptions): string =>
    create(NotificationType.PROGRESS, message, options);

  return {
    notifications,
    remove,
    notification: {
      error,
      success,
      warning,
      info,
      progress,
    },
  };
});
