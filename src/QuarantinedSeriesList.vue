<template>
  <div>
    <div v-if="allQuarantinedSeries.length === 0">
      Please review all images and attest that no PHI is burned in to the pixel data.
    </div>
    <div v-else>
      <div class="text-gray-500 mt-5">{{ allQuarantinedSeries.length }} quarantined series:</div>
      <ol class="list-outside ml-8 list-decimal">
        <li v-for="(series, seriesIndex) in allQuarantinedSeries" @click="selectSeries(series)">
          <QuarantinedSeries :series="series">
            {{ series.seriesDescription || `Series ${seriesIndex + 1}` }}
          </QuarantinedSeries>
          <div class="btn">Remove Series</div>
          <div class="btn">Redact Images</div>
        </li>
      </ol>
    </div>
  </div>
  <div v-if="!phiAttestation" class="btn" @click="phiAttestation = new Date()">
    Attest no PHI in pixel data
  </div>
  <div v-else class="bg-green-100 text-green-800 p-2 mb-2">
    Attested no PHI present in images: {{ phiAttestation }}
  </div>
  <div v-if="phiAttestation" class="btn" @click="emits('next-step')">Next</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Series from './Series';
import Study from './Study';
import QuarantinedSeries from './QuarantinedSeries.vue';

const emits = defineEmits(['select-series', 'next-step']);

const props = defineProps<{
  studies: Study[];
}>();

const phiAttestation = ref<Date | null>(null);

function selectSeries(series: Series) {
  emits('select-series', series);
}

const allQuarantinedSeries = computed(() => {
  let series: Series[] = [];
  for (const study of props.studies) {
    const quarantined = study.series.filter((s) => {
      return s.instances.filter((i) => i.quarantine && !i.quarantine.attestNoPHI).length > 0;
    });
    series = series.concat(quarantined);
  }
  return series;
});
</script>

<style scoped>
li > * {
  vertical-align: top;
}
</style>
