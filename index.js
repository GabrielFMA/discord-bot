const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
                .setName('ping')
                .setDescription('Responde com Pong! Exibe informações adicionais')
        );
        const shutdown = await guild.commands.create(
            new SlashCommandBuilder()
                .setName('shutdown')
                .setDescription('Desativa o bot')
        );
        console.log('Comando /ping registrado no servidor!');
    } catch (error) {
        console.error('Erro ao registrar o comando:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'shutdown') {
        client.destroy();
    }
    if (interaction.commandName === 'ping') {

        const pingEmbed = new EmbedBuilder()
            .setColor('#088A08')
            .setTitle('Pamonhas!')
            .addFields(
                { name: 'Letícia', value: 'Conhecido mais como Shizu. <:Black_Shores_Emblem:1309710724284551178>', inline: true },
                { name: 'Gabriel', value: 'Conhecido mais como Anayki. <:Huanglong_Emblem:1309707973060333669>', inline: true },
                { name: 'Localização', value: 'Brasil', inline: true }
            )
            .setThumbnail('https://cdn.discordapp.com/attachments/1273496005484216390/1310758140953759744/Black_Shores_Emblem.webp?ex=67466225&is=674510a5&hm=542589e6591749b78002084275e1c074df613f12fc64509101ba2afac8365a0b&') // Imagem pequena à direita
            .setImage('https://cdn.discordapp.com/attachments/1273496005484216390/1310758140953759744/Black_Shores_Emblem.webp?ex=67466225&is=674510a5&hm=542589e6591749b78002084275e1c074df613f12fc64509101ba2afac8365a0b&') // Imagem grande na parte inferior
            .setFooter({
                text: 'Informações sobre o bot',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [pingEmbed] });
    }
});

client.login('MTMxMDcyODY5MTQzMjY4OTcwNA.G-Qku5.uDz17rlVoC6Lmg9GtuwBoB5xgJhOcp3DA-Q2QY').catch(err => console.error('Erro ao fazer login:', err));
