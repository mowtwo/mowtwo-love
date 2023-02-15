export default async function getPostList() {
  const allPostFiles = await import.meta.glob('/src/posts/*.md')
  const postEntries = Object.entries(allPostFiles)

  const postList = await Promise.allSettled(
    postEntries.map(async ([path, resolver]) => {
      return {
        path,
        markdown: await resolver()
      }
    })
  )
  return postList.map(item => {
    if (item.status === 'fulfilled') {
      return item.value
    }
  }).filter(item => !!item)
}
