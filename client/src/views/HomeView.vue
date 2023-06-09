<script setup lang="ts">
import { socket } from '@/socketIO'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router';

const roomId = ref('')

const router = useRouter()

const joinRoom = () => {
  router.push({ name: 'Room', params: { id: roomId.value } })
}

onMounted(() => {
  socket.connect()
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <main>
    <input type="text" v-model="roomId" />
    <button @click="joinRoom">Join Room</button>
  </main>
</template>
