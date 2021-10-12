<template>
  <div>
    <div class="text-gray-500 mt-5">{{ studies.length }} Studies:</div>
    <ol class="list-inside list-decimal">
      <li v-for="(series, seriesIndex) in allSeries">
        <div class="inline-block relative">
          <span v-if="seriesUnresolvedQuarantinedImages(series).length === 0"> ✔️ </span>
          <a href="#" @click.prevent="selectSeries(series)">{{
            series.seriesDescription || `Series ${seriesIndex + 1}`
          }}</a>
          <span class="text-gray-500 ml-5"
            >({{ series.instances.length }} instance{{ series.instances.length === 1 ? '' : 's' }},
            quarantine reasons: {{ seriesQuarantineReasonList(series) }})</span
          >
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Series from './Series';
import Study from './Study';

const emits = defineEmits(['select-series']);

const props = defineProps<{
  studies: Study[];
}>();

function selectSeries(series: Series) {
  emits('select-series', series);
}

const allSeries = computed(() => {
  let series: Series[] = [];
  for (const study of props.studies) {
    series = series.concat(study.series);
  }
  return series;
});

function seriesUnresolvedQuarantinedImages(series: Series) {
  const quarantinedImages = series.instances.filter(
    (i) => i.quarantine && !i.quarantine.attestNoPHI
  );
  return quarantinedImages;
}

function seriesQuarantineReasonList(series: Series) {
  const reasons = seriesUnresolvedQuarantinedImages(series).map(
    (i) => i.quarantine && i.quarantine.reason
  );

  return [...new Set(reasons)];
}
</script>

<style scoped>
.series-progress {
  z-index: -1;
  @apply bg-yellow-100;
}
.series-progress.fully-anonymized {
  @apply bg-green-100;
}

.selected::before {
  /* @apply border rounded-sm border-gray-500 px-2; */
  content: '▶';
  margin-right: 3px;
}
</style>
