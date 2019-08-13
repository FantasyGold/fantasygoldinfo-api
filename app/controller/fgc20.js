const {Controller} = require('egg')

class FGC20Controller extends Controller {
  async list() {
    const {ctx} = this
    let {totalCount, tokens} = await ctx.service.fgc20.listFGC20Tokens()
    ctx.body = {
      totalCount,
      tokens: tokens.map(item => ({
        address: item.address,
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        decimals: item.decimals,
        totalSupply: item.totalSupply.toString(),
        version: item.version,
        holders: item.holders,
        transactions: item.transactions
      }))
    }
  }

  async transactions() {
    const {ctx} = this
    ctx.assert(ctx.state.token.type === 'fgc20', 404)
    let {totalCount, transactions} = await ctx.service.fgc20.getFGC20TokenTransactions(ctx.state.token.contractAddress)
    ctx.body = {
      totalCount,
      transactions: transactions.map(transaction => ({
        transactionId: transaction.transactionId.toString('hex'),
        outputIndex: transaction.outputIndex,
        blockHeight: transaction.blockHeight,
        blockHash: transaction.blockHash.toString('hex'),
        timestamp: transaction.timestamp,
        from: transaction.from,
        fromHex: transaction.fromHex && transaction.fromHex.toString('hex'),
        to: transaction.to,
        toHex: transaction.toHex && transaction.toHex.toString('hex'),
        value: transaction.value.toString()
      }))
    }
  }

  async richList() {
    const {ctx} = this
    ctx.assert(ctx.state.token.type === 'fgc20', 404)
    let {totalCount, list} = await ctx.service.fgc20.getFGC20TokenRichList(ctx.state.token.contractAddress)
    ctx.body = {
      totalCount,
      list: list.map(item => ({
        address: item.address,
        addressHex: item.addressHex,
        balance: item.balance.toString()
      }))
    }
  }
}

module.exports = FGC20Controller
