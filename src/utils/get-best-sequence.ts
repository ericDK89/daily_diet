import { isWithin24h } from './is-within-24h'

interface ITable {
  id: string
  user_id: string
  name: string
  description: string
  within_the_diet: boolean
  created_at: string
}

export const getBestSequence = (table: ITable[]): number => {
  let bestSequence = []
  for (const item of table) {
    if (item.within_the_diet && bestSequence.length === 0) {
      bestSequence.push(item)
    } else if (item.within_the_diet && bestSequence.length > 0) {
      if (isWithin24h(bestSequence[bestSequence.length - 1].created_at, item.created_at)) {
        bestSequence.push(item)
      } else {
        bestSequence = []
      }
    } else {
      bestSequence = []
    }
  }

  return bestSequence.length
}
