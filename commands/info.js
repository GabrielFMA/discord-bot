const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { loadData } = require('../utils/utils');
const { createEmbed } = require('../services/embedGenerator');
const type = 'info';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(type)
        .setDescription('Exibe informações dos itens')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('itens')
                .setDescription('informações sobre itens')
                .setRequired(true)
                .addChoices(
                    { name: 'Plantas Coletaveis', value: 'plantas' },
                    { name: 'Overlords drops', value: 'drops' }
                )
        ),
    async execute(interaction, client) {

        const item = interaction.options.getString('itens');
        let imageName, name;

        switch (item) {
            case 'plantas':
                imageName = 'coletaveis_planta';
                name = 'Plantas';
                break;
            case 'drops':
                imageName = 'overlords_drops';
                name = 'Drops de Overlords';
                break;
            default:
                console.error('Erro: opção não foi tratada!');
                break;
        }

        const image = loadData('..', 'images/info', `${imageName}.png`, 'image');

        if (!image) {
            return interaction.reply({ content: 'As imagens do personagem não foram encontradas!', ephemeral: true });
        }

        let info = {
            title: name + " coletaveis para ascensão",
            description: "informação sobre os coletaveis",
            image: 'attachment://' + image.name,
        };

        await interaction.reply({
            embeds: [await createEmbed(info, client)],
            files: [image]
        });

    },
};