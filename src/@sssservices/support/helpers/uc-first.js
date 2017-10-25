module.exports = function ucFirst(string) {
  if (!string) {
    return
  }

  string = string.toString()

  return string.charAt(0).toUpperCase() + string.slice(1)
}
