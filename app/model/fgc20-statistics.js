module.exports = app => {
  const {INTEGER, CHAR} = app.Sequelize

  let FGC20Statistics = app.model.define('fgc20_statistics', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    holders: INTEGER.UNSIGNED,
    transactions: INTEGER.UNSIGNED
  }, {freezeTableName: true, underscored: true, timestamps: false})

  FGC20Statistics.associate = () => {
    const {Fgc20: FGC20} = app.model
    FGC20Statistics.belongsTo(FGC20, {as: 'fgc20', foreignKey: 'contractAddress'})
    FGC20.hasOne(FGC20Statistics, {as: 'statistics', foreignKey: 'contractAddress'})
  }

  return FGC20Statistics
}
