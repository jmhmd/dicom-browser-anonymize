<template>
  <div>
    <div class="w-full px-5">
      <h1 class="text-xl font-bold">In browser DICOM anonymization</h1>

      <div class="flex">
        <a
          href="#"
          @click.prevent="tab = 'input-files'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'input-files' }"
        >
          <span>Input files</span>
        </a>
        <a
          href="#"
          @click.prevent="tab = 'anonymize'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'anonymize' }"
        >
          <span>Anonymize headers</span>
        </a>
        <a
          href="#"
          @click.prevent="tab = 'redact'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'redact' }"
        >
          <span>Redact pixels</span>
        </a>
        <a
          href="#"
          @click.prevent="tab = 'export'"
          class="tab inline-block"
          :class="{ 'tab-active': tab === 'export' }"
        >
          <span>Export files</span>
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
      <section v-if="tab === 'input-files'">
        <h3 class="font-bold">Input DICOM files</h3>
        <p>Select DICOM files from your computer:</p>
        <input type="file" ref="fileSelectInput" id="input-files" multiple />
        <p>Import a DICOM file from a url:</p>
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
        <h3 class="font-bold">Files:</h3>
        <StudyList :studies="studies"></StudyList>
      </section>
      <section v-if="tab === 'anonymize'">
        <h3 class="font-bold">Anonymizer</h3>
        <div class="flex">
          <div class="w-1/2">
            <div class="mt-10">
              <div class="btn" @click.prevent="anonymizeInstances">Anonymize all images</div>
            </div>
            <StudyList :studies="studies" class="mt-10"></StudyList>
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
          <div class="w-1/2">
            <a href="#" @click.prevent="showAnonScript = !showAnonScript"
              >Show default anonymization script</a
            >
            <div v-if="showAnonScript">
              <p class="text-sm">
                This anonymizer supports a subset of the operations implemented by the RSNA CTP
                anonymizer. The script format has been converted to JSON, however follows the same
                basic structure. See the
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
        </div>
      </section>
      <section v-if="tab === 'redact'">
        <div class="flex">
          <div class="w-1/3">
            <StudyList
              :studies="studies"
              selectable
              @select-series="(series: Series) => (selectedSeries = series)"
            ></StudyList>
          </div>
          <div class="w-full">
            <SeriesViewer
              v-if="selectedSeries"
              :series="selectedSeries"
              redact-enabled
              @update-redaction-boxes="updateRedaction"
              :key="viewerKey"
            ></SeriesViewer>
          </div>
        </div>
      </section>
      <section v-if="tab === 'export'">
        <h3 class="font-bold">Download files:</h3>
        <StudyList :studies="studies" exportable class="mt-5"></StudyList>
      </section>
      <section v-if="tab === 'log'" id="log">
        <div v-for="log in logs">
          {{ log }}
        </div>
      </section>
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

const fileUrlInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const studies = ref<Study[]>([]);
const viewerKey = ref(0);
const tab = ref('input-files');
const showAnonScript = ref(false);
const selectedSeries = ref<Series>(null);
const showLogsForImageId = ref(null);

onMounted(() => {
  const fileUrl = fileUrlInput.value.value;
  loadImages({ urls: [fileUrl] }, studies);
  monitorMemory(memoryDiv.value);
});

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
  Promise.all(allInstances.value.map(anonymizeInstance));
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
</script>

<style scoped>
.tab {
  @apply flex-grow text-center bg-gray-200 border border-gray-500 text-black;
}
.tab-active {
  @apply border-b-0 bg-white;
}
</style>
