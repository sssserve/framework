module.exports = function hasMany(relation, foreign, local) {
  foreign = foreign || this.getForeignKey()
  local = local || this.getKeyName()

  const query = relation.filter(model => {
    return model.getAttribute(foreign) === this.getAttribute(local)
  })

  const value = function() {
    return query.all()
  }

  for (const key in query) {
    if (typeof query[key] === 'function') {
      value[key] = query[key].bind(query)
    }
  }

  return value
}
