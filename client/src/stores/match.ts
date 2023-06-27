import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { socket } from '@/socketIO';
import { useUserStore } from './user';
import { useRoute } from 'vue-router';
import type { MatchStatus } from '@/types/match';

export type UserData = {
  _id: string;
  socketId: string;
  name: string;
  completeTime?: string;
  rank?: number;
};

type MatchData = {
  _id: string;
  roomId: string;
  status: 'P' | 'S' | 'C';
  matchWords: string[];
  startTime: string;
  users: UserData[];
};

export const useMatchStore = defineStore('match', () => {
  const route = useRoute();
  const userStore = useUserStore();
  const joined = ref<boolean>(false);
  const matchStatus = ref<MatchStatus>('pending');
  const startTime = ref<string>('');
  const players = ref<UserData[]>([]);
  const countdown = ref<number>(0);
  const matchWords = ref<string[]>([]);
  const matchString = computed(() => {
    return matchWords.value.join(' ');
  });

  socket.on('connect', () => {
    socket.on('room:joined', handleMatchData);
    socket.on('match:update', handleMatchData);
    socket.on('match:prepare', handleMatchPrepare);
    socket.on('match:to-start', handleMatchToStart);
    socket.on('match:start', handleMatchStart);
    socket.on('match:restart', handleMatchRestart);
    socket.on('match:created', handleMatchCreated);
  });

  socket.on('disconnect', () => {
    $reset();
    socket.off('room:joined', handleMatchData);
    socket.off('match:update', handleMatchData);
    socket.off('match:prepare', handleMatchPrepare);
    socket.off('match:to-start', handleMatchToStart);
    socket.off('match:start', handleMatchStart);
    socket.off('match:created', handleMatchCreated);
  });

  const $reset = () => {
    joined.value = false;
    matchStatus.value = 'pending';
    players.value = [];
    countdown.value = 0;
    matchWords.value = [];
    startTime.value = '';
  };

  const handleMatchData = (data?: MatchData) => {
    if (data) {
      const ranks = data.users.sort((a, b) => {
        if (a.completeTime && b.completeTime) {
          return a.completeTime > b.completeTime ? 1 : -1;
        }
        if (a.completeTime && !b.completeTime) {
          return -1;
        }
        if (!a.completeTime && b.completeTime) {
          return 1;
        }
        return 0;
      });
      players.value = data.users.map((user) => {
        const rank = ranks.findIndex((rank) => rank._id === user._id) + 1;
        return {
          ...user,
          rank
        };
      });
      joined.value = data.users.findIndex((user) => user.socketId === socket.id) > -1;
      if (
        data.status === 'P' &&
        matchStatus.value !== 'prepare' &&
        matchStatus.value !== 'to-start'
      ) {
        matchStatus.value = 'pending';
      }
      if (data.status === 'S') {
        matchStatus.value = 'started';
      }
      if (data.status === 'C') {
        matchStatus.value = 'completed';
      }
      if (data.matchWords) {
        matchWords.value = data.matchWords;
      }
      if (data.startTime) {
        startTime.value = data.startTime;
      }
    }
  };

  const handleMatchPrepare = (data: { words: string[] }) => {
    const { words } = data;
    matchWords.value = words;
    matchStatus.value = 'prepare';
  };

  const handleMatchToStart = (data: { toStart: number }) => {
    const { toStart } = data;
    matchStatus.value = 'to-start';
    countdown.value = toStart;
  };

  const handleMatchStart = async () => {
    matchStatus.value = 'started';
  };

  const handleMatchRestart = async (data: { toRestart: number }) => {
    countdown.value = data.toRestart;
  };

  const handleMatchCreated = async () => {
    matchStatus.value = 'pending';
    socket.emit('room:join', {
      roomId: route.params.id,
      name: userStore.user.name
    });
  };

  return {
    matchStatus,
    countdown,
    matchWords,
    matchString,
    joined,
    players,
    startTime,
    $reset
  };
});
