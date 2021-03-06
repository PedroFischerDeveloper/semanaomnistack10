const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket');

module.exports = {
    async index (request, response) {
        const devs = await Dev.find();
        return response.json({'devs':devs});
    },

    async store (request, response) {
        const {github_username, techs, latitude, longitude} = request.body;
        
        const devExists = await Dev.findOne({ github_username}); 

        if(devExists) {
            return response.json({error: 'O usuário já foi cadastrado!'});
        }

        const responseGithubUser = await axios.get(`https://api.github.com/users/${github_username}`);
    
        // se não existir name atribui o login
        const { name = login, avatar_url, bio} = responseGithubUser.data;
    
        // previnindo espaçamento desnecessário
        const techsArray = parseStringAsArray(techs);
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
    
        const dev = await Dev.create({
            github_username,
            name, 
            avatar_url,
            bio,
            techs: techsArray,
            location
        });

        const sendSocketMessageTo = findConnections(
            {latitude, longitude}, 
            techsArray,
        );

        sendMessage(sendSocketMessageTo, 'new-dev', dev);

        return response.json(dev);
    }
}