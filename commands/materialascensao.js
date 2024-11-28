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
        ),

    async execute(interaction, client) {
        let name = interaction.options.getString('ressonador');
        if (!name) return;
        name = name.toLowerCase().replace(/\s+/g, '_');

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
    }
};
