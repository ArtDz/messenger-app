import type {StateCreator} from 'zustand/vanilla'
import {persist} from 'zustand/middleware'

type State = {
  userInfo: User | null
}

type Actions = {
  setUserInfo: (userInfo: User | null) => void
}

export type AuthSlice = State & Actions

export const createAuthSlice: StateCreator<
  AuthSlice,
  [['zustand/persist', unknown]],
  [['zustand/persist', {
    userInfo: User | null;
  }]],
  AuthSlice
> = persist(
  (set) => ({
    userInfo: null,
    setUserInfo: (userInfo) => set({ userInfo }),
  }),
  {
    name: 'auth-storage',
    partialize: state => ({userInfo: state.userInfo})
  }
);
