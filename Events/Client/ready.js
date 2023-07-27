const {Client} = require('discord.js');
const config = require("../../config.json");

module.exports = {
    name: 'ready',
      once:true,
      async execute(client){
        console.log(`Logged in as ${client.user.tag}`);
      }
}