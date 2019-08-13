const {Controller} = require('egg')

class ContractController extends Controller {
  async summary() {
    const {ctx} = this
    let summary = await ctx.service.contract.getContractSummary(
      ctx.state.contract.contractAddress, ctx.state.contract.addressIds
    )
    ctx.body = {
      address: summary.address,
      addressHex: summary.addressHex.toString('hex'),
      vm: summary.vm,
      type: summary.type,
      ...summary.type === 'fgc20' ? {
        fgc20: {
          name: summary.fgc20.name,
          symbol: summary.fgc20.symbol,
          decimals: summary.fgc20.decimals,
          totalSupply: summary.fgc20.totalSupply.toString(),
          version: summary.fgc20.version,
          holders: summary.fgc20.holders,
          transactions: summary.fgc20.transactions
        }
      } : {},
      ...summary.type === 'fgc721' ? {
        fgc721: {
          name: summary.fgc721.name,
          symbol: summary.fgc721.symbol,
          totalSupply: summary.fgc721.totalSupply.toString()
        }
      } : {},
      balance: summary.balance.toString(),
      totalReceived: summary.totalReceived.toString(),
      totalSent: summary.totalSent.toString(),
      unconfirmed: summary.unconfirmed.toString(),
      fgc20Balances: summary.fgc20Balances.map(item => ({
        address: item.address,
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        decimals: item.decimals,
        balance: item.balance.toString()
      })),
      fgc721Balances: summary.fgc721Balances.map(item => ({
        address: item.address,
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        count: item.count
      })),
      transactionCount: summary.transactionCount
    }
  }

  async transactions() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.contract.getContractTransactions(
      ctx.state.contract.contractAddress, ctx.state.contract.addressIds
    )
    ctx.body = {
      totalCount,
      transactions: transactions.map(id => id.toString('hex'))
    }
  }

  async basicTransactions() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.contract.getContractBasicTransactions(ctx.state.contract.contractAddress)
    ctx.body = {
      totalCount,
      transactions: transactions.map(transaction => ({
        transactionId: transaction.transactionId.toString('hex'),
        outputIndex: transaction.outputIndex,
        blockHeight: transaction.blockHeight,
        blockHash: transaction.blockHash && transaction.blockHash.toString('hex'),
        timestamp: transaction.timestamp,
        confirmations: transaction.confirmations,
        type: transaction.scriptPubKey.type,
        gasLimit: transaction.scriptPubKey.gasLimit,
        gasPrice: transaction.scriptPubKey.gasPrice,
        byteCode: transaction.scriptPubKey.byteCode.toString('hex'),
        outputValue: transaction.value.toString(),
        sender: transaction.sender.toString(),
        gasUsed: transaction.gasUsed,
        contractAddress: transaction.contractAddress,
        contractAddressHex: transaction.contractAddressHex.toString('hex'),
        excepted: transaction.excepted,
        exceptedMessage: transaction.exceptedMessage,
        evmLogs: transaction.evmLogs.map(log => ({
          address: log.address,
          addressHex: log.addressHex.toString('hex'),
          topics: log.topics.map(topic => topic.toString('hex')),
          data: log.data.toString('hex')
        }))
      }))
    }
  }

  async balanceHistory() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.balance.getBalanceHistory(ctx.state.contract.addressIds, {nonZero: true})
    ctx.body = {
      totalCount,
      transactions: transactions.map(tx => ({
        id: tx.id.toString('hex'),
        ...tx.block ? {
          blockHash: tx.block.hash.toString('hex'),
          blockHeight: tx.block.height,
          timestamp: tx.block.timestamp
        } : {},
        amount: tx.amount.toString(),
        balance: tx.balance.toString()
      }))
    }
  }

  async fgc20BalanceHistory() {
    let {ctx} = this
    let tokenAddress = null
    if (ctx.state.token) {
      if (ctx.state.token.type === 'fgc20') {
        tokenAddress = ctx.state.token.contractAddress
      } else {
        ctx.body = {
          totalCount: 0,
          transactions: []
        }
        return
      }
    }
    let {totalCount, transactions} = await ctx.service.fgc20.getFGC20BalanceHistory([ctx.state.contract.contractAddress], tokenAddress)
    ctx.body = {
      totalCount,
      transactions: transactions.map(tx => ({
        id: tx.id.toString('hex'),
        hash: tx.block.hash.toString('hex'),
        height: tx.block.height,
        timestamp: tx.block.timestamp,
        tokens: tx.tokens.map(item => ({
          address: item.address,
          addressHex: item.addressHex.toString('hex'),
          name: item.name,
          symbol: item.symbol,
          decimals: item.decimals,
          amount: item.amount.toString(),
          balance: item.balance.toString()
        }))
      }))
    }
  }

  async callContract() {
    const {Address} = this.app.fantasygoldinfo.lib
    let {ctx} = this
    let {data, sender} = ctx.query
    ctx.assert(ctx.state.contract.vm === 'evm', 400)
    ctx.assert(/^([0-9a-f]{2})+$/i.test(data), 400)
    if (sender != null) {
      try {
        let address = Address.fromString(sender, this.app.chain)
        if ([Address.PAY_TO_PUBLIC_KEY_HASH, Address.CONTRACT, Address.EVM_CONTRACT].includes(address.type)) {
          sender = address.data
        } else {
          ctx.throw(400)
        }
      } catch (err) {
        ctx.throw(400)
      }
    }
    ctx.body = await ctx.service.contract.callContract(ctx.state.contract.contractAddress, data, sender)
  }

  async searchLogs() {
    let {ctx} = this
    let {contract, topic1, topic2, topic3, topic4} = this.ctx.query
    if (contract != null) {
      contract = (await ctx.service.contract.getContractAddresses([contract]))[0]
    }
    if (topic1 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic1)) {
        topic1 = Buffer.from(topic1, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic2 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic2)) {
        topic2 = Buffer.from(topic2, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic3 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic3)) {
        topic3 = Buffer.from(topic3, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic4 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic4)) {
        topic4 = Buffer.from(topic4, 'hex')
      } else {
        ctx.throw(400)
      }
    }

    let {totalCount, logs} = await ctx.service.contract.searchLogs({contract, topic1, topic2, topic3, topic4})
    ctx.body = {
      totalCount,
      logs: logs.map(log => ({
        transactionId: log.transactionId.toString('hex'),
        outputIndex: log.outputIndex,
        blockHash: log.blockHash.toString('hex'),
        blockHeight: log.blockHeight,
        timestamp: log.timestamp,
        sender: log.sender.toString(),
        contractAddress: log.contractAddress,
        contractAddressHex: log.contractAddressHex.toString('hex'),
        address: log.address,
        addressHex: log.addressHex.toString('hex'),
        topics: log.topics.map(topic => topic.toString('hex')),
        data: log.data.toString('hex')
      }))
    }
  }
}

module.exports = ContractController
