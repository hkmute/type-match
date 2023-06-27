<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddNameForm from '@/components/AddNameForm.vue';

const router = useRouter();
const userStore = useUserStore();
const matchId = ref('');

const joinMatch = () => {
  router.push({ name: 'Match', params: { id: matchId.value } });
};
</script>

<template>
  <main class="flex h-screen flex-col items-center justify-center bg-slate-200 px-4">
    <h1 class="mb-8 text-4xl">TYPE MATCH</h1>
    <AddNameForm v-if="!userStore.user.name" />
    <template v-if="userStore.user.name">
      <form class="flex flex-col items-center" @submit.prevent="joinMatch">
        <input
          class="rounded-md px-2 py-1"
          type="text"
          v-model.trim="matchId"
          required
          placeholder="Enter match ID"
        />
        <button
          class="my-2 rounded-md bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-300"
          type="submit"
        >
          Join Match
        </button>
      </form>

      <button class="rounded-md bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-300">
        New Match
      </button>
    </template>
  </main>
</template>
