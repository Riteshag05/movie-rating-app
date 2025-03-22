const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const User = require('./userModel')(sequelize);
const Movie = require('./movieModel')(sequelize);
const Review = require('./reviewModel')(sequelize);
const Like = require('./likeModel')(sequelize);

// Associations
User.hasMany(Review);
Review.belongsTo(User);

Movie.hasMany(Review);
Review.belongsTo(Movie);

User.hasMany(Like);
Like.belongsTo(User);

Review.hasMany(Like);
Like.belongsTo(Review);

module.exports = {
  sequelize,
  User,
  Movie,
  Review,
  Like
}; 