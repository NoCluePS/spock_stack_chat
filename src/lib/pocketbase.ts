import PocketBase from 'pocketbase'

import { writable } from 'svelte/store'

export const pb = new PocketBase('http://172.104.227.170:80')

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
  console.log('authStore changes', auth)
  currentUser.set(pb.authStore.model);
})

export const logout = async () => {
  pb.authStore.clear()
}

export const login = async (username: string, password: string) => {
  await pb.collection("users").authWithPassword(username, password);
};
