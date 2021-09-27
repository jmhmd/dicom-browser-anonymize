<template>
  <div class="flex">
    <div class="w-1/3">
      <h1>In browser DICOM anonymization</h1>
      <section>
        <h3>Input DICOM files</h3>
        <input type="file" ref="fileSelectInput" id="input-files" multiple />
        <input
          type="text"
          ref="fileUrlInput"
          id="test-file"
          value="/dicom/CT1_J2KR"
          class="
            mt-1
            block
            w-full
            rounded-md
            border-gray-300
            shadow-sm
            focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
          "
        />
      </section>
      <!-- <section>
        <h3>Links:</h3>
        <div>
          <a href="#" id="download-file">Download file</a>
        </div>
      </section> -->
      <section id="log"></section>
    </div>
    <div class="flex-grow">
      <section>
        <SeriesViewer :series="series"></SeriesViewer>
      </section>
    </div>
  </div>
  <div ref="memoryDiv" style="position: absolute; left: 5px; bottom: 5px; background-color: white">
    Loading memory...
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import loadImages from '../src';
import SeriesViewer from '../src/redact/series-viewer.vue';
import monitorMemory from '../src/monitorMemory';
import Series from '../src/Series';

const fileUrlInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const series = ref<Series>({ instances: [] });

onMounted(() => {
  const fileUrl = fileUrlInput.value.value;
  loadImages({ urls: [fileUrl] }, series);
  monitorMemory(memoryDiv.value);
});
</script>
