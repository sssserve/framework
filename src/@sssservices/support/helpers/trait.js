module.exports = function trait(base, trait) {
  Object.assign(base, trait)
  Object.assign(base.prototype, trait.prototype)
}
