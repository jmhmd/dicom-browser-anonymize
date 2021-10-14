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
            <div class="section-overlay" v-if="step !== 'load'"></div>
            <h3 class="section-head">1. Load DICOM files</h3>
            <div class="section-content">
              <!-- <p class="mb-2">Select files from your computer:</p> -->
              <div
                ref="dropzone"
                id="dropzone"
                class="
                  h-24
                  w-full
                  bg-gray-200
                  border border-dashed border-gray-400
                  flex
                  justify-center
                  items-center
                "
                :class="{ dragover: dropzoneDragOver }"
              >
                <div class="inline-block">
                  Drop files here or click to select...
                  <div v-if="fileList.length > 0">
                    {{ fileList.length }} files selected.
                    <a href="#" @click.prevent.stop="fileList = []">Clear all</a>
                  </div>
                </div>
              </div>
              <!-- <input type="file" ref="fileSelectInput" id="input-files" class="mb-5" multiple /> -->
              <div>
                <a href="#" @click.prevent="showImportByUrl = !showImportByUrl" class="text-sm"
                  >Import by URL</a
                >
                <input
                  v-show="showImportByUrl"
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
              </div>
              <div class="btn my-5" @click="loadFiles" v-if="fileList.length > 0">
                Load file{{ fileList.length > 1 ? 's' : '' }}
              </div>
              <div class="mb-5">{{ loadStatus.status }}</div>
              <div class="mb-5">{{ loadStatus.messages.join('\n') }}</div>
              <div class="btn" v-if="allInstances.length > 0" @click="nextStep">Next</div>
            </div>
          </section>
          <section>
            <div class="section-overlay" v-if="step !== 'redact'"></div>
            <h3 class="section-head">2. Remove PHI from image pixel data</h3>
            <div class="section-content">
              <QuarantinedSeriesList
                :studies="studies"
                @select-series="setSelectedSeries"
                @next-step="nextStep"
              ></QuarantinedSeriesList>
            </div>
          </section>
          <section>
            <div class="section-overlay" v-if="step !== 'anonymize'"></div>
            <h3 class="section-head">3. Anonymize files</h3>
            <div class="section-content">
              <div class="mt-2">
                Anonymized DICOM headers of {{ anonymizedInstances.length }} of
                {{ allInstances.length }} images.
              </div>
              <div class="btn mt-5" @click.prevent="anonymizeInstances">Anonymize all files</div>
              <p class="mt-5">
                <a href="#" @click.prevent="tab = 'anonymization-script'"
                  >Show default anonymization script</a
                >
              </p>
            </div>
          </section>
          <section>
            <div class="section-overlay" v-if="step !== 'export'"></div>
            <h3 class="section-head">4. Export files:</h3>
            <div class="section-content">
              <div class="btn" @click.prevent="downloadAll">Download all</div>
            </div>
          </section>
        </div>
        <div class="w-1/2 bg-gray-100 border-l border-b border-r p-5">
          <SeriesViewer
            v-if="selectedSeries"
            :series="selectedSeries"
            redact-enabled
            @update-redaction-boxes="updateRedaction"
            :key="viewerKey"
          ></SeriesViewer>
          <StudyList
            v-if="studies.length > 0"
            :studies="studies"
            selectable
            :selected-series="selectedSeries"
            @select-series="setSelectedSeries"
          ></StudyList>
          <div v-else class="text-sm text-gray-500">No images loaded.</div>
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
import { addLog, logs } from '../src/logToDiv';
import aTick from '../src/aTick';
import JsZip from 'jszip';
import FileSaver from 'file-saver';
import writeInstanceToBuffer from '../src/writeInstanceToBuffer.js';
import QuarantinedSeriesList from '../src/QuarantinedSeriesList.vue';
import Dropzone from 'dropzone';

const fileUrlInput = ref<HTMLInputElement>(null);
const fileSelectInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const studies = ref<Study[]>([]);
const viewerKey = ref(0);
const tab = ref('process-files');
const step = ref('load');
const selectedSeries = ref<Series>(null);
const showSublogIndex = ref(null);
const loadStatus = ref({ status: null, messages: [] });
let dropzone;
const fileList = ref<File[]>([]);
const showImportByUrl = ref(false);
const dropzoneDragOver = ref(false);

onMounted(() => {
  // const fileUrl = fileUrlInput.value.value;
  // loadImages({ urls: [fileUrl] }, studies);
  monitorMemory(memoryDiv.value);
  dropzone = new Dropzone('#dropzone', {
    url: '/',
    autoProcessQueue: false,
    autoQueue: false,
    disablePreviews: true,
    accept(file: File, done: any) {
      fileList.value.push(file);
      done();
    },
  });
  dropzone.on('dragover', () => {
    dropzoneDragOver.value = true;
  });
  dropzone.on('dragleave', () => {
    dropzoneDragOver.value = false;
  });
});

async function loadFiles() {
  dropzone.removeAllFiles();
  const fileUrl = fileUrlInput.value.value || undefined;
  const urls = fileUrl ? [fileUrl] : undefined;
  // const fileSelect = fileSelectInput.value.files;
  // const files = fileSelect?.length > 0 ? fileSelect : undefined;
  await loadImages({ urls, files: fileList.value }, studies, loadStatus);
  setSelectedSeries(studies.value[0].series[0]);
}

function nextStep() {
  if (step.value === 'load') {
    step.value = 'redact';
  } else if (step.value === 'redact') {
    step.value = 'anonymize';
  } else if (step.value === 'anonymize') {
    step.value = 'export';
  }
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
    addLog('info', `${instance.imageId}: Anonymized headers`, instance.anonymizationLogs);
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
      const {
        rows,
        columns,
        pixelData,
        pixelDataLength,
        photometricInterpretation,
        // samplesPerPixel,
      } = image.imageFrame as ImageFrame;

      const effectiveSamplesPerPixel = pixelData.length / (rows * columns);

      if (!Number.isInteger(effectiveSamplesPerPixel)) {
        throw new Error('Image size unknown, cannot redact');
      }

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
        const zeroingArray = Array(redaction.width * effectiveSamplesPerPixel).fill(valueToZero);
        for (let i = 0; i < redaction.height; i++) {
          const startIndex =
            (redaction.top + i) * (columns * effectiveSamplesPerPixel) +
            redaction.left * effectiveSamplesPerPixel;
          pixelData.set(zeroingArray, startIndex);
        }
      });

      // const newPixelData = new Int16Array(pixelDataLength);
      // image.imageFrame.pixelData = newPixelData;
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

function setSelectedSeries(series: Series) {
  selectedSeries.value = series;
  viewerKey.value++;
}

function downloadAll() {
  let instances: Instance[] = [];
  for (const study of studies.value) {
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
section {
  @apply relative p-3;
}
.section-overlay {
  @apply absolute opacity-80 bg-white w-full h-full top-0 left-0 z-10;
}
.section-head {
  @apply text-lg font-bold text-gray-600 my-5;
}
.section-content {
  @apply pl-5 text-gray-900;
}
#dropzone.dragover {
  @apply bg-green-50;
}
</style>
