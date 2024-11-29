const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('materialascensão')
        .setDescription('Exibe informações do personagem')
        .addStringOption(option =>
            option.setName('ressonador')
                .setDescription('Nome do personagem')
                .setRequired(true)
                .setAutocomplete(true)  // Ativa o autocomplete para essa opção
        ),

    async execute(interaction, client) {
        let name = interaction.options.getString('ressonador');
        if (!name) return;

        name = name.toLowerCase().replace(/\s+/g, '_');  // Ajusta para o nome correto no formato de arquivo

        let personagem;
        try {
            personagem = require(path.resolve(__dirname, '..', 'characters', `${name}.js`));
        } catch (error) {
            return interaction.reply({ content: 'Personagem não encontrado!', ephemeral: true });
        }

        const createImageAttachment = (imageName) => {
            const imagePath = path.resolve(__dirname, '..', 'images', `${imageName}`);
            if (!fs.existsSync(imagePath)) return null;
            return new AttachmentBuilder(imagePath, { name: imageName });
        };

        const miniImageAttachment = createImageAttachment(`${name}_icon.png`);
        const imageAttachment = createImageAttachment(`${name}_background.png`);

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
                { name: 'Localização', value: personagem.location, inline: true }
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

            const characterFiles = fs.readdirSync(path.join(__dirname, '..', 'characters'))
                .filter(file => file.endsWith('.js'))
                .map(file => file.replace('.js', '').toLowerCase());

            const filteredResults = characterFiles.filter(name =>
                name.includes(searchTerm)
            ).slice(0, 25);

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
                return interaction.respond([
                    { name: 'Nenhum personagem encontrado', value: '' }
                ]);
            }

            await interaction.respond(suggestions);
        }
    }
};
