const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    name: 'setup',
    description: 'Setup for the TicketBot',
    guildOnly: true,
    args: false,
    aliases: ['start'],
    usage: '?setup PARENT-ID',
    async execute(message, args, client) {
        let ticketChan = message.guild.channels.cache.find(c => c.name === 'tickets' && c.type === 'text');
        let parent = message.guild.channels.cache.get(args[0]);
        let env = await fs.readFile('./.env', 'utf-8');
        if (!ticketChan) {
            let ticketOpen = await message.guild.channels.create(`tickets`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    },
                ]
            });
            if (parent){
                ticketOpen.setParent(parent, { lockPermissions: false });
            } else {
                message.channel.send(`Please type in the ID of the parent to the channel where users open tickets!`);
                let filter = m => m.author.id === message.author.id;
                let answer = (await message.channel.awaitMessages(filter, { max: 1, time: 15000})).first().content;
                if (answer){
                    ticketOpen.setParent(answer, { lockPermissions: false });
                }
            }
            env += `\ntickets=${ticketOpen.id}`;
            await fs.writeFile('./.env', env, 'utf-8');
            let firstEmbed = new MessageEmbed()
                .setTitle(`Create your support ticket!`)
                .setDescription(`React with the 📨 emoji to open your personal ticket!`);
            let firstMessage = await ticketOpen.send(firstEmbed);
            await firstMessage.react('📨');
            message.channel.send(`Your channels was created and the variable: tickets was added to you .env file!`);

        } else {
            message.channel.send(`Looks like you already have a channel named: \`tickets\`!`);
        }
    }
}