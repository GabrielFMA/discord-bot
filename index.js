const { Client, GatewayIntentBits } = require('discord.js');
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
    if (!interaction.isCommand()) return;

    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        await command.execute(interaction, client);
    }
});

client.login('MTMxMDcyODY5MTQzMjY4OTcwNA.G-Qku5.uDz17rlVoC6Lmg9GtuwBoB5xgJhOcp3DA-Q2QY').catch(err => console.error('Falha ao fazer login:', err));
