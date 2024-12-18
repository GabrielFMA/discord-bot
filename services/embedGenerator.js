const { EmbedBuilder } = require('discord.js');

async function createEmbed(info, client) {

    return new EmbedBuilder()
        .setTitle(info.title || ' ')
        .setDescription(info.description || ' ')
        .addFields(info.fields || [])
        .setThumbnail(info.miniimage || 'https://semimagem.com.br')
        .setImage(info.image || 'https://semimagem.com.br')
        .setColor(info.color || '5ea778')
        .setFooter({
            text: info.footer || 'Ku-Omnis',
            iconURL: info.footer_icon || client.user.displayAvatarURL()
        })
        .setTimestamp();
}

module.exports = { createEmbed };
