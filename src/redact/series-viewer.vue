<template>
  <div style="top: 40px">
    <div v-if="series" class="viewer-container">
      <div id="canvas" ref="canvas" :style="{ minHeight }"></div>
      <div>Images reviewed: {{ numImagesDisplayed }} / {{ numImagesTotal }}</div>
      <div v-if="currentImageQuarantined" class="text-orange-500">
        {{ currentImageQuarantined.reason }}
      </div>
      <div v-if="redactEnabled" class="flex">
        <button
          v-if="!redacting"
          :disabled="series.reviewed ? true : currentImageRemoved"
          class="btn btn-blue mt-5 mx-1 pt-1 flex-1"
          @click="startRedacting"
        >
          Edit image redactions
        </button>
        <button v-if="redacting" class="btn btn-green mt-5 mx-1 pt-1 flex-1" @click="stopRedacting">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  cornerstone,
  cornerstoneTools,
  cornerstoneWADOImageLoader,
} from '../cornerstone/cornerstone-setup.js';
import RectangleRedact from '../cornerstone/rectangle-redact-tool.js';
import Series from '../Series';

const props = withDefaults(
  defineProps<{
    series: Series;
    height?: string;
    redactEnabled?: boolean;
  }>(),
  { redactEnabled: false }
);

const emit = defineEmits<{
  (e: 'updateRedactionBoxes', redactionBoxes: any[]): void;
}>();

const stack = ref<{ imageIds: string[]; currentImageIdIndex: number } | null>(null);
const minHeight = props.height || '500px';
const redactionBoxes = ref<any[]>([]);
const redacting = ref(false);
const imageIdsRendered = ref<string[]>([]);
const canvas = ref<HTMLDivElement>();

defineExpose({
  canvas,
});

function onMeasurementAdded(e: any) {
  if (e.detail.toolType === 'RectangleRedact') {
    const { measurementData }: { measurementData: any } = e.detail;
    measurementData.csid = uuidv4();
    redactionBoxes.value.push(measurementData);
    copyToAllImages();
  }
}
function onMeasurementRemoved(e: any) {
  if (e.detail.toolType === 'RectangleRedact') {
    const { measurementData } = e.detail;
    const { csid } = measurementData;
    redactionBoxes.value.splice(
      redactionBoxes.value.findIndex((b) => b.csid === csid),
      1
    );
    copyToAllImages();
  }
}
function copyToAllImages() {
  if (!stack.value) return false;
  // Copy redact rectangles to all imageIds
  const annotations: { [key: string]: any } = {};
  stack.value.imageIds.forEach((imageId) => {
    annotations[imageId] = {
      RectangleRedact: {
        // Don't just pass this.redactionBoxes array here, because then the object will be
        // modified by both cornerstone and vue, and will duplicate tool data
        data: [...redactionBoxes.value],
      },
    };
  });
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(annotations);
  return true;
}
function onImageRendered(eventData: any) {
  const { imageId } = eventData.detail.image;
  if (!imageIdsRendered.value.includes(imageId)) {
    imageIdsRendered.value.push(imageId);
  }
}

onMounted(() => {
  if (props.series.instances.length > 0) {
    loadSeries();
  }
  canvas.value?.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, onMeasurementAdded);
  canvas.value?.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_REMOVED, onMeasurementRemoved);
  // Image loading events are bound to the cornerstone object, not the element
  // cornerstone.events.addEventListener(cornerstone.EVENTS.IMAGE_LOADED, onImageLoaded);
  canvas.value?.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, onImageRendered);
  if (Array.isArray(props.series.redactionBoxes)) {
    redactionBoxes.value = [...props.series.redactionBoxes];
  }
});

onUnmounted(() => {
  cornerstoneWADOImageLoader.wadouri.fileManager.purge();
  cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();
  // Managing the cache manually since we're directly editing files
  // cornerstone.imageCache.purgeCache();
  // clear all tool data
  cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState({});
  // cornerstone.events.removeEventListener(cornerstone.EVENTS.IMAGE_LOADED, this.onImageLoaded);
  canvas.value?.removeEventListener(cornerstone.EVENTS.IMAGE_RENDERED, onImageRendered);
});

function loadSeries() {
  const element = canvas.value; // use built-in vue refs to access DOM element
  if (!element) return false;
  stack.value = {
    currentImageIdIndex: 0,
    imageIds: props.series.instances.map((i) => i.imageId),
  };

  cornerstone.enable(element);

  return cornerstone
    .loadImage(stack.value.imageIds[stack.value.currentImageIdIndex])
    .then((image: any) => {
      // display this image
      const viewport = cornerstone.getDefaultViewportForImage(element, image);

      cornerstone.invalidate(element);
      cornerstone.displayImage(element, image, viewport);

      // set the stack as tool state
      cornerstoneTools.clearToolState(element, 'stack');
      cornerstoneTools.addStackStateManager(element, ['stack']);
      cornerstoneTools.addToolState(element, 'stack', stack.value);

      // Enable all tools we want to use with this element
      cornerstoneTools.addToolForElement(element, cornerstoneTools.StackScrollMouseWheelTool);
      cornerstoneTools.addToolForElement(element, cornerstoneTools.StackScrollTool);
      cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
      cornerstoneTools.addToolForElement(element, RectangleRedact);

      // Mousewheel stack scroll gets activated no matter what
      cornerstoneTools.setToolActiveForElement(element, 'StackScrollMouseWheel', {
        mouseButtonMask: 0,
        isTouchActive: true,
      });

      cornerstoneTools.setToolEnabledForElement(element, 'RectangleRedact');

      cornerstoneTools.setToolActiveForElement(element, 'StackScroll', {
        mouseButtonMask: 1,
        isTouchActive: true,
      });
      // cornerstoneTools.setToolActiveForElement(element, 'Wwwc', {
      //   mouseButtonMask: 1,
      //   isTouchActive: true,
      // });

      if (redactionBoxes.value && redactionBoxes.value.length > 0) {
        copyToAllImages();
      }
    });
}

const numImagesDisplayed = computed(() => {
  if (!stack.value) return 0;
  return imageIdsRendered.value.length;
});
const numImagesTotal = computed(() => {
  if (!stack.value) return false;
  return stack.value.imageIds.length;
});
// const allImagesDisplayed = computed(() => {
//   if (!stack.value) return false;
//   return numImagesDisplayed.value >= numImagesTotal.value;
// });
// const hasRedactions = computed(() => {
//   return props.series.redactionBoxes && props.series.redactionBoxes.length > 0;
// });
const currentImageId = computed(() => {
  if (!stack.value) return false;
  const currentImageId = stack.value.imageIds[stack.value.currentImageIdIndex];
  return currentImageId;
});
const currentImageQuarantined = computed(() => {
  if (!stack.value || !props.series.quarantined) return false;
  const quarantinedImage = props.series.quarantined.find(
    (image) => image.imageId === currentImageId.value
  );
  return quarantinedImage;
});
const currentImageRemoved = computed(() => {
  if (currentImageQuarantined.value && currentImageQuarantined.value?.remove) {
    return true;
  }
  if (
    props.series.userRemoved &&
    props.series.userRemoved.find((f) => f.imageId === currentImageId.value)
  ) {
    return true;
  }
  return false;
});
// const currentImageUserRemoved = computed(() => {
//   if (
//     props.series.userRemoved &&
//     props.series.userRemoved.find((f) => f.imageId === currentImageId.value)
//   ) {
//     return true;
//   }
//   return false;
// });

function startRedacting() {
  redacting.value = true;
  const element = canvas.value;
  cornerstoneTools.setToolActiveForElement(element, 'RectangleRedact', {
    mouseButtonMask: 1,
    isTouchActive: true,
  });
}

function stopRedacting() {
  redacting.value = false;
  const element = canvas.value;
  cornerstoneTools.setToolEnabledForElement(element, 'RectangleRedact');
  cornerstoneTools.setToolActiveForElement(element, 'StackScroll', {
    mouseButtonMask: 1,
    isTouchActive: true,
  });

  emit('updateRedactionBoxes', redactionBoxes.value);
}
</script>

<style scoped>
#canvas {
  flex: auto;
  height: 100%;
  min-width: 0;
}
</style>
