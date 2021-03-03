const discord = require('discord.js');

module.exports = {
    // we want a message event
    event: "message",
    // we want it to trigger multiple times
    once: false,
    // the actual function
    async run(message, client, prefix) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (command) {
            if (command.guildOnly && message.channel.type !== 'text') {
                return message.reply(`I can't execute that command inside DMs!`);
            }

            if (command.args && !args.length) {
                let reply = `You didn't provide any arguments, ${message.author}!`;
                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${command.usage}\``;
                }
                return message.channel.send(reply);
            }

            try {
                command.execute(message, args, client);
            }
            catch (error) {
                console.error(error);
                message.reply('There was an error trying to execute that command!');
            }
        }
    }
}