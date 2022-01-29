import { defineStore } from 'pinia';
import { Session } from '../auth';
import { reactive } from 'vue';

export enum SessionKeys {
  PRIVATE_MODE = 'privateMode',
}

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    privateMode: Session.get<boolean>(SessionKeys.PRIVATE_MODE) ?? false,
  });

  const setPrivateMode = async (enabled: boolean) => {
    state.privateMode = enabled;
    Session.set(SessionKeys.PRIVATE_MODE, enabled);
  };

  const togglePrivateMode = async () => {
    await setPrivateMode(!state.privateMode);
  };

  return {
    state,
    togglePrivateMode,
    setPrivateMode,
  };
});
