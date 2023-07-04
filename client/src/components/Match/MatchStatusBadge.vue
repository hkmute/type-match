<script setup lang="ts">
import { useMatchStore } from '@/stores/match';
import { computed } from 'vue';

const matchStore = useMatchStore();

const colorClass = computed(() => {
  switch (matchStore.matchStatus) {
    case 'pending':
      return 'bg-gray-300 text-gray-600';
    case 'prepare':
      return 'bg-yellow-700 text-yellow-100';
    case 'to-start':
      return 'bg-yellow-700 text-yellow-100';
    case 'started':
      return 'bg-green-700 text-green-100';
    case 'completed':
      return 'bg-green-700 text-green-100';
    default:
      return 'bg-gray-700 text-gray-100';
  }
});

const statusDisplay = computed(() => {
  switch (matchStore.matchStatus) {
    case 'pending':
      return 'PENDING';
    case 'prepare':
      return 'PREPARE';
    case 'to-start':
      return 'START IN ' + matchStore.countdown;
    case 'started':
      return 'STARTED';
    case 'completed': {
      if (matchStore.countdown >= 0) {
        return 'CREATE NEW MATCH IN ' + matchStore.countdown;
      }
      return 'COMPLETED';
    }
    default:
      return 'UNKNOWN';
  }
});
</script>

<template>
  <div :class="['rounded p-1 text-center font-semibold', colorClass]">
    {{ statusDisplay }}
  </div>
</template>
