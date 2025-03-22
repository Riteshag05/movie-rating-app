const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    timestamps: true
  });

  return Like;
}; 