<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const leaveRoom = () => {
  router.push({ name: 'Home' })
}
</script>

<template>
  <main>
    <h1>Room {{ $route.params.id }}</h1>
    <button @click="leaveRoom">Leave Room</button>
  </main>
</template>
