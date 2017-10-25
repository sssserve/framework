module.exports = function plural(value) {
  if (value.match(/y$/) !== null) {
    return value.replace(/y$/, 'ies')
  }

  return value + 's'
}
