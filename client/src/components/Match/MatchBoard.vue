<script setup lang="ts">
import { useMatchStore } from '@/stores/match';
import { useUserStore } from '@/stores/user';
import { ref, watchEffect, type VNodeRef, nextTick, onMounted, onUnmounted, computed } from 'vue';
import MatchStartButton from './MatchStartButton.vue';
import MatchStatus from './MatchStatus.vue';
import { useRoute } from 'vue-router';
import { socket } from '@/socketIO';

const route = useRoute();
const userStore = useUserStore();
const matchStore = useMatchStore();
const input = ref<VNodeRef | null>(null);
const userInput = ref('');
const isFocused = ref(false);
const isCompleted = ref(false);

const showPendingStart = computed(() => {
  return (
    matchStore.matchStatus === 'pending' ||
    !matchStore.players.find((player) => player.socketId === socket.id)
  );
});

onMounted(() => {
  socket.connect();
  socket.on('connect', handleRoomJoin);
});

onUnmounted(() => {
  socket.disconnect();
  socket.off('connect', handleRoomJoin);
});

watchEffect(async () => {
  if (matchStore.matchStatus === 'started') {
    await nextTick();
    input.value?.focus();
  }
});

watchEffect(async () => {
  if (matchStore.matchStatus === 'pending') {
    userInput.value = '';
    isCompleted.value = false;
  }
});

watchEffect(async () => {
  if (
    matchStore.matchStatus === 'started' &&
    userInput.value === matchStore.matchString &&
    !isCompleted.value
  ) {
    isCompleted.value = true;
    socket.emit('match:complete', {
      roomId: route.params.id,
      userInput: userInput.value
    });
  }
});

const handleRoomJoin = () => {
  socket.emit('room:join', {
    roomId: route.params.id,
    name: userStore.user.name
  });
};

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};
</script>

<template>
  <div class="grid h-1/2 w-full max-w-7xl grid-cols-4 gap-4">
    <div class="col-span-3 flex items-center justify-center rounded bg-slate-100 p-2">
      <MatchStartButton v-if="showPendingStart" />
      <div
        :class="[
          'relative my-2 rounded-md bg-slate-300 p-2',
          isFocused ? 'outline-red outline' : ''
        ]"
        v-else
      >
        <label>
          <input
            ref="input"
            class="pointer-events-none absolute left-0 top-0 h-0 w-full select-none bg-transparent text-transparent focus:outline-none"
            type="text"
            v-model="userInput"
            :maxlength="matchStore.matchString.length"
            :disabled="matchStore.matchStatus !== 'started' || isCompleted"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          <div class="pointer-events-none max-w-7xl text-gray-400">
            <span class="caret" v-if="userInput.length === 0 && isFocused" />
            <span
              :key="i"
              v-for="(char, i) in matchStore.matchString"
              :class="[
                'text-xl',
                'select-none',
                i > userInput.length - 1
                  ? 'text-gray-500'
                  : userInput[i] === char
                  ? 'text-black'
                  : 'bg-red-700 text-white',
                i === userInput.length - 1 && isFocused ? 'caret' : ''
              ]"
              >{{ char }}</span
            >
          </div>
        </label>
      </div>
    </div>
    <MatchStatus />
  </div>
</template>
