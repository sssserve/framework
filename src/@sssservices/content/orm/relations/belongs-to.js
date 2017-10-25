module.exports = function belongsTo(relation, foreign, local) {
  const instance = new relation()

  foreign = foreign || instance.getKeyName()
  local = local || instance.getForeignKey()

  const value = function() {
    const result = relation
      .filter(model => model.getAttribute(foreign) === this.getAttribute(local))
      .all()

    if (result.length) {
      return result[0]
    }
  }

  value.associate = association => {
    this.attributes[local] = association.getAttribute(foreign)

    return this
  }

  return value
}
