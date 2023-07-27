const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');

const {Guilds, GuildMembers, GuildMessages,MessageContent,GuildMessageReactions} = GatewayIntentBits;
const {User, Message, GuildMember,ThreadMember, Channel,SendMessages} = Partials;

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages,MessageContent,GuildMessageReactions],
    partials: [User, Message, GuildMember, ThreadMember,SendMessages],
});

client.commands = new Collection();
client.config = require('./config.json');

client.login(client.config.Token).then(() => {
    loadEvents(client);
    loadCommands(client);

});
module.exports = client;