import type { Load } from "@sveltejs/kit"

export const prerender = true

export const load: Load = async ({ fetch }) => {
  const metadataList = await (await fetch('/api/posts.json')).json()
  console.log()
  return {
    metadataList
  }
}
