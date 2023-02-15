import type { Load } from "@sveltejs/kit"

export const prerender = true
export const ssr = true

export const load: Load = async ({ params }) => {
  const post = await import(`../../../posts/${params.slug}.md`)
  const content = post.default
  const { title, startedDate, finished, finisheDate, location, type } = post.metadata

  return {
    title, startedDate, finished, finisheDate, location, content, type
  }
}
