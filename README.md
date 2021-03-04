# Getting started with TicketBot v1.0 - code

This code requires you to install three npm packages; discord.js, dotenv and mongoose. Just copy the code (clone the repo) and add a .env file to the root.
There should be two variables to start with:

token=YOUR_BOTS_TOKEN\
prefix=YOUR_PREFIX

### `npm install`
will install the packages required.

Your bot needs some permissions:\
VIEW_CHANNELS, SEND_MESSAGES, ADD_REACTIONS, MANAGE_CHANNELS, at least

>For now there is no use of a database, but it will be based on MongoDB and mongoose. Mongoose is installed, but it's not used just yet.

When you have the bot up and running, you first need to use the setup command in a channel.\
This will create the channel in which people can react to a message to create their own support ticket.

Example (assuming your prefix is ?):
### `?setup 582329449601564673`
This assumes that 582329449601564673 is the ID of the parent category, inside which the users can react to a message.
The bot will check if the channel exists first, and not try to create another.

When the setup command finishes and the new tickets channel is created, a new variable is automatically added to the .env file.
**In order to further use the bot, it is IMPORTANT that you restart the bot!!**

If a user reacts with the 📨 emoji in the tickets channel, a new support channel is created.\
NB! This new support channel is created at the root level (top), and only the user and owner/admin can see the ticket.

When a user reacts to the message, a new channel is created and an embed is sent to the new channel.\
If the user reacts to the first embed with the ❌ emoji, the permissions are overwritten and the user looses access to the channel.
Owner/admin can still see the channel.

**NB! Because this simple bot doesn't use a database to store tickets, there is no way of checking if the ❌ was "added" to the first message of the channel.
Because of this; if, at any point in the ticket channel, a reaction with the ❌ is added, the ticket is closed!\
This could easily be solved by using a database (like MySQL or MongoDB) but was out of the scope of this simple test.**


That's about it for now, but I might add more later.\
Something like a transcript function and an easy way of deleting the channel once everything is concluded.\

If you have questions, you can always get in touch with me on Discord.\
Join us over a [Ansons Discord server: Code Ring](https://discord.gg/7f3ZQRekHM)\
My user is: GeirAndersen#0001