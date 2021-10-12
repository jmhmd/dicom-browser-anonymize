<template>
  <div>
    <div class="w-full px-5">
      <h1 class="text-xl font-bold">In browser DICOM anonymization</h1>

      <div class="flex">
        <a
          href="#"
          @click.prevent="tab = 'process-files'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'process-files' }"
        >
          <span>Process files</span>
        </a>
        <a
          href="#"
          @click.prevent="tab = 'anonymization-script'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'anonymization-script' }"
        >
          <span>Anonymization Script</span>
        </a>
        <a
          href="#"
          @click.prevent="tab = 'log'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'log' }"
        >
          <span>Log</span>
        </a>
      </div>
      <div v-if="tab === 'process-files'" class="flex">
        <div class="w-1/2 pr-5">
          <section>
            <h3 class="section-head">1. Load DICOM files</h3>
            <div class="section-content">
              <p class="mb-2">Select files from your computer:</p>
              <input
                type="file"
                ref="fileSelectInput"
                id="input-files"
                class="mb-5"
                multiple
                directory
                webkitdirectory
              />
              <p>Import a file by url:</p>
              <input
                type="text"
                ref="fileUrlInput"
                id="test-file"
                placeholder="/dicom/CT1_J2KR"
                value="/dicom/CTImage.dcm_JPEGLSLossyTransferSyntax_1.2.840.10008.1.2.4.81.dcm"
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
              <div class="btn my-5" @click="loadFiles">Load file(s)</div>
              <div>{{ loadStatus }}</div>
            </div>
          </section>
          <section>
            <h3 class="section-head">2. Anonymize files</h3>
            <div class="section-content">
              <p>
                <a href="#" @click.prevent="tab = 'anonymization-script'"
                  >Show default anonymization script</a
                >
              </p>
              <div class="btn" @click.prevent="anonymizeInstances">Anonymize all files</div>

              <div v-if="anonymizedInstances.length" class="mt-10">
                <h3 class="font-bold">Anonymized files:</h3>
                <div v-for="instance in anonymizedInstances">
                  imageId: {{ instance.imageId }},
                  <a
                    href="#"
                    @click.prevent="
                      showLogsForImageId =
                        showLogsForImageId === instance.imageId ? null : instance.imageId
                    "
                    >Logs: {{ instance.anonymizationLogs.length }}</a
                  >
                  <div
                    v-if="showLogsForImageId === instance.imageId"
                    class="bg-gray-100 p-2 border text-xs"
                  >
                    <div v-for="log in instance.anonymizationLogs">
                      <span class="font-bold">{{ log.level }}:</span> {{ log.message }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 class="section-head">3. Export files:</h3>
            <div class="section-content">
              <div class="btn" @click.prevent="downloadAll">Download all</div>
            </div>
          </section>
        </div>
        <div class="w-1/2">
          <SeriesViewer
            v-if="selectedSeries"
            :series="selectedSeries"
            redact-enabled
            @update-redaction-boxes="updateRedaction"
            :key="viewerKey"
          ></SeriesViewer>
          <StudyList
            :studies="studies"
            selectable
            @select-series="(series: Series) => {selectedSeries = series; viewerKey++;}"
          ></StudyList>
        </div>
      </div>
      <div v-if="tab === 'anonymization-script'" id="anonymization-script">
        <div class="w-1/2 mx-auto mt-10">
          <p class="text-sm">
            This anonymizer supports a subset of the operations implemented by the RSNA CTP
            anonymizer. The script format has been converted to JSON, however follows the same basic
            structure. See the
            <a href="https://mircwiki.rsna.org/index.php?title=The_CTP_DICOM_Anonymizer"
              >CTP anonymizer</a
            >
            reference for more information.
          </p>
          <pre class="text-xs bg-gray-100 p-2 border">{{
            JSON.stringify(defaultScript, null, 4)
          }}</pre>
        </div>
      </div>
      <div v-if="tab === 'log'" id="log">
        <div v-for="log in logs">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
  <div ref="memoryDiv" style="position: fixed; right: 5px; bottom: 5px; background-color: white">
    Loading memory...
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import loadImages from '../src/loadImages';
import SeriesViewer from '../src/redact/series-viewer.vue';
import monitorMemory from '../src/monitorMemory';
import Study from '../src/Study';
import ImageFrame from '../src/ImageFrame';
import defaultScript from '../src/anonymize/scripts/header-script.default';
import anonymizeInstance from '../src/anonymizeInstance';
import type Series from '../src/Series';
import type Instance from '../src/Instance';
import StudyList from '../src/StudyList.vue';
import { logs } from '../src/logToDiv';
import aTick from '../src/aTick';
import JsZip from 'jszip';
import FileSaver from 'file-saver';
import writeInstanceToBuffer from '../src/writeInstanceToBuffer.js';

const fileUrlInput = ref<HTMLInputElement>(null);
const fileSelectInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const studies = ref<Study[]>([]);
const viewerKey = ref(0);
const tab = ref('process-files');
const showAnonScript = ref(false);
const selectedSeries = ref<Series>(null);
const showLogsForImageId = ref(null);
const loadStatus = ref(null);

onMounted(() => {
  // const fileUrl = fileUrlInput.value.value;
  // loadImages({ urls: [fileUrl] }, studies);
  monitorMemory(memoryDiv.value);
});

function loadFiles() {
  const fileUrl = fileUrlInput.value.value || undefined;
  const urls = fileUrl ? [fileUrl] : undefined;
  const fileSelect = fileSelectInput.value.files;
  const files = fileSelect?.length > 0 ? fileSelect : undefined;
  loadImages({ urls, files }, studies, loadStatus);
}

const allInstances = computed(() => {
  let instances: Instance[] = [];
  for (const study of studies.value) {
    for (const series of study.series) {
      instances = instances.concat(series.instances);
    }
  }
  return instances;
});
const anonymizedInstances = computed(() => {
  return allInstances.value.filter((i) => i.image.anonymizedDicomData);
});
async function anonymizeInstances() {
  // Use for...of instead of Promise.all to not attempt to anonymize serially instead of in parallel
  for (const instance of allInstances.value) {
    await aTick();
    anonymizeInstance(instance);
  }
}

function getRectangleImageCoordinates(startHandle, endHandle) {
  return {
    left: Math.round(Math.min(startHandle.x, endHandle.x)),
    top: Math.round(Math.min(startHandle.y, endHandle.y)),
    width: Math.round(Math.abs(startHandle.x - endHandle.x)),
    height: Math.round(Math.abs(startHandle.y - endHandle.y)),
  };
}

function updateRedaction(redactionBoxes: any) {
  if (redactionBoxes) {
    /* eslint-disable no-param-reassign */
    const redactions: {
      left: number;
      top: number;
      width: number;
      height: number;
    }[] = redactionBoxes.map((redactionBox) =>
      getRectangleImageCoordinates(redactionBox.handles.start, redactionBox.handles.end)
    );

    selectedSeries.value.instances.forEach((instance) => {
      const { image } = instance;
      const { rows, columns, pixelData, pixelDataLength } = image.imageFrame as ImageFrame;
      if (rows * columns !== pixelDataLength) {
        throw new Error('Image size unknown, cannot redact');
      }

      // const newPixelData = new Int16Array(pixelDataLength);
      // image.imageFrame.pixelData = newPixelData;

      redactions.forEach((redaction) => {
        if (
          redaction.left < 0 ||
          redaction.left > columns ||
          redaction.top < 0 ||
          redaction.top > rows
        ) {
          console.warn(`Redaction box outside bounds of image: ${JSON.stringify(redaction)}`);
          return;
        }
        const valueToZero = (image.imageFrame.smallestPixelValue as number) || 0;
        const zeroingArray = Array(redaction.width).fill(valueToZero);
        for (let i = 0; i < redaction.height; i++) {
          const startIndex = (redaction.top + i) * columns + redaction.left;
          pixelData.set(zeroingArray, startIndex);
        }
      });
      console.log('redacted', selectedSeries.value.instances[0].image.imageFrame.pixelData);
    });

    // console.log('purge and reload cache');
    // cornerstone.imageCache.purgeCache();
    // series.value.instances.forEach((instance) => {
    //   cornerstone.imageCache
    //   cornerstone.imageCache.putImageLoadObject(instance.imageId, {
    //     promise: Promise.resolve(instance.image),
    //     cancelFn: undefined,
    //   });
    // });

    viewerKey.value++;
  }
}

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

<style scoped>
.tab {
  @apply flex-grow text-center bg-gray-200 border border-gray-500 text-black;
}
.tab-active {
  @apply border-b-0 bg-white;
}
.section-head {
  @apply text-lg font-bold text-gray-600 my-5;
}
.section-content {
  @apply pl-5 text-gray-900;
}
</style>
