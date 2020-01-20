// aqui ficam as entidades do banco
const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

// schema -> estruturação de uma entidade no banco
const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String, 
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    index: '2dsphere',
  }
});

module.exports = mongoose.model('Dev', DevSchema);