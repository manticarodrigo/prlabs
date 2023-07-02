export function mostCommonString(strings: string[]): string | null {
  if (!strings.length) return null // Return null if array is empty

  let stringFrequency = new Map<string, number>()
  let maxCount = 0
  let mostCommon = ''

  for (let str of strings) {
    let currentCount = (stringFrequency.get(str) || 0) + 1
    stringFrequency.set(str, currentCount)

    if (currentCount > maxCount) {
      maxCount = currentCount
      mostCommon = str
    }
  }

  return mostCommon
}
