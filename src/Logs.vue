<template>
  <div v-if="!props.expanded" class="text-gray-500">{{ latestMessage }}</div>
  <div class="w-full" style="height: 5px" v-if="showProgress">
    <div class="h-full bg-blue-600" :style="`width: ${progressPercent}%`"></div>
  </div>
  <div v-if="props.expanded">
    <div v-for="(log, index) in logs">
      <span class="font-bold">{{ log.level }}:</span> {{ log.message }}
      <div v-if="log.sublogs">
        <a href="#" @click.prevent="showSublogIndex = index"
          >{{ log.sublogs.length }} Additional logs</a
        >
        <div v-if="showSublogIndex === index" class="bg-gray-100 p-2 border text-xs">
          <div v-for="log in log.sublogs">
            <span class="font-bold">{{ log.level }}:</span> {{ log.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { logs, latestMessage, progressBar } from './logger';

const props = defineProps<{ expanded: boolean }>();

const progressPercent = computed(() => {
  if (progressBar.value.numTotal === 0) return 0;
  return (progressBar.value.numDone / progressBar.value.numTotal) * 100;
});

const showProgress = computed(() => {
  return progressPercent.value > 0 && progressPercent.value < 100;
});

const showSublogIndex = ref<null | number>(null);
</script>
