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
        <SeriesViewer
          v-if="series.instances.length > 0"
          :series="series"
          redact-enabled
          @update-redaction-boxes="updateRedaction"
          :key="viewerKey"
        ></SeriesViewer>
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
import ImageFrame from '../src/ImageFrame';
import { cornerstone } from '../src/cornerstone/cornerstone-setup';

const fileUrlInput = ref<HTMLInputElement>(null);
const memoryDiv = ref<HTMLElement>(null);
const series = ref<Series>({ instances: [] });
const viewerKey = ref(0);

onMounted(() => {
  const fileUrl = fileUrlInput.value.value;
  loadImages({ urls: [fileUrl] }, series);
  monitorMemory(memoryDiv.value);
});

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
        const valueToZero = (image.imageFrame.smallestPixelValue as number) || 0;
        const zeroingArray = Array(redaction.width).fill(valueToZero);
        for (let i = 0; i < redaction.height; i++) {
          const startIndex = (redaction.top + i) * columns + redaction.left;
          console.log('zeroing', zeroingArray.length, 'at index', startIndex);
          pixelData.set(zeroingArray, startIndex);
        }
      });
      console.log('redacted', series.value.instances[0].image.imageFrame.pixelData);
    });

    console.log('purge and reload cache');
    cornerstone.imageCache.purgeCache();
    series.value.instances.forEach((instance) => {
      cornerstone.imageCache.putImageLoadObject(instance.imageId, {
        promise: Promise.resolve(instance.image),
        cancelFn: undefined,
      });
    });

    viewerKey.value++;
  }
}
</script>
