import type { Load } from "@sveltejs/kit"

export const prerender = true
export const ssr = true

export const load: Load = async ({ params }) => {
  const post = await import(`../../../posts/${params.slug}.md`)
  const content = post.default
  const { title, startedDate, finished, finishedDate, location, type, poster } = post.metadata

  return {
    title, startedDate, finished, finishedDate, location, content, type, poster
  }
}
