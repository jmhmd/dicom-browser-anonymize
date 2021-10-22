<template>
  <div>
    <div class="w-full px-5">
      <h1 class="text-xl font-bold">In browser DICOM anonymization</h1>

      <div class="flex justify-end">
        <a href="#" @click.prevent="tab = 'anonymization-script'" class="">
          <span>Anonymization Script</span>
        </a>
        <a href="#" @click.prevent="tab = 'about'" class="ml-5">About</a>
      </div>
      <div v-if="tab === 'process-files'" class="flex">
        <div class="w-1/2 pr-5">
          <div class="p-3 border-b border-gray-300 sticky top-0 bg-white z-20">
            <div class="absolute right-0 top-0">
              <a href="#" @click.prevent="logsExpanded = !logsExpanded">{{
                logsExpanded ? 'Collapse logs' : 'Expand logs'
              }}</a>
            </div>
            <div class="overflow-y-auto" :class="{ 'expanded-logs': logsExpanded }">
              <Logs :expanded="logsExpanded"></Logs>
            </div>
          </div>
          <div>
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
                <br />
                <div class="btn btn-primary" v-if="allInstances.length > 0" @click="nextStep">
                  Next
                </div>
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
                <div class="shadow-inner bg-gray-100 p-2">
                  <span class="text-sm text-gray-600">Anonymizer options:</span>
                  <div class="flex flex-wrap">
                    <div class="option-checkbox">
                      <input type="checkbox" v-model="defaultScript.options.removePrivateGroups" />
                      Remove private groups
                    </div>
                    <div class="option-checkbox">
                      <input type="checkbox" v-model="defaultScript.options.keepGroup0018" />
                      Keep group 0018
                    </div>
                    <div class="option-checkbox">
                      <input type="checkbox" v-model="defaultScript.options.keepGroup0020" />
                      Keep group 0020
                    </div>
                    <div class="option-checkbox">
                      <input type="checkbox" v-model="defaultScript.options.keepGroup0028" />
                      Keep group 0028
                    </div>
                    <div class="option-checkbox">
                      <input type="checkbox" v-model="defaultScript.options.removeOverlays" />
                      Remove overlays
                    </div>
                  </div>
                  <div class="">
                    Sequence action:
                    <select v-model="defaultScript.options.sequenceAction">
                      <option value="remove">Remove</option>
                      <option value="keep">Keep (Sequence will NOT be anonymized!!!)</option>
                    </select>
                  </div>
                </div>
                <div class="mt-2">
                  Anonymized DICOM headers of {{ anonymizedInstances.length }} of
                  {{ allInstances.length }} images.
                </div>
                <div
                  class="btn mt-5"
                  v-if="!allSeriesFullyAnonymized"
                  @click.prevent="anonymizeInstances"
                >
                  Anonymize all files
                </div>
                <div class="btn btn-primary mt-5" v-if="allSeriesFullyAnonymized" @click="nextStep">
                  Next
                </div>
                <div class="my-5 float-right">
                  <a href="#" @click.prevent="tab = 'anonymization-script'"
                    >Show full default anonymization script</a
                  >
                </div>
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
        </div>
        <div class="w-1/2 bg-gray-100 border p-5">
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
      <div v-if="tab === 'anonymization-script'" id="anonymization-script" class="relative">
        <div class="w-full md:w-1/2 mx-auto mt-10">
          <div class="absolute top-0 right-5">
            <a href="#" @click.prevent="tab = 'process-files'" class="text-5xl">&#10006;</a>
          </div>
          <p class="text-sm">
            This anonymizer supports a subset of the operations implemented by the RSNA CTP
            anonymizer. The CTP anonymizer script format has been converted to JSON, however follows
            the same basic structure. See the
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
      <div v-if="tab === 'about'" class="relative">
        <div class="w-full md:w-1/2 mx-auto mt-10">
          <div class="absolute top-0 right-5">
            <a href="#" @click.prevent="tab = 'process-files'" class="text-5xl">&#10006;</a>
          </div>
          <h1 class="text-lg font-bold">About this application</h1>
          <p class="my-5">
            Thanks to the steady advancement of Javascript and web browser technologies, as well as
            lots of open source work by the brilliant folks behind the
            <a href="https://cornerstonejs.org/" target="_blank">CornerstoneJS</a>,
            <a href="https://ohif.org/" target="_blank">OHIF</a>, and
            <a href="https://github.com/dcmjs-org/dcmjs" target="_blank">DCMJS</a> projects,
            manipulation of DICOM images is now possible entirely within the browser.
          </p>
          <p class="my-5">
            This means that DICOM images can now be parsed, changed, and written to file within the
            browser, without needing to send the image files to a server. As DICOM images often
            contain sensitive information about patients, sending these files to a server over the
            internet introduces security concerns. Usually this sensitive information is removed
            from the files prior to sending them over the internet, but this process currently
            requires specialized software to be installed and configured.
          </p>
          <p class="my-5">
            This web application is a proof-of-concept allowing removal of sensitive information
            both from DICOM headers and redaction of sensitive information from image pixel data.
            All the processing occurs on the user's computer without sending data to a remote
            server, and no specialized software is needed.
          </p>
          <p class="text-sm font-light my-5">&copy; Jason Hostetter 2021</p>
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
import loadImages from './loadImages';
import SeriesViewer from './redact/series-viewer.vue';
import monitorMemory from './monitorMemory';
import Study from './Study';
import ImageFrame from './ImageFrame';
import defaultScript from './anonymize/scripts/header-script.default';
import anonymizeInstance from './anonymizeInstance';
import type Series from './Series';
import type Instance from './Instance';
import StudyList from './StudyList.vue';
import { addLog, updateStatus, progressBar } from './logger';
import aTick from './aTick';
import JsZip from 'jszip';
import FileSaver from 'file-saver';
import writeInstanceToBuffer from './writeInstanceToBuffer';
import QuarantinedSeriesList from './QuarantinedSeriesList.vue';
import Dropzone from 'dropzone';
import Logs from './Logs.vue';

const fileUrlInput = ref<HTMLInputElement | null>(null);
const memoryDiv = ref<HTMLElement | null>(null);
const studies = ref<Study[]>([]);
const viewerKey = ref(0);
const tab = ref('process-files');
const step = ref('load');
const selectedSeries = ref<Series | null>(null);
const fileList = ref<File[]>([]);
const showImportByUrl = ref(false);
const dropzoneDragOver = ref(false);
const logsExpanded = ref(false);

onMounted(() => {
  // const fileUrl = fileUrlInput.value.value;
  // loadImages({ urls: [fileUrl] }, studies);
  if (memoryDiv.value) {
    monitorMemory(memoryDiv.value);
  }
  const dropzone = new Dropzone('#dropzone', {
    url: '/',
    autoProcessQueue: false,
    autoQueue: false,
    // @ts-ignore: option not in dropzone types, but documented and works?
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
  // Doing this instead of keeping a reference to the dropzone object because for some reason after
  // minification, other references to the dropzone object turn into just the HTML element so none
  // of the functions are defined...??? Must be some side effect of `script setup` or reactivity.
  // This works well enough.
  document.addEventListener('clear-dropzone', () => {
    console.log('clearing dropzone');
    dropzone.removeAllFiles();
  });
});

async function loadFiles() {
  document.dispatchEvent(new Event('clear-dropzone'));
  const fileUrl = fileUrlInput.value?.value;
  const urls = fileUrl ? [fileUrl] : undefined;
  // const fileSelect = fileSelectInput.value.files;
  // const files = fileSelect?.length > 0 ? fileSelect : undefined;
  await loadImages({ urls, files: fileList.value }, studies, progressBar);
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
const allSeriesFullyAnonymized = computed(() => {
  return (
    anonymizedInstances.value.length > 0 &&
    allInstances.value.length === anonymizedInstances.value.length
  );
});
async function anonymizeInstances() {
  // Use for...of instead of Promise.all to not attempt to anonymize serially instead of in parallel
  progressBar.value.start(allInstances.value.length);
  for (const instance of allInstances.value) {
    await aTick();
    try {
      anonymizeInstance(instance);
      addLog('info', `${instance.imageId}: Anonymized headers`, instance.anonymizationLogs);
    } catch (err: any) {
      const errMessage =
        err.message || err.error?.message || JSON.stringify(err, Object.getOwnPropertyNames(err));
      if (errMessage && typeof errMessage === 'string') {
        addLog('error', `Error anonymizing image ${instance.imageId}: ${errMessage}`);
      } else {
        addLog('error', `Error anonymizing image ${instance.imageId}: Unknown error`);
      }
      instance.anonymizationError = true;
      delete instance.image.anonymizedDicomData;
      console.error(err);
    } finally {
      progressBar.value.numDone += 1;
    }
  }
  progressBar.value.reset();
  updateStatus('Anonymization complete');
}

function getRectangleImageCoordinates(
  startHandle: { x: number; y: number },
  endHandle: { x: number; y: number }
) {
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
    }[] = redactionBoxes.map((redactionBox: any) =>
      getRectangleImageCoordinates(redactionBox.handles.start, redactionBox.handles.end)
    );

    selectedSeries.value?.instances.forEach((instance) => {
      const { image } = instance;
      const {
        rows,
        columns,
        pixelData,
        // pixelDataLength,
        // photometricInterpretation,
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
      console.log('redacted', selectedSeries.value?.instances[0].image.imageFrame.pixelData);
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
  try {
    let instances: Instance[] = [];
    for (const study of studies.value) {
      for (const series of study.series) {
        instances = instances.concat(series.instances);
      }
    }

    progressBar.value.start(instances.length);
    const blobs = instances.map((instance, i) => {
      updateStatus(`Writing instance ${i + 1} of ${instances.length} to file.`);
      writeInstanceToBuffer(instance);
      progressBar.value.numDone += 1;
      return new Blob([instance.image.dicomP10ArrayBuffer], { type: 'application/dicom' });
    });
    progressBar.value.reset();

    const zip = JsZip();

    progressBar.value.start(blobs.length);
    blobs.forEach((blob, i) => {
      updateStatus(`Adding instance ${i + 1} of ${instances.length} to zip.`);
      zip.file(`image-${i}.dcm`, blob);
      progressBar.value.numDone += 1;
    });
    progressBar.value.reset();

    zip
      .generateAsync({ type: 'blob' }, function updateCallback(metadata) {
        let status = `Generating zip file: ${metadata.percent.toFixed(0)}%`;
        progressBar.value.setProgress(parseInt(metadata.percent.toFixed(0), 10));
        if (metadata.currentFile) {
          status += ` (Current file: ${metadata.currentFile})`;
        }
        updateStatus(status);
      })
      .then((zipFile) => {
        progressBar.value.reset();
        updateStatus('Done.');
        const currentDate = new Date().getTime();
        const fileName = `anonymized-images-${currentDate}.zip`;
        return FileSaver.saveAs(zipFile, fileName);
      });
  } catch (err: any) {
    const errMessage = err.message || err.error?.message;
    if (errMessage && typeof errMessage === 'string') {
      addLog('error', `Error generating zip: ${errMessage}`);
    }
    console.error(err);
  }
}
</script>

<style scoped lang="postcss">
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
.expanded-logs {
  height: 80vh;
}
.option-checkbox {
  @apply m-2;
  padding-left: 20px;
  text-indent: -20px;
}
</style>
