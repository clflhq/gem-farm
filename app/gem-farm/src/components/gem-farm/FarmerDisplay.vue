<template>
  <div>
    <div class="flex justify-center">
      <button
        class="inline-flex justify-center rounded-md border px-4 py-2 text-base font-medium sm:text-sm border-transparent text-white hover:bg-blue-600 bg-blue-500 focus:outline-none mb-10"
        @click="refreshFarmer"
      >
        Refresh
      </button>
    </div>
    <div class="p-4 md:p-6 border-0 bg-white rounded-md shadow-md mb-10">
      <p class="mb-5 text-2xl font-bold text-center">Your Staking Account</p>
      <div class="max-w-xl mx-auto">
        <div class="mb-2 flex">
          <span class="w-1/3 md:w-1/4">state</span>:
          <span class="ml-2 px-1 bg-yellow-200">
            {{ parseFarmerState(farmerAcc) }}
          </span>
        </div>
        <div class="mb-2 flex">
          <span class="w-1/3 md:w-1/4">Your identity</span>:
          <span class="w-2/3 md:w-3/4 pl-2 break-all">
            {{ farmerAcc.identity.toBase58() }}
          </span>
        </div>
        <div class="mb-2 flex">
          <span class="w-1/3 md:w-1/4">Associated vault</span>:
          <span class="w-2/3 md:w-3/4 pl-2 break-all">
            {{ farmerAcc.vault.toBase58() }}
          </span>
        </div>
        <div class="mb-2 flex">
          <span class="w-1/3 md:w-1/4">NFTs staked</span>:
          <span class="w-2/3 md:w-3/4 pl-2 break-all">
            {{ farmerAcc.gemsStaked }}
          </span>
        </div>
        <div class="mb-2 flex">
          <span class="w-1/3 md:w-1/4">Min staking ends</span>:
          <span class="w-2/3 md:w-3/4 pl-2 break-all">
            {{ parseDate(farmerAcc.minStakingEndsTs) }}
          </span>
        </div>
        <div class="flex">
          <span class="w-1/3 md:w-1/4">Cooldown ends</span>:
          <span class="w-2/3 md:w-3/4 pl-2 break-all">
            {{ parseDate(farmerAcc.cooldownEndsTs) }}
          </span>
        </div>
      </div>
    </div>

    <div class="md:flex mb-5">
      <div class="flex-1 mb-5 md:mb-0 md:mr-5">
        <FarmerRewardDisplay
          :key="farmerAcc.rewardA"
          :farmReward="farmAcc.rewardA"
          :reward="farmerAcc.rewardA"
          title="Reward A"
        />
      </div>
      <div class="flex-1">
        <FarmerRewardDisplay
          :key="farmerAcc.rewardB"
          :farmReward="farmAcc.rewardB"
          :reward="farmerAcc.rewardB"
          title="Reward B"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import FarmerRewardDisplay from '@/components/gem-farm/FarmerRewardDisplay.vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import { parseDate } from '@/common/util';

export default defineComponent({
  components: { FarmerRewardDisplay },
  props: {
    farm: String,
    farmAcc: Object,
    farmer: String,
    farmerAcc: Object,
  },
  emits: ['refresh-farmer'],
  setup(props, ctx) {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      gf = await initGemFarm(getConnection(), getWallet()!);
    });

    //need an onmounted hook because this component isn't yet mounted when wallet/cluster are set
    onMounted(async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
      }
    });

    // --------------------------------------- display farmer
    // todo ideally should be using one from client, but n/a during render
    const parseFarmerState = (farmer: any): string => {
      return Object.keys(farmer.state)[0];
    };

    const refreshFarmer = async () => {
      await gf.refreshFarmerWallet(
        new PublicKey(props.farm!),
        new PublicKey(props.farmer!)
      );
      ctx.emit('refresh-farmer');
    };

    return {
      refreshFarmer,
      parseFarmerState,
      parseDate,
    };
  },
});
</script>

<style scoped></style>
