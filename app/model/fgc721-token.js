module.exports = app => {
  const {CHAR} = app.Sequelize

  let FGC721Token = app.model.define('fgc721_token', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    tokenId: {
      type: CHAR(32).BINARY,
      primaryKey: true
    },
    holder: CHAR(20).BINARY
  }, {freezeTableName: true, underscored: true, timestamps: false})

  FGC721Token.associate = () => {
    const {Contract} = app.model
    Contract.hasMany(FGC721Token, {as: 'fgc721Tokens', foreignKey: 'contractAddress'})
    FGC721Token.belongsTo(Contract, {as: 'contract', foreignKey: 'contractAddress'})
  }

  return FGC721Token
}
