<template>
  <div>
    <div class="text-gray-500 mt-5">{{ studies.length }} Studies:</div>
    <ol class="list-inside list-decimal">
      <li v-for="(study, studyIndex) in props.studies">
        {{ study.studyDescription || `Study ${studyIndex + 1}` }}
        <!-- <span class="text-gray-500 ml-5">({{ study.series.length }} series)</span> -->
        <ol class="list-inside list-decimal ml-5">
          <li v-for="(series, seriesIndex) in study.series" class="relative">
            <div
              class="inline-block absolute z-0"
              :class="{
                selected: series.seriesInstanceUID === selectedSeries?.seriesInstanceUID,
              }"
            >
              <div
                :class="{ 'fully-anonymized': seriesFullyAnonymized(series) }"
                class="absolute top-0 h-full series-progress"
                :style="progressWidth(series)"
              ></div>
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
              <span class="text-red-500 ml-5" v-if="anonymizationErrors(series) > 0">
                ({{ anonymizationErrors(series) }} anonymization errors. See logs for more
                information.)
              </span>
              <span v-if="seriesFullyAnonymized(series)"> ✓ </span>
            </div>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import Series from './Series';
import Study from './Study';

const emits = defineEmits(['select-series']);

const props = defineProps<{
  studies: Study[];
  selectable?: boolean;
  selectedSeries: Series | null;
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
function anonymizationErrors(series: Series) {
  const seriesErrorCount = series.instances.reduce((errCount, instance) => {
    if (instance.anonymizationError) {
      return (errCount += 1);
    }
    return errCount;
  }, 0);
  return seriesErrorCount;
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
  content: '➤';
  margin-right: 3px;
  position: absolute;
  left: -35px;
}
</style>
