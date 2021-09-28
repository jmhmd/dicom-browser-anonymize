<template>
  <div>
    <div class="btn" v-if="props.exportable" @click.prevent="downloadAll">Download all</div>
    <div class="text-gray-500 mt-5">{{ studies.length }} Studies:</div>
    <ol class="list-inside list-decimal">
      <li v-for="(study, studyIndex) in props.studies">
        {{ study.studyDescription || `Study ${studyIndex + 1}` }}
        <!-- <span class="text-gray-500 ml-5">({{ study.series.length }} series)</span> -->
        <ol class="list-inside list-decimal ml-5">
          <li v-for="(series, seriesIndex) in study.series">
            <a v-if="selectable" href="#" @click.prevent="selectSeries(series)">{{
              series.seriesDescription || `Series ${seriesIndex + 1}`
            }}</a>
            <span v-else @click.prevent="selectSeries(series)">{{
              series.seriesDescription || `Series ${seriesIndex + 1}`
            }}</span>
            <span class="text-gray-500 ml-5"
              >({{ series.instances.length }} instance{{
                series.instances.length === 1 ? '' : 's'
              }})</span
            >
          </li>
        </ol>
      </li>
    </ol>
    <div class="text-gray-500 text-sm">
      Anonymized DICOM headers of {{ anonymizedInstances.length }} of
      {{ allInstances.length }} instances.
    </div>
  </div>
</template>

<script setup lang="ts">
import Series from './Series';
import Study from './Study';
import JsZip from 'jszip';
import FileSaver from 'file-saver';
import Instance from './Instance';
import writeInstanceToBuffer from './writeInstanceToBuffer.js';
import { computed } from 'vue';

const emits = defineEmits(['select-series']);

const props = defineProps<{
  studies: Study[];
  selectable?: boolean;
  exportable?: boolean;
}>();

function selectSeries(series: Series) {
  emits('select-series', series);
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

function downloadAll() {
  let instances: Instance[] = [];
  for (const study of props.studies) {
    for (const series of study.series) {
      instances = instances.concat(series.instances);
    }
  }
  const blobs = instances.map((instance) => {
    writeInstanceToBuffer(instance);
    return new Blob([instance.image.dicomP10ArrayBuffer], { type: 'application/dicom' });
  });
  const zip = JsZip();
  blobs.forEach((blob, i) => {
    zip.file(`image-${i}.dcm`, blob);
  });
  zip.generateAsync({ type: 'blob' }).then((zipFile) => {
    const currentDate = new Date().getTime();
    const fileName = `anonymized-images-${currentDate}.zip`;
    return FileSaver.saveAs(zipFile, fileName);
  });
}
</script>
