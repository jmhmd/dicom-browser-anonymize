<template>
  <div>
    <div
      class="inline-block relative cursor-pointer"
      :class="{
        resolved: !hasUnresolvedQuarantinedImages,
        unresolved: hasUnresolvedQuarantinedImages,
      }"
    >
      <span v-if="!hasUnresolvedQuarantinedImages"> ✔ </span>
      <span v-else> ✖ </span>
      <slot></slot>
    </div>
    <div class="text-gray-500 ml-5">
      {{
        hasUnresolvedQuarantinedImages
          ? `Quarantine reason: ${quarantineReasonList.join(', ')}`
          : ''
      }}
      {{ imagesWillBeRemoved ? ' Quarantined images in this series will be removed.' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Series from './Series';

const props = defineProps<{
  series: Series;
}>();

const unresolvedQuarantinedImages = computed(() => {
  const quarantinedImages = props.series.instances.filter(
    (i) => i.quarantine && !i.quarantine.attestNoPHI
  );
  return quarantinedImages;
});

const hasUnresolvedQuarantinedImages = computed(() => {
  return unresolvedQuarantinedImages.value.length > 0;
});

const quarantineReasonList = computed(() => {
  const reasons = unresolvedQuarantinedImages.value.map((i) => i.quarantine && i.quarantine.reason);
  return [...new Set(reasons)];
});

const imagesWillBeRemoved = computed(() => {
  return (
    props.series.instances.findIndex((i) => i.quarantine && i.quarantine.action === 'remove') > -1
  );
});
</script>

<style scoped>
.resolved {
  @apply bg-green-200 hover:bg-green-300;
}
.unresolved {
  @apply bg-red-200 hover:bg-red-300;
}
</style>
