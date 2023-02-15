import getPostList from "$lib/utils/post-list"
import { json } from "@sveltejs/kit"

export const GET = async () => {
  const postList = await getPostList()


  return json(postList.map(item => {
    return (item?.markdown as any).metadata
  }).sort((a, b) => new Date(a.startedDate).valueOf() - new Date(b.startedDate).valueOf()))
}
