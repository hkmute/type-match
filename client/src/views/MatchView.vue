<script setup lang="ts">
import AddNameForm from '@/components/AddNameForm.vue';
import { useUserStore } from '@/stores/user';
import MatchBoard from '@/components/Match/MatchBoard.vue';

const userStore = useUserStore();
</script>

<template>
  <main class="flex h-screen flex-col items-center justify-center bg-slate-200 px-4">
    <h1 class="p-4 text-2xl font-bold">Match {{ $route.params.id }}</h1>
    <AddNameForm v-if="!userStore.user.name" />
    <MatchBoard v-if="userStore.user.name" />
  </main>
</template>

<style scoped>
.caret {
  position: relative;
}

.caret::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: black;
  animation: blink-animation 1s steps(5, start) infinite;
}

@keyframes blink-animation {
  59% {
    background-color: black;
  }
  60% {
    background-color: transparent;
  }
  100% {
    background-color: transparent;
  }
}
</style>
