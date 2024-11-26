const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

client.once('ready', async () => {
    console.log('Bot está online!');

    const guild = client.guilds.cache.first();

    try {
        const ping = await guild.commands.create(
            new SlashCommandBuilder()
                .setName('ku')
                .setDescription('Exibe informações do personagem')
                .addStringOption(option =>
                    option.setName('nome')
                        .setDescription('Nome do personagem')
                        .setRequired(true)
                )
        );
        const shutdown = await guild.commands.create(
            new SlashCommandBuilder()
                .setName('shutdown')
                .setDescription('Desativa o bot')
                .addStringOption(option =>
                    option.setName('senha')
                        .setDescription('Senha para poder desligar o bot')
                        .setRequired(true)
                )
        );
        console.log('Comandos registrados no servidor!');
    } catch (error) {
        console.error('Erro ao registrar o comando:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'shutdown') {
        const senha = interaction.options.getString('senha');

        if (senha === '123456') {
            await interaction.reply('Bot desligado!');
            client.destroy();
        } else {
            await interaction.reply('Senha errada!');
        }
    }
    if (interaction.commandName === 'ku') {
        const nome = interaction.options.getString('nome');
        let personagem;

        try {
            personagem = require(path.resolve(__dirname, 'personagens', `${nome}.js`));
        } catch (error) {
            return interaction.reply({ content: 'Personagem não encontrado!', ephemeral: true });
        }

        const pingEmbed = new EmbedBuilder()
            .setColor('#33f1ff')
            .setTitle(personagem.name)
            .addFields(
                { name: `Raridade`, value: personagem.rarity, inline: false },
            )
            .addFields(
                { name: `Elemento`, value: personagem.element, inline: true },
                { name: `Arma`, value: personagem.gun, inline: true },
                { name: `Localização`, value: personagem.location, inline: true },
            )
            .setThumbnail(personagem.miniimage)
            .setImage(personagem.image)
            .setFooter({
                text: 'Informações sobre o bot',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [pingEmbed] });
    }
});

client.login('MTMxMDcyODY5MTQzMjY4OTcwNA.G-Qku5.uDz17rlVoC6Lmg9GtuwBoB5xgJhOcp3DA-Q2QY').catch(err => console.error('Erro ao fazer login:', err));
