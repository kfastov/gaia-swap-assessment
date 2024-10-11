// models/Event.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Adjust the path as necessary

class Event extends Model {}

Event.init({
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  swapper: {
    type: DataTypes.STRING,
    allowNull: true, // Some events might not have a swapper
  },
  tokenIn: {
    type: DataTypes.STRING,
    allowNull: true, // Only relevant for Swap events
  },
  tokenOut: {
    type: DataTypes.STRING,
    allowNull: true, // Only relevant for Swap events
  },
  amount0: {
    type: DataTypes.BIGINT,
    allowNull: true, // Relevant for Liquidity events
  },
  amount1: {
    type: DataTypes.BIGINT,
    allowNull: true, // Relevant for Liquidity events
  },
  amountIn: {
    type: DataTypes.BIGINT,
    allowNull: true, // Only relevant for Swap events
  },
  amountOut: {
    type: DataTypes.BIGINT,
    allowNull: true, // Only relevant for Swap events
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blockNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Event',
});

module.exports = Event;