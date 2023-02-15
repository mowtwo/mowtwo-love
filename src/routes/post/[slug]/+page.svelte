<script lang="ts">
  import type { Data } from "$lib/utils/type";
  import dayjs from "$lib/utils/dayjs";

  export let data: Data;
</script>

<svelte:head>
  <title>时间线：{data.title}</title>
</svelte:head>

<article class="max-w-200 ma">
  <h1 class="text-center">{data.title}</h1>
  <div class="text-right">
    <div class="flex items-center justify-center text-3.5 text-gray gap-3">
      <span>开始于：{dayjs(data.startedDate).format("YYYY-MM-DD")}</span>
      {#if data.finished}
        <div class="w-.4 h-4 bg-gray" />
        <b>完成于：{dayjs(data.finisheDate).format("YYYY-MM-DD")}</b>
      {/if}
    </div>
    <div class="inline-flex mt-2 p-2 bg-blue text-white rd-1 text-3">
      {#if data.finished}
        完成啦 <span class="text-red ml-2">❤</span>
      {:else}
        我们还有很长时间<span class="text-red ml-2">⏰</span>
      {/if}
    </div>
  </div>
  <section class="post-content p-2">
    <svelte:component this={data.content} />
  </section>
</article>

<style lang="scss">
  .post-content {
    :global(img) {
      width: 100%;
      margin: 2rem 0;
    }
    :global(p) {
      line-height: 1.4rem;
    }
  }
</style>
