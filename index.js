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
            .setColor('#33f1ff')
            .setTitle('Ressonadors')
            .addFields(
                { name: 'Ressonadora', value: 'Shorekepp. <:emoji_7:1310775782775324692> <:emoji_2:1310771570909909143>', inline: true },
                { name: 'Raridade', value: '<:imagem_20241125_222238287:1310778083912978484', inline: true },
                { name: 'Localização', value: '<:Black Shores. <:Black_Shores_Emblem:1310776445592797284>', inline: true },
                
            )
            .setThumbnail('https://media.discordapp.net/attachments/1273496005484216390/1310778898316791828/1000.png?ex=6746757a&is=674523fa&hm=ff9b44388b55734087b0f72ea48ece6712af084b808c30c641e69149f8c352fb&=&format=webp&quality=lossless&width=550&height=236') // Imagem pequena à direita
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
