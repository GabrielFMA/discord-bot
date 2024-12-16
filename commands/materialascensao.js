const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { loadData } = require('../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascensão')
        .setDescription('Exibe informações do personagem')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('ressonador')
                .setDescription('Nome do personagem')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        let name = interaction.options.getString('ressonador');
        if (!name) return;

        name = name.toLowerCase().replace(/\s+/g, '_');

        const personagens = loadData('..', '', 'characters.json', 'json');
        const personagem = personagens[name];
        if (!personagem) {
            return interaction.reply({ content: 'Personagem não encontrado!', ephemeral: true });
        }

        const miniImageAttachment = loadData('..', 'images', `${name}_icon.png`, 'image');
        const imageAttachment = loadData('..', 'images', `${name}_background.png`, 'image');

        if (!miniImageAttachment || !imageAttachment) {
            return interaction.reply({ content: 'As imagens do personagem não foram encontradas!', ephemeral: true });
        }

        const pingEmbed = new EmbedBuilder()
            .setColor('#33f1ff')
            .setTitle(personagem.name)
            .addFields(
                { name: 'Raridade', value: personagem.rarity, inline: false },
                { name: 'Elemento', value: personagem.element, inline: true },
                { name: 'Arma', value: personagem.gun, inline: true },
                { name: 'Afiliação', value: personagem.affiliation, inline: true }
            )
            .setThumbnail('attachment://' + miniImageAttachment.name)
            .setImage('attachment://' + imageAttachment.name)
            .setFooter({
                text: 'Informações sobre o bot',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [pingEmbed],
            files: [miniImageAttachment, imageAttachment]
        });
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === 'ressonador') {
            const searchTerm = focusedOption.value.toLowerCase();

            const personagens = loadData('..', '', 'characters.json', 'json');

            const filteredResults = Object.keys(personagens)
                .filter(name => name.includes(searchTerm))
                .slice(0, 25);

            const formatName = (name) => {
                return name
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            };

            const suggestions = filteredResults.map(name => ({
                name: formatName(name),
                value: name
            }));

            if (suggestions.length === 0) {
                return interaction.respond([{
                    name: 'Nenhum personagem encontrado', value: ''
                }]);
            }

            await interaction.respond(suggestions);
        }
    }
};
