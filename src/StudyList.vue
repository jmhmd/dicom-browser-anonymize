<template>
  <div>
    <div class="text-gray-500 mt-5">{{ studies.length }} Studies:</div>
    <ol class="list-inside list-decimal">
      <li v-for="(study, studyIndex) in props.studies">
        {{ study.studyDescription || `Study ${studyIndex + 1}` }}
        <!-- <span class="text-gray-500 ml-5">({{ study.series.length }} series)</span> -->
        <ol class="list-inside list-decimal ml-5">
          <li v-for="(series, seriesIndex) in study.series">
            <div class="inline-block relative">
              <span v-if="seriesFullyAnonymized(series)"> ✔️ </span>
              <a v-if="selectable" href="#" @click.prevent="selectSeries(series)">{{
                series.seriesDescription || `Series ${seriesIndex + 1}`
              }}</a>
              <span v-else @click.prevent="selectSeries(series)">{{
                series.seriesDescription || `Series ${seriesIndex + 1}`
              }}</span>
              <span class="text-gray-500 ml-5"
                >({{ series.instances.length }} instance{{
                  series.instances.length === 1 ? '' : 's'
                }}, {{ seriesAnonymizedInstances(series).length }} anonymized)</span
              >
              <div
                :class="{ 'fully-anonymized': seriesFullyAnonymized(series) }"
                class="absolute top-0 h-full series-progress"
                :style="progressWidth(series)"
              ></div>
            </div>
          </li>
        </ol>
      </li>
    </ol>
    <div class="text-gray-500 text-sm mt-2">
      Anonymized {{ anonymizedInstances.length }} of {{ allInstances.length }} instance DICOM
      headers.
    </div>
  </div>
</template>

<script setup lang="ts">
import Series from './Series';
import Study from './Study';
import Instance from './Instance';
import { computed } from 'vue';

const emits = defineEmits(['select-series']);

const props = defineProps<{
  studies: Study[];
  selectable?: boolean;
}>();

function selectSeries(series: Series) {
  emits('select-series', series);
}

function seriesAnonymizedInstances(series: Series) {
  return series.instances.filter((i) => i.image.anonymizedDicomData);
}
function progressWidth(series: Series) {
  const totalInstances = series.instances.length;
  const anonymizedInstances = seriesAnonymizedInstances(series).length;
  const percentAnonymized = (anonymizedInstances / totalInstances) * 100;
  return `width: ${percentAnonymized}%`;
}
function seriesFullyAnonymized(series: Series) {
  return seriesAnonymizedInstances(series).length === series.instances.length;
}

const allInstances = computed(() => {
  let instances: Instance[] = [];
  for (const study of props.studies) {
    for (const series of study.series) {
      instances = instances.concat(series.instances);
    }
  }
  return instances;
});
const anonymizedInstances = computed(() => {
  return allInstances.value.filter((i) => i.image.anonymizedDicomData);
});
</script>

<style scoped>
.series-progress {
  z-index: -1;
  @apply bg-yellow-100;
}
.series-progress.fully-anonymized {
  @apply bg-green-100;
}
</style>
