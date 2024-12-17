const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { loadData } = require('../utils/utils');
const type = 'info';

module.exports = {
    //Comando
    data: new SlashCommandBuilder()
        .setName(type)
        .setDescription('Exibe informações dos itens')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('itens')
                .setDescription('informações sobre itens')
                .setRequired(true)
                .addChoices(
                    { name: 'Coletaveis', value: 'plantas' }
                  
                )
        ),
    //Executar
    async execute(interaction) {

        const item = interaction.options.getString('itens');
        if (item != 'plantas') return;


        const imageAttachment = loadData('..', 'images', `coletaveis_planta.png`, 'image');

        if (!imageAttachment) {
            return interaction.reply({ content: 'As imagens do personagem não foram encontradas!', ephemeral: true });
        }

        const pingEmbed = new EmbedBuilder()
            .setColor('#5ea778')
            .setTitle("Plantas coletaveis para ascensão")
            .setDescription("informação sobre os coletaveis")
            .setImage('attachment://' + imageAttachment.name)
            .setTimestamp();
            
        await interaction.reply({
            embeds: [pingEmbed],
            files: [imageAttachment]
        });
        
    },
};