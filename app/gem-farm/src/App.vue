<template>
  <div class="relative h-full min-h-screen bg-gray-100">
    <header class="px-4 py-5 md:px-8">
      <a href="https://www.coinfra.io/">
        <img
          src="https://s3.ap-northeast-1.wasabisys.com/coinfra/assets/logo-Coinfra-black.svg"
          alt="Coinfra"
          class="h-8 inline cursor-pointer"
        />
      </a>
    </header>
    <div class="p-4 md:p-10 max-w-5xl mx-auto">
      <router-view />
    </div>

    <div class="pt-10"></div>
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar';
import TheFooter from '@/components/gem-farm/TheFooter';
import TheCat from '@/components/gem-farm/TheCat';
export default {
  components: { TheCat, TheFooter, TheNavBar },
};
</script>

<style>
* {
  /* font-family: 'Press Start 2P', monospace; */
  cursor: auto;
}
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
