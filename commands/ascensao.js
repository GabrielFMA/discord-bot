const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { loadData } = require('../utils/utils');
const { createEmbed } = require('../services/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascensão')
        .setDescription('Exibe informações de um personagem ou arma')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('ressonador')
                .setDescription('Nome do personagem')
                .setRequired(false)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('arma')
                .setDescription('Nome da arma')
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        let option = interaction.options.getString('ressonador') || interaction.options.getString('arma');
        const isCharacter = interaction.options.getString('ressonador');

        if (!option) return interaction.reply({ content: 'Você deve fornecer um personagem ou uma arma!', ephemeral: true });

        option = option.toLowerCase().replace(/\s+/g, '_');

        let configOption = loadData('..', 'config', isCharacter ? 'characters.json' : 'weapons.json', 'json');
        configOption = configOption[option];

        const locale = isCharacter ? 'images/characters' : 'images/weapons';

        const image = isCharacter ? loadData('..', locale, `${option}_background.png`, 'image') : loadData('..', locale, `${option}.png`, 'image');
        const miniImage = loadData('..', locale, `${option}_icon.png`, 'image');

        if ((isCharacter && !miniImage) || !image) {
            return interaction.reply({ content: 'As imagens não foram encontradas!', ephemeral: true });
        }

        const fields = [];

        if (isCharacter) {
            if (configOption.rarity) fields.push({ name: 'Raridade', value: configOption.rarity, inline: false });
            if (configOption.element) fields.push({ name: 'Elemento', value: configOption.element, inline: true });
            if (configOption.gun) fields.push({ name: 'Arma', value: configOption.gun, inline: true });
            if (configOption.affiliation) fields.push({ name: 'Afiliação', value: configOption.affiliation, inline: true });
        }

        let info = {
            title: configOption.name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
            fields: fields,
            miniimage: isCharacter ? 'attachment://' + miniImage.name : 'https://semimagem.com.br',
            image: 'attachment://' + image.name,
        };

        const files = [];
        if (isCharacter && miniImage) files.push(miniImage);
        files.push(image);

        await interaction.reply({
            embeds: [await createEmbed(info, client)],
            files: files.length > 0 ? files : undefined
        });
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        const dataType = focusedOption.name === 'ressonador' ? 'characters' : 'weapons';
        const data = loadData('..', 'config', `${dataType}.json`, 'json');

        const searchTerm = focusedOption.value.toLowerCase();

        const filteredResults = Object.keys(data)
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
                name: focusedOption.name === 'ressonador' ? 'Nenhum personagem encontrado' : 'Nenhuma arma encontrada',
                value: ''
            }]);
        }

        await interaction.respond(suggestions);
    }
};
