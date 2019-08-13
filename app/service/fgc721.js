const {Service} = require('egg')

class FGC721Service extends Service {
  async listFGC721Tokens() {
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let {limit, offset} = this.ctx.state.pagination

    let [{totalCount}] = await db.query(sql`
      SELECT COUNT(DISTINCT(fgc721_token.contract_address)) AS count FROM fgc721_token
      INNER JOIN fgc721 USING (contract_address)
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    let list = await db.query(sql`
      SELECT
        contract.address_string AS address, contract.address AS addressHex,
        fgc721.name AS name, fgc721.symbol AS symbol, fgc721.total_supply AS totalSupply,
        list.holders AS holders
      FROM (
        SELECT contract_address, COUNT(*) AS holders FROM fgc721_token
        INNER JOIN fgc721 USING (contract_address)
        GROUP BY contract_address
        ORDER BY holders DESC
        LIMIT ${offset}, ${limit}
      ) list
      INNER JOIN fgc721 USING (contract_address)
      INNER JOIN contract ON contract.address = list.contract_address
      ORDER BY holders DESC
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})

    return {
      totalCount,
      tokens: list.map(item => ({
        address: item.address,
        addressHex: item.addressHex,
        name: item.name.toString(),
        symbol: item.symbol.toString(),
        totalSupply: BigInt(`0x${item.totalSupply.toString('hex')}`),
        holders: item.holders
      }))
    }
  }

  async getAllFGC721Balances(hexAddresses) {
    if (hexAddresses.length === 0) {
      return []
    }
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let list = await db.query(sql`
      SELECT
        contract.address AS addressHex, contract.address_string AS address,
        fgc721.name AS name,
        fgc721.symbol AS symbol,
        fgc721_token.count AS count
      FROM (
        SELECT contract_address, COUNT(*) AS count FROM fgc721_token
        WHERE holder IN ${hexAddresses}
        GROUP BY contract_address
      ) fgc721_token
      INNER JOIN contract ON contract.address = fgc721_token.contract_address
      INNER JOIN fgc721 ON fgc721.contract_address = fgc721_token.contract_address
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    return list.map(item => ({
      address: item.address,
      addressHex: item.addressHex,
      name: item.name.toString(),
      symbol: item.symbol.toString(),
      count: item.count
    }))
  }
}

module.exports = FGC721Service
