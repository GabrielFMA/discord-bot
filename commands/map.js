const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { loadData } = require('../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mapa')
        .setDescription('Exibe informações do personagem')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('recurso')
                .setDescription('Nome da Recursos')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        let plant = interaction.options.getString('recurso');
        if (!plant) return;

        plant = plant.toLowerCase().replace(/\s+/g, '_');

        const imagesPath = path.join(__dirname, '..', 'images', 'plants');
        const files = fs.readdirSync(imagesPath);

        // Filtrando as imagens com o nome prefixado por 'plant' e terminando com '.png'
        const matchingFiles = files.filter(file => file.toLowerCase().startsWith(plant) && file.endsWith('.png'));

        if (matchingFiles.length === 0) {
            return interaction.reply({ content: 'As imagens do Mapa não foram encontradas!', ephemeral: true });
        }

        // Carregar as imagens e preparar os arquivos para resposta
        const attachments = matchingFiles.map(file => {
            const imageAttachment = loadData('..', 'images/plants', file, 'image');
            return imageAttachment ? imageAttachment : null;
        }).filter(attachment => attachment !== null);

        if (attachments.length === 0) {
            return interaction.reply({ content: 'Nenhuma imagem encontrada!', ephemeral: true });
        }

        // Formatar o nome da planta, ignorando qualquer número ou sufixo
        const plantName = matchingFiles[0].split('_').slice(0, 2).map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');

        await interaction.reply({
            content: `Planta: **${plantName}**`, // Exibe o nome formatado da planta
            files: attachments
        });
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === 'recurso') {
            const searchTerm = focusedOption.value.toLowerCase();

            const imagesPath = path.join(__dirname, '..', 'images', 'plants');
            const files = fs.readdirSync(imagesPath);

            const pngFiles = files.filter(file => file.endsWith('.png'));

            // Filtrando arquivos que contêm o searchTerm e pegando apenas o prefixo
            const filteredResults = pngFiles.filter(file => file.toLowerCase().includes(searchTerm))
                .map(file => file.split('_').slice(0, 2).join('_'))  // Pegando só os dois primeiros nomes
                .filter((value, index, self) => self.indexOf(value) === index) // Removendo duplicados
                .slice(0, 25);

            const formatName = (name) => {
                // Remover a extensão .png e formatar
                return name
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                    .replace('.png', '');
            };

            // Criando as sugestões de autocomplete
            const suggestions = filteredResults.map(file => ({
                name: formatName(file),
                value: formatName(file),
            }));

            if (suggestions.length === 0) {
                return interaction.respond([{
                    name: 'Nenhum recurso encontrado',
                    value: ''
                }]);
            }

            await interaction.respond(suggestions);
        }
    }
};