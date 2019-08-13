const path = require('path')

const CHAIN = Symbol('fantasygold.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.fantasygoldinfo.lib.Chain.get(this.config.fantasygold.chain)
    return this[CHAIN]
  },
  get fantasygoldinfo() {
    return {
      lib: require(path.resolve(this.config.fantasygoldinfo.path, 'lib')),
      rpc: require(path.resolve(this.config.fantasygoldinfo.path, 'rpc'))
    }
  }
}
