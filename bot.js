const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { permission } = require('process');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {

    try {

        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(__dirname, 'commands', file));
            commands.push(command.data.toJSON());
        }

        client.guilds.cache.forEach(async (guild) => {
            try {
                const existingCommands = await guild.commands.fetch();
                for (const command of existingCommands.values()) {
                    await guild.commands.delete(command.id);
                }

                guild.commands.cache.clear();

                await guild.commands.set(commands);
                console.log(`Comandos registrados com sucesso na guilda: ${guild.name}`);
            } catch (error) {
                console.error(`Erro ao registrar comandos na guilda ${guild.name}:`, error);
            }
        });
        console.log('Bot está online!');
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