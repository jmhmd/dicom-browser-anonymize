<template>
  <div class="flex">
    <div class="w-1/2 px-5">
      <h1 class="text-xl font-bold">In browser DICOM anonymization</h1>

      <div class="flex">
        <div class="flex-grow">
          <a href="#" @click.prevent="tab = 'input-files'">Input files</a>
        </div>
        <div class="flex-grow"><a href="#" @click.prevent="tab = 'anonymize'">Anonymize</a></div>
        <div class="flex-grow"><a href="#" @click.prevent="tab = 'log'">Log</a></div>
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
        <div></div>
      </section>
      <section v-if="tab === 'anonymize'">
        <h3 class="font-bold">Anonymizer</h3>
        <a href="#" @click.prevent="anonymizeInstances">Anonymize</a>
        <a href="#" @click.prevent="showAnonScript = !showAnonScript"
          >Show default anonymization script</a
        >
        <div v-if="showAnonScript">
          {{ JSON.stringify(defaultScript, null, 4) }}
        </div>
        <div v-if="anonymizedInstances.length">
          <h3 class="font-bold">Anonymized files:</h3>
          <div v-for="instance in anonymizedInstances">
            Anonymized imageId: {{ instance.imageId }}, Logs:
            {{ instance.anonymizationLogs.length }}
          </div>
        </div>
      </section>
      <section v-if="tab === 'log'" id="log"></section>
      <!-- <section>
        <h3>Links:</h3>
        <div>
          <a href="#" id="download-file">Download file</a>
        </div>
      </section> -->
    </div>
    <div class="flex-grow">
      <section>
        <!-- <SeriesViewer
          v-if="series.instances.length > 0"
          :series="series"
          redact-enabled
          @update-redaction-boxes="updateRedaction"
          :key="viewerKey"
        ></SeriesViewer> -->
      </section>
    </div>
  </div>
  <div ref="memoryDiv" style="position: absolute; left: 5px; bottom: 5px; background-color: white">
    Loading memory...
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import loadImages from '../src';
import SeriesViewer from '../src/redact/series-viewer.vue';
import monitorMemory from '../src/monitorMemory';
import Study from '../src/Study';
import ImageFrame from '../src/ImageFrame';
import defaultScript from '../src/anonymize/scripts/header-script.default';
import anonymizeInstance from '../src/anonymizeInstance';
import { Instance } from '../src/Series';

const fileUrlInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const studies = ref<Study[]>([]);
const viewerKey = ref(0);
const tab = ref('input-files');
const showAnonScript = ref(false);

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
  await Promise.all(allInstances.value.map(anonymizeInstance));
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

    series.value.instances.forEach((instance) => {
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
      console.log('redacted', series.value.instances[0].image.imageFrame.pixelData);
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
