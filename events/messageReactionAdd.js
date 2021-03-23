const { MessageEmbed } = require('discord.js');

module.exports = {
    event: "messageReactionAdd",
    once: false,
    // the actual function
    async run(reaction, user, client) {

        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        if (user.bot) return;
        if (!reaction.message.guild) return;

        if (reaction.message.channel.id === process.env.tickets) {
          let guild = reaction.message.guild;
            if (reaction.emoji.name === '📨') {
                let chanName = user.username.toLowerCase() + '-ticket';
                let channel = reaction.message.guild.channels.cache.some((ch) => ch.name === chanName);
                if (channel) {
                    user.send(`You already have an open ticket, please continue to use that!`);
                    reaction.message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user.id);
                } else {
                    //let cat = message.guild.channels.cache.find(c => c.id === '740772959479660616' && c.type === 'category');
                    let suppChan = await reaction.message.guild.channels.create(`${user.username}-ticket`, {
                        type: 'text',
                        permissionOverwrites: [
                            {
                                id: reaction.message.guild.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: user.id,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS'],
                            },
                            {
                                id: guild.me.roles.highest,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
                            },
                        ]
                    });
                    let firstEmbed = new MessageEmbed()
                        .setTitle(`Welcome to your support ticket!`)
                        .setDescription(`
                                This is where you as private questions, that only admins can view.\n
                                When you are finished with this ticket, please react with the ❌ emoji.\n
                                You can always open a new ticket later, should more questions come along.
                            `);
                    msg = await suppChan.send(firstEmbed);
                    msg.react('❌');
                    reaction.message.reactions.cache.find(r => r.emoji.name === reaction.emoji.name).users.remove(user.id);
                }
            }

        }
        if (reaction.emoji.name === '❌') {
            let ticket = reaction.message.guild.channels.cache.find(chan => chan.name === `${user.username.toLowerCase()}-ticket`);
            if (ticket) {
                if (reaction.message.channel.id === ticket.id) {
                    let ticketChan = reaction.message.guild.channels.cache.get(ticket.id);
                    await ticketChan.updateOverwrite(user.id, { deny: ['VIEW_CHANNEL', 'SEND_MESSAGE', 'ADD_REACTIONS'] });
                }
            }
        }

    }
};