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
                { name: 'Ressonadora', value: 'Shorekeep <:Rectifier:1305619439705788531> <:spectro:1305619259875135508>', inline: true },
                { name: 'Raridade', value: '⭐⭐⭐⭐⭐', inline: true },
                { name: 'Localização', value: '<:Black_Shores_Emblem:1309710724284551178>', inline: true },
                
            )
            .setThumbnail('https://media.discordapp.net/attachments/1055633011544170562/1310781819628556358/1000.png?ex=67467832&is=674526b2&hm=d6a6eeed785505ddd3c76094de1302c85dcf5f178cffb00a734c743157dc7c68&=&format=webp&quality=lossless&width=380&height=676') // Imagem pequena à direita
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
