export function shortestPath(relations, startId, targetId, type = 'all') {
  if (!startId || !targetId) return { nodeIds: [], edgeIds: [] }
  if (startId === targetId) return { nodeIds: [startId], edgeIds: [] }
  const adjacency = new Map()
  for (const relation of relations) {
    if (type !== 'all' && relation.type !== type) continue
    addNeighbor(adjacency, relation.source, relation.target, relation.id)
    addNeighbor(adjacency, relation.target, relation.source, relation.id)
  }
  const queue = [startId]
  const previous = new Map([[startId, null]])
  while (queue.length > 0) {
    const current = queue.shift()
    for (const next of adjacency.get(current) || []) {
      if (previous.has(next.id)) continue
      previous.set(next.id, { id: current, edgeId: next.edgeId })
      if (next.id === targetId) return restorePath(previous, targetId)
      queue.push(next.id)
    }
  }
  return { nodeIds: [], edgeIds: [] }
}

export function compareKeywordSets(chapters, chapterIds) {
  const selected = chapterIds.map((id) => chapters.find((chapter) => chapter.id === id)).filter(Boolean).slice(0, 3)
  const counts = new Map()
  for (const chapter of selected) for (const word of chapter.keywords || []) counts.set(word.term, (counts.get(word.term) || 0) + 1)
  const shared = new Set([...counts].filter(([, count]) => count > 1).map(([term]) => term))
  return { selected, shared }
}

function addNeighbor(adjacency, source, target, edgeId) {
  const values = adjacency.get(source) || []
  values.push({ id: target, edgeId })
  adjacency.set(source, values)
}

function restorePath(previous, targetId) {
  const nodeIds = []
  const edgeIds = []
  let current = targetId
  while (current) {
    nodeIds.push(current)
    const item = previous.get(current)
    if (item?.edgeId) edgeIds.push(item.edgeId)
    current = item?.id || null
  }
  return { nodeIds: nodeIds.reverse(), edgeIds: edgeIds.reverse() }
}
