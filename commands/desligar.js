const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desligar')
        .setDescription('Desligar Bot')
        .addStringOption(option =>
            option.setName('senha')
                .setDescription('Senha para delisgar o Bot')
                .setRequired(true)
        ),

    async execute(interaction, client) {
    
        if (interaction.commandName === 'desligar') {
            const senha = interaction.options.getString('senha');
            if (senha === '123456') {
                await interaction.reply('Bot desligado!');
                client.destroy();
            } else {
                await interaction.reply('Senha errada!');
            }
        }

    }
};
