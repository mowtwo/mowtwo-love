<script lang="ts">
  import type { Data } from "$lib/utils/type";
  import dayjs from "$lib/utils/dayjs";
  import { fly } from "svelte/transition";
  import { getNotificationsContext } from "svelte-notifications";
  import Viewer from "viewerjs";
  import "viewerjs/dist/viewer.css";
  import { tick } from "svelte";
  // @ts-ignore
  import QRCode from "qrcode";
  import html2canvas from "html2canvas";

  const { addNotification } = getNotificationsContext();

  export let data: Data;

  let hideNavBar = false;

  let snapping = false;

  let snappingCanvas: HTMLCanvasElement;

  let snapTarget: HTMLDivElement;

  let scroll_timer: number | NodeJS.Timeout;

  const toggleScroll = () => {
    clearTimeout(scroll_timer);
    hideNavBar = true;
    scroll_timer = setTimeout(() => {
      hideNavBar = false;
    }, 1500);
  };

  const shareHandle = async () => {
    try {
      const shareData: ShareData = {
        title: `陈爱上杨`,
        text: data.title ?? "一则小故事",
        url: location.href,
      };

      await navigator.share(shareData);
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

  const imageViewer = (
    target: HTMLImageElement,
    options: Viewer.Options = {}
  ) => {
    const viewer = new Viewer(target, {
      ...options,
      toolbar: false,
      navbar: false,
      hidden(e) {
        viewer.destroy();
        hideNavBar = false;
        options?.hidden?.(e);
      },
      show(e) {
        hideNavBar = true;
        options?.show?.(e);
      },
    });
    viewer.show();
    return viewer;
  };

  const contentClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLImageElement) {
      imageViewer(e.target);
    }
  };

  const addImageTitle = (target: HTMLImageElement) => {
    if (target.hasAttribute("title")) {
      return;
    }
    target.setAttribute("title", `点击放大图片：${target.src}`);
  };

  const contentHover = (e: MouseEvent) => {
    if (e.target instanceof HTMLImageElement) {
      addImageTitle(e.target);
    }
  };

  const snapPage = async () => {
    snapping = true;
    await tick();
    // @ts-ignore
    QRCode.toCanvas(snappingCanvas, location.href, (err) => {
      if (err) {
        console.log(err);
        addNotification({
          text: "截图出了点问题，再试试吧",
          position: "top-center",
          type: "warning",
        });
        return;
      }
    });
    const snapResult = await html2canvas(snapTarget);
    const img = new Image();
    img.src = snapResult.toDataURL("image/png");
    img.addEventListener("load", async () => {
      imageViewer(img, {
        hidden() {
          snapping = false;
        },
      });
      try {
        snapResult.toBlob(async (blob) => {
          if (!blob) {
            return;
          }
          try {
            const shareData: ShareData = {
              title: `陈爱上杨`,
              text: data.title ?? "一则小故事",
              files: [
                new File([blob], `陈爱上杨-${data.title ?? "一则小故事"}.png`, {
                  type: blob.type,
                }),
              ],
            };

            await navigator.share(shareData);
            addNotification({
              text: "分享成功",
              position: "top-center",
              type: "success",
            });
          } catch (e) {
            console.log(e);
            addNotification({
              text: "分享出了点问题，再试试吧",
              position: "top-center",
              type: "warning",
            });
          } finally {
            snapping = false;
          }
        }, "image/png");
      } catch {
        addNotification({
          text: "截图出了点问题，再试试吧",
          position: "top-center",
          type: "warning",
        });
      } finally {
        snapping = false;
      }
    });
  };
</script>

<svelte:head>
  <title>时间线：{data.title}</title>
</svelte:head>

<svelte:window on:scroll={toggleScroll} />

<div bind:this={snapTarget}>
  <article
    class="max-w-200 ma {hideNavBar || snapping ? 'mb-0' : 'mb-20'} {snapping
      ? 'max-h-200 overflow-hidden'
      : ''}"
  >
    <h1 class="text-center">{data.title}</h1>
    <div class="text-right">
      <div class="flex items-center justify-center text-3.5 text-gray gap-3">
        <span>开始于：{dayjs(data.startedDate).format("YYYY-MM-DD")}</span>
        {#if data.finished}
          <div class="w-.4 h-4 bg-gray" />
          <b>完成于：{dayjs(data.finishedDate).format("YYYY-MM-DD")}</b>
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

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <section
      class="post-content p-2"
      on:click={contentClick}
      on:mouseover={contentHover}
    >
      <svelte:component this={data.content} />
    </section>
  </article>
  {#if snapping}
    <hr />
    <div class="mt-5 pt-5 flex items-end">
      <canvas bind:this={snappingCanvas} class="flex-shrink-0" />
      <div class="ml-4">👈扫描二维码，查看完整文章内容</div>
    </div>
    <hr />
    <div class="mt-5 text-center">这里是陈先生与杨女士的爱情小站</div>
  {/if}
</div>

{#if !hideNavBar && !snapping}
  <div
    transition:fly={{ y: 100 }}
    class="w-98% h-18 fixed bottom-2 left-50% translate-x--50% bg-white shadow rd-4"
  >
    <div class="w-100% h-100% flex items-center justify-between">
      <a
        href="/"
        class="flex items-center ml-4 no-underline text-white p-2 rd-2 bg-blue h-5"
      >
        <div class="i-carbon-home mr-1 text-5" />
        首页
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="flex items-center text-white p-2 rd-2 bg-blue  h-5"
        on:click={snapPage}
      >
        <div class="i-carbon-qr-code text-5 mr-1" />
        截图
      </div>
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
      cursor: pointer;
    }
    :global(p) {
      line-height: 1.4rem;
    }
  }
</style>
