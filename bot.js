const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
    console.log('Bot está online!');

    const guild = client.guilds.cache.first();

    try {
        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, 'commands', file));
            await commands.push(command.data.toJSON());
        }

        await guild.commands.set(commands);
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    const command = commandFiles.find(file => require(path.join(__dirname, 'commands', file)).data.name === interaction.commandName);

    if (!command) return;

    const commandModule = require(path.join(__dirname, 'commands', command));

    if (interaction.isCommand()) {
        await commandModule.execute(interaction, client);
    } else if (interaction.isAutocomplete() && commandModule.autocomplete) {
        await commandModule.autocomplete(interaction);
    }
});


client.login(process.env.BOT_TOKEN).catch(err => console.error('Falha ao fazer login:', err));