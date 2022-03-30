<template>
  <div class="border-4 border-black p-3">
    <p class="mb-3 font-bold">{{ title }}</p>
    <slot />
    <div class="flex flex-wrap">
      <NFTCard
        v-for="nft in nfts"
        :key="nft"
        :nft="nft"
        @selected="handleSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NFTCard from '@/components/gem-bank/NFTCard.vue';

export default defineComponent({
  components: { NFTCard },
  emits: ['selected'],
  props: {
    title: String,
    nfts: Array,
  },
  setup(props, ctx) {
    const handleSelected = (e: any) => {
      ctx.emit('selected', e);
    };
    return {
      handleSelected,
    };
  },
});
</script>

<style scoped></style>
