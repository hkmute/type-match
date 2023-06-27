<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const leaveMatch = () => {
  router.push({ name: 'Home' });
};
</script>

<template>
  <button
    class="w-full rounded bg-red-100 p-2 font-bold text-red-800 hover:bg-red-200"
    @click="leaveMatch"
  >
    Leave Match
  </button>
</template>
