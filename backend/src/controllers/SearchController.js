const Dev = require('../models/Dev');
const parseStringAsArray = require ('../utils/parseStringAsArray');

module.exports = {
  // buscar todos devs num raio 10km
  // filtrar por tecnologias
  async index(request, response) {
    const { latitude, longitude, techs } = request.query;
    
    const techsArray = parseStringAsArray(techs);
    
    const devs = await Dev.find({
      techs: {
        $in: techsArray, // o operador lógico IN do Mongo-> contem (dentro de)
      },
      location: {
        $near: { // que estejam próximos ($near -> outro operador lógico do Mongo)
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // 10km
        },
      },
    });

    return response.json({ devs });
  }
}