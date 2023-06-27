import { ref } from 'vue';
import { defineStore } from 'pinia';
import { socket } from '@/socketIO';

type User = {
  name: string;
  socketId: string;
};

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({ name: '', socketId: '' });

  socket.on('connect', () => {
    user.value = { ...user.value, socketId: socket.id };
  });

  return { user };
});
