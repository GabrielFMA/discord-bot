const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const plantsData = require('../config/recurso.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mapa')
        .setDescription('Exibe informações do mapa')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('recurso')
                .setDescription('Nome do Recurso')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction, client) {
        let plant = interaction.options.getString('recurso');
        if (!plant) return;

        plant = plant.toLowerCase().replace(/\s+/g, '_');

        if (!plantsData[plant]) {
            return interaction.reply({ content: 'Planta não encontrada no mapa!', ephemeral: true });
        }

        const plantInfo = plantsData[plant];
        const plantName = plantInfo.name;
        const plantImages = plantInfo.images;

        const attachments = Object.values(plantImages).map(imagePath => {
            const fullImagePath = path.join(__dirname, '..', imagePath); 

            if (!fs.existsSync(fullImagePath)) {
                console.error(`Imagem não encontrada: ${fullImagePath}`);
                return null;
            }

            return { attachment: fullImagePath, name: path.basename(fullImagePath) };
        }).filter(attachment => attachment !== null);

        if (attachments.length === 0) {
            return interaction.reply({ content: 'Nenhuma imagem encontrada para esta planta!', ephemeral: true });
        }

        await interaction.reply({
            content: `Planta: **${plantName}**`,
            files: attachments
        });
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === 'recurso') {
            const searchTerm = focusedOption.value.toLowerCase();

            const filteredResults = Object.keys(plantsData)
                .filter(plantKey => plantKey.includes(searchTerm))
                .slice(0, 25);

            const suggestions = filteredResults.map(plantKey => ({
                name: plantsData[plantKey].name,
                value: plantKey.replace(/_/g, ' ').toLowerCase(),
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