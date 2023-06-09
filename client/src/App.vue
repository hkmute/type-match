<script setup lang="ts">
import { RouterView } from 'vue-router'
import { socket, socketSetup } from './socketIO'

socketSetup(socket)
</script>

<template>
  <RouterView />
</template>
