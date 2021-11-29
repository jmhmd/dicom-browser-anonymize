<template>
  <div class="flex">
    <div class="text-xs font-mono leading-tight bg-gray-100 p-2 border">
      <div v-if="computing">Compiling summary...</div>
      <div v-else>
        <div class="mb-5">
          <h1 class="">High risk tags:</h1>
          <table>
            <thead>
              <tr>
                <th>Tag Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tagList in tagLists.highRisk">
                <td>
                  <div v-for="name in getTagList(tagList)">
                    {{ name }}
                  </div>
                </td>
                <td>
                  <div v-for="val in getValuesList(tagList)">
                    {{ val }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-5">
          <h1 class="">
            Low risk tags:
            <a href="#" @click.prevent="lowRiskExpanded = !lowRiskExpanded">{{
              lowRiskExpanded ? 'Collapse' : 'Expand'
            }}</a>
          </h1>
          <table v-if="lowRiskExpanded">
            <thead>
              <tr>
                <th>Tag Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tagList in tagLists.lowRisk">
                <td>
                  <div v-for="name in getTagList(tagList)">
                    {{ name }}
                  </div>
                </td>
                <td>
                  <div v-for="val in getValuesList(tagList)">
                    {{ val }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-5">
          <h1 class="">All remaining values found (unknown risk):</h1>
          <table>
            <thead>
              <tr>
                <th>Tag Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tagList in tagLists.unknownRisk">
                <td>
                  <div v-for="name in getTagList(tagList)">
                    {{ name }}
                  </div>
                </td>
                <td>
                  <div v-for="val in getValuesList(tagList)">
                    {{ val }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DicomDict2 from './DicomDict2';
import Instance from './Instance';
import { tagToName } from './anonymize/util/dicomDictionary';

const props = defineProps<{ instances: Instance[] }>();

const lowRiskExpanded = ref(false);

const maxListNumber = 5;

function getTagList(tagEntry: { tags: string[] }) {
  let list = tagEntry.tags;
  if (list.length > maxListNumber) {
    list = list.slice(0, maxListNumber);
    list = list.map((tag) => {
      const tagName = tagToName(tag);
      return tagName || tag;
    });
    list.push('...');
    return list;
  }
  return list.map((tag) => {
    const tagName = tagToName(tag);
    return tagName || tag;
  });
}

function getValuesList(tagEntry: { values: string[] }) {
  let list = tagEntry.values;
  if (list.length > maxListNumber) {
    list = list.slice(0, maxListNumber);
    list.push('...');
    return list;
  }
  return list;
}

interface ValuesList {
  values: string[];
  tags: string[];
}
interface TagLists {
  highRisk: ValuesList[];
  lowRisk: ValuesList[];
  unknownRisk: ValuesList[];
}

/**
 * For some reason I don't understand, creating the `values` object as a ref and using that directly
 * to compile the list is really slow. Using a plain object then assigning it to a ref after
 * computation is much much faster.
 */
const tagLists: TagLists = {
  highRisk: [],
  lowRisk: [],
  unknownRisk: [],
};
const tagListsRef = ref<undefined | TagLists>();

const highRiskTags = [
  /00080050/, // AccessionNumber
  /0008008./, // Institution
  /0008009./, // Referring Physician
  /000810../, // Study and series description, physicians, operators, admitting diagnosis...
  /00080013/, // Instance Creation Time
  /000800[23]./, // Study date and time
  /0010..../, // Patient demographics
  /00204000/, // Image comments
  /00209158/, // Frame comments
  /003210../, // Reason for study, requesting physician...
  /0038..../, // Admitting info and demographics
  /0040..../, // Trials stuff, demographics and names of trial observers...
  /40004000/, // Text comments
  /4008..../, // Interpretation demographics...
];
const lowRiskTags = [/0018..../, /0020..../, /0028..../];
const alphaRegex = /[a-zA-Z]/;
function getRiskLevel(tag: string) {
  if (highRiskTags.some((regex) => regex.test(tag))) {
    return 'highRisk';
  }
  if (lowRiskTags.some((regex) => regex.test(tag))) {
    return 'lowRisk';
  }
  return 'unknownRisk';
}

function addValuesFromTag(tag: { vr: string; Value: any[]; tag: string }, values: TagLists) {
  const tagValues = tag.Value;
  for (let value of tagValues) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (let sequenceTag of Object.keys(value)) {
        const { vr, Value } = value[sequenceTag];
        addValuesFromTag({ vr, Value, tag: sequenceTag }, values);
      }
    } else {
      const tagRiskLevel = getRiskLevel(tag.tag);
      const tagList = tagLists[tagRiskLevel];

      const listItemHasValue = tagList.find((v) => v.values.includes(value));
      if (listItemHasValue && !listItemHasValue.tags.includes(tag.tag)) {
        listItemHasValue.tags.push(tag.tag);
      } else if (!listItemHasValue) {
        const listItemHasTag = tagList.find((v) => v.tags.includes(tag.tag));

        if (listItemHasTag && !listItemHasTag.values.includes(value)) {
          listItemHasTag.values.push(value);
        } else if (!listItemHasTag) {
          tagList.push({ values: [value], tags: [tag.tag] });
        }
      }
    }
  }
}

function generateValueList(datasets: DicomDict2[], tagLists: TagLists) {
  console.time('compile values');
  for (let dataset of datasets) {
    for (let tag of Object.keys(dataset.meta)) {
      const { vr, Value } = dataset.meta[tag];
      addValuesFromTag({ vr, Value, tag }, tagLists);
    }

    for (let tag of Object.keys(dataset.dict)) {
      const { vr, Value } = dataset.dict[tag];
      addValuesFromTag({ vr, Value, tag }, tagLists);
    }
  }
  console.timeEnd('compile values');

  console.time('sort values');
  for (let key of Object.keys(tagLists)) {
    const valueList = tagLists[key as keyof typeof tagLists];
    // Sort by strings containing letters, then by value length
    valueList.sort((a, b) => {
      const aContainsAlpha = alphaRegex.test(a.values[0]);
      const bContainsAlpha = alphaRegex.test(b.values[0]);
      if (aContainsAlpha && !bContainsAlpha) {
        return -1;
      }
      if (bContainsAlpha && !aContainsAlpha) {
        return 1;
      }
      return b.values[0].toString().length - a.values[0].toString().length;
    });
  }
  console.timeEnd('sort values');
}

const computing = ref(false);
onMounted(() => {
  computing.value = true;
  setTimeout(() => {
    console.time('computed');
    const datasets = props.instances
      .map((instance) => instance.image.dicomDataset)
      .filter((d) => d || false) as DicomDict2[];
    generateValueList(datasets, tagLists);
    console.timeEnd('computed');
    tagListsRef.value = tagLists;
    computing.value = false;
  }, 0);
});
</script>

<style scoped lang="postcss">
table {
  @apply w-full;
}
td {
  @apply border border-black border-opacity-50 p-1;
}
h1 {
  @apply font-bold mb-2 text-base;
}
</style>
