<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userStore = useUserStore();
const username = ref('');
const addName = () => {
  userStore.$patch({
    user: {
      name: username.value
    }
  });
};
</script>

<template>
  <form class="flex flex-col items-center" @submit.prevent="addName">
    <input
      class="rounded-md px-2 py-1"
      type="text"
      v-model.trim="username"
      required
      placeholder="Enter name"
    />
    <button
      class="my-2 rounded-md bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-300"
      type="submit"
    >
      Enter Name
    </button>
  </form>
</template>
