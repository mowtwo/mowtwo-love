<script lang="ts">
  import type { Data } from "$lib/utils/type";
  import dayjs from "$lib/utils/dayjs";
  import { fly } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";

  const { addNotification } = getNotificationsContext();

  export let data: Data;

  let scrolling = false;

  let scroll_timer: number | NodeJS.Timeout;

  const toggleScroll = () => {
    clearTimeout(scroll_timer);
    scrolling = true;
    scroll_timer = setTimeout(() => {
      scrolling = false;
    }, 1500);
  };

  const shareHandle = async () => {
    try {
      await navigator.share({
        title: `陈爱上羊`,
        text: data.title ?? "一则小故事",
        url: location.href,
      });
      addNotification({
        text: "分享成功",
        position: "top-center",
        type: "success",
      });
    } catch {
      addNotification({
        text: "分享出了点问题，再试试吧",
        position: "top-center",
        type: "warning",
      });
    }
  };
</script>

<svelte:head>
  <title>时间线：{data.title}</title>
</svelte:head>

<svelte:window on:scroll={toggleScroll} />

<article class="max-w-200 ma {scrolling ? 'mb-0' : 'mb-20'}">
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

{#if !scrolling}
  <div
    transition:fly={{ y: 100 }}
    class="w-98% h-18 fixed bottom-2 left-50% translate-x--50% bg-white shadow rd-4"
  >
    <div class="w-100% h-100% flex items-center justify-between">
      <a
        href="/"
        class="flex items-center ml-4 no-underline text-white p-2 rd-2 bg-blue h-5"
      >
        <div class="i-carbon-home m-1 text-5" />
        首页
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="flex mr-4 items-center text-white p-2 rd-2 bg-blue  h-5"
        on:click={shareHandle}
      >
        <div class="i-carbon-share text-5" />
        分享
      </div>
    </div>
  </div>
{/if}

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
