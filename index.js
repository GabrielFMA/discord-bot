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
        
        await guild.commands.set([]);

        const commands = [
            new SlashCommandBuilder()
                .setName('materialascensão')
                .setDescription('Exibe informações do personagem')
                .addStringOption(option =>
                    option.setName('ressonador')
                        .setDescription('Ressonadores')
                        .setRequired(true)
                ),
            new SlashCommandBuilder()
                .setName('shutdown')
                .setDescription('Desativa o bot')
                .addStringOption(option =>
                    option.setName('senha')
                        .setDescription('Senha para poder desligar o bot')
                        .setRequired(true)
                )
        ];

        await guild.commands.set(commands);
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
    if (interaction.commandName === 'materialascensão') {
        const nome = interaction.options.getString('ressonador');
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
