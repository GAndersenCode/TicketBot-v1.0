const { Collection, Client } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'REACTION'] });
client.commands = new Collection();
require('dotenv').config();
const fs = require('fs');

const prefix = process.env.prefix;

const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const eventFunction = require(`./events/${file}`);

    if (eventFunction.disabled) return;

    const event = eventFunction.event || file.split('.')[0];
    const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
    const once = eventFunction.once;

    try {
        emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args, client, prefix));
    } catch (error) {
        console.error(error.stack);
    }
}

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}



client.login(process.env.token);