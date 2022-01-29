<template>
  <div
    class="fixed z-20 top-5 bottom-4 right-5 w-96 max-w-full flex flex-col gap-3 select-none pointer-events-none"
  >
    <div
      v-for="notification in notificationStore.notifications"
      class="relative bg-white p-4 rounded-lg shadow-2xl pointer-events-auto"
    >
      <XIcon
        v-if="notification?.options?.closable ?? true"
        class="absolute p-1 -top-2 -right-2 h-6 cursor-pointer bg-white text-gray-400 rounded-full shadow-md"
        @click="remove(notification.id)"
      />
      <div class="flex gap-2">
        <div>
          <ExclamationIcon
            v-if="notification.type === NotificationType.ERROR"
            class="text-red-500 h-6 flex-none"
          />
          <ExclamationCircleIcon
            v-else-if="notification.type === NotificationType.WARNING"
            class="text-orange-500 h-6 flex-none"
          />
          <CheckCircleIcon
            v-else-if="notification.type === NotificationType.SUCCESS"
            class="text-green-500 h-6 flex-none"
          />
          <ClockIcon
            v-else-if="notification.type === NotificationType.PROGRESS"
            class="text-green-500 h-6 flex-none"
          />
          <InformationCircleIcon v-else class="text-blue-500 h-6 flex-none" />
        </div>
        <p class="select-none">
          {{ notification.message }}
        </p>
      </div>
      <div v-if="notification?.options?.progress >= 0" class="mt-4">
        <GProgress :percent="notification?.options?.progress" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store';
import { NotificationType } from '@store/NotificationStore';
import {
  ExclamationCircleIcon,
  ExclamationIcon,
  XIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/vue/outline';
import GProgress from '@components/base/GProgress.vue';

const notificationStore = useNotificationStore();

const remove = (id: string) => {
  notificationStore.remove(id);
};
</script>
