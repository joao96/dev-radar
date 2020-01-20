const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require ('../utils/parseStringAsArray');
/* o Controller pode ter, no máximo, 5 funções
  index, show, store, update, destroy
*/
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
  
    // checar a existência prévia do dev no banco antes de cadastrar
    let dev = await Dev.findOne({ github_username });

    if(!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
      // se o name não estiver disponível na API, usar o login como name (condicional)
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
      // cria novo dev
      dev = await Dev.create({
        github_username, 
        name, 
        avatar_url, 
        bio, 
        techs: techsArray,
        location,
      })

      // filtrar as conexões que está há no máximo 10km de distância
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas no mobile
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )
      
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }
    return response.json(dev);
  }
};