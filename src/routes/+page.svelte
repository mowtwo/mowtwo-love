<script lang="ts">
  import dayjs from "$lib/utils/dayjs";
  import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
  } from "svelte-vertical-timeline";

  export let data: { metadataList: Array<any> };
</script>

<svelte:head>
  <title>陈先生爱着杨女士</title>
</svelte:head>

<div>
  <div class="max-w-100 ma">
    <Timeline position="alternate">
      {#each data.metadataList as item (item.title)}
        <a href="/post/{item.title}" class="text-black no-underline">
          <TimelineItem>
            <TimelineOppositeContent slot="opposite-content">
              <p
                class="text-4 text-gray {item.finished
                  ? 'line-through text-gray-300'
                  : 'text-blue'}"
              >
                <b>开始于：</b>{dayjs(item.startedDate).format("YYYY-MM-DD")}
              </p>
              {#if item.finished}
                <p class="text-green-600">
                  <b> 完成于：</b>{dayjs(item.finishedDate).format(
                    "YYYY-MM-DD"
                  )}
                </p>
              {/if}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                style="display:flex;align-items:center;justify-content:center;background:none;border:none;"
              >
                <div class="relative text-14">
                  {#if item.type === "eat"}
                    <div class="i-carbon-restaurant  text-pink" />
                  {:else}
                    <div class="i-carbon-recently-viewed text-blue" />
                  {/if}
                  {#if item.finished}
                    <div
                      class="flex absolute text-5 top--4 right--3 rd-100% bg-green w-7 h-7 items-center justify-center text-white op-80"
                    >
                      <div class="i-carbon-ai-status-complete" />
                    </div>
                  {/if}
                </div>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <h3 class="text-dark">{item.title}</h3>
              <div class="text-gray-600 text-3 lh-4">
                <div
                  class="i-carbon-location inline-block text-blue-600 text-5 v-middle"
                />
                {item.location}
              </div>
            </TimelineContent>
          </TimelineItem>
        </a>
      {/each}
    </Timeline>
  </div>
</div>

<style>
  :global(body) {
    background-color: #fff;
  }
</style>
