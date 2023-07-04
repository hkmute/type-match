<script setup lang="ts">
import { useMatchStore, type UserData } from '@/stores/match';
import MatchLeaveButton from '@/components/Match/MatchLeaveButton.vue';
import { useUserStore } from '@/stores/user';
import { differenceInSeconds, parseISO } from 'date-fns';
import MatchStatusBadge from './MatchStatusBadge.vue';

const userStore = useUserStore();
const matchStore = useMatchStore();

const completeDuration = (player: UserData) => {
  if (!player?.completeTime) {
    return 0;
  }
  return differenceInSeconds(parseISO(player.completeTime), parseISO(matchStore.startTime));
};
</script>

<template>
  <div class="flex flex-col rounded bg-slate-100 p-4">
    <MatchStatusBadge />
    <div class="my-4 flex-1">
      Players:
      <template v-for="player in matchStore.players" :key="player._id">
        <div class="flex justify-between">
          <div>
            {{ player.name }}{{ userStore.user.socketId === player.socketId ? ' (You)' : '' }}
          </div>
          <div v-if="player.completeTime" class="flex gap-2">
            <span>{{ completeDuration(player) }}s</span>
            <span>{{ player?.rank === 1 ? 'Win!' : '' }}</span>
          </div>
        </div>
      </template>
    </div>
    <div>
      <MatchLeaveButton />
    </div>
  </div>
</template>
