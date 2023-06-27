<script setup lang="ts">
import { socket } from '@/socketIO';
import { useMatchStore } from '@/stores/match';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const matchStore = useMatchStore();
const isOwner = computed(() => matchStore.players[0]?.socketId === userStore.user.socketId);

const startMatch = () => {
  socket.emit('match:start', {
    roomId: route.params.id
  });
};
</script>

<template>
  <button
    v-if="isOwner"
    class="rounded bg-sky-200 p-2 font-bold text-sky-800 hover:bg-sky-300"
    @click="startMatch"
  >
    Start Match
  </button>
  <div v-else>Wait for next match</div>
</template>
