import { defineStore } from 'pinia';
import { AuthStore, Session } from '../auth';
import { reactive, readonly } from 'vue';
import { User } from '@models';

export enum SessionKeys {
  PRIVATE_MODE = 'privateMode',
}

export const useUserStore = defineStore('user', () => {
  const state = reactive<{ privateMode: boolean; user: User | null }>({
    privateMode: Session.get<boolean>(SessionKeys.PRIVATE_MODE) ?? false,
    user: null,
  });

  const loadUser = async () => {
    state.user = await AuthStore.currentUser();
  };

  const setPrivateMode = async (enabled: boolean) => {
    state.privateMode = enabled;
    Session.set(SessionKeys.PRIVATE_MODE, enabled);
  };

  const togglePrivateMode = async () => {
    await setPrivateMode(!state.privateMode);
  };

  const setDefaultCurrency = async (currency: string) => {
    state.user.defaultCurrency = currency;
    state.user.save();
  };

  const setLocale = async (locale: string) => {
    state.user.locale = locale;
    state.user.save();
  };

  return {
    state: readonly(state),
    togglePrivateMode,
    setPrivateMode,
    setDefaultCurrency,
    setLocale,
    loadUser,
  };
});
