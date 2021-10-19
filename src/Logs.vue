<template>
  <div v-if="!props.expanded" class="text-gray-500">{{ latestMessage }}</div>
  <div v-else>
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
import { ref } from 'vue';
import { logs, latestMessage } from './logger';

const props = defineProps<{ expanded: boolean }>();

const showSublogIndex = ref<null | number>(null);
</script>
