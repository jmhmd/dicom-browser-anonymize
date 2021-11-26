<template>
  <div class="flex">
    <div class="text-xs font-mono leading-tight bg-gray-100 p-2 border">
      <template v-for="value in valuesList">
        "{{ value.value }}"
        <br />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DicomDict2 from './DicomDict2';
import Instance from './Instance';

const props = defineProps<{ instances: Instance[] }>();

function addValuesFromTag(
  tag: { vr: string; Value: any[]; tag: string },
  valueList: { value: string; tags: string[] }[]
) {
  const tagValues = tag.Value;
  for (let value of tagValues) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (let sequenceTag of Object.keys(value)) {
        const { vr, Value } = value[sequenceTag];
        addValuesFromTag({ vr, Value, tag: sequenceTag }, valueList);
      }
    } else {
      const existingValue = valueList.find((v) => v.value === value);
      if (existingValue && !existingValue.tags.includes(tag.tag)) {
        existingValue.tags.push(tag.tag);
      } else if (!existingValue) {
        valueList.push({ value, tags: [tag.tag] });
      }
    }
  }
}

function generateValueList(datasets: DicomDict2[]) {
  const valueList: { value: string; tags: string[] }[] = [];
  for (let dataset of datasets) {
    for (let tag of Object.keys(dataset.meta)) {
      const { vr, Value } = dataset.meta[tag];
      addValuesFromTag({ vr, Value, tag }, valueList);
    }

    for (let tag of Object.keys(dataset.dict)) {
      const { vr, Value } = dataset.dict[tag];
      addValuesFromTag({ vr, Value, tag }, valueList);
    }
  }

  return valueList.sort((a, b) => {
    return b.value.toString().length - a.value.toString().length;
  });
}

const valuesList = computed(() => {
  const datasets = props.instances
    .map((instance) => instance.image.dicomDataset)
    .filter((d) => d || false) as DicomDict2[];
  return generateValueList(datasets);
});
</script>
