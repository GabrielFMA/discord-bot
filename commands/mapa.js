const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const plantsData = require('../recurso.json');  // Carregar o arquivo JSON com as informações das plantas

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

        // Verificar se a planta existe no JSON
        if (!plantsData[plant]) {
            return interaction.reply({ content: 'Planta não encontrada no mapa!', ephemeral: true });
        }

        // Obter os dados da planta
        const plantInfo = plantsData[plant];
        const plantName = plantInfo.name;
        const plantImages = plantInfo.images;

        // Gerar anexos para as imagens da planta, verificando se elas existem
        const attachments = Object.values(plantImages).map(imagePath => {
            // Resolver o caminho completo da imagem
            const fullImagePath = path.join(__dirname, '..', imagePath);  // Ajuste o caminho se necessário

            // Verificar se o arquivo de imagem existe
            if (!fs.existsSync(fullImagePath)) {
                console.error(`Imagem não encontrada: ${fullImagePath}`);
                return null; // Retornar null caso a imagem não seja encontrada
            }

            return { attachment: fullImagePath, name: path.basename(fullImagePath) };
        }).filter(attachment => attachment !== null);  // Remover imagens que não foram encontradas

        if (attachments.length === 0) {
            return interaction.reply({ content: 'Nenhuma imagem encontrada para esta planta!', ephemeral: true });
        }

        // Responder com as imagens e o nome da planta
        await interaction.reply({
            content: `Planta: **${plantName}**`,  // Exibe o nome formatado da planta
            files: attachments
        });
    },

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === 'recurso') {
            const searchTerm = focusedOption.value.toLowerCase();

            // Filtrar as plantas que contenham o termo de busca no nome
            const filteredResults = Object.keys(plantsData)
                .filter(plantKey => plantKey.includes(searchTerm))
                .slice(0, 25);

            const suggestions = filteredResults.map(plantKey => ({
                name: plantsData[plantKey].name,  // Usar o nome formatado da planta
                value: plantKey.replace(/_/g, ' ').toLowerCase(),  // Converter o nome para o formato de pesquisa
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
