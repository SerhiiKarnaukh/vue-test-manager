export function error(data) {
  let arr = []
  for (const property in data) {
    arr = arr.concat(data[property])
  }
  return arr
}
