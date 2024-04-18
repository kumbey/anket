import { atom } from "recoil";

export const isLoggedIn = atom<boolean>({
    key: 'isLoggedIn',
    default: false
  });