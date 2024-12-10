const fs = require('fs');
const path = require('path');
const { AttachmentBuilder } = require('discord.js');

function loadData(locale, folder, fileName, isData = null) {
    try {
        const filePath = path.resolve(__dirname, locale, folder, fileName);

        if (isData && isData.toLowerCase() === 'image') {
            if (!fs.existsSync(filePath)) return null;
            return new AttachmentBuilder(filePath, { name: fileName });

        } else if (isData && isData.toLowerCase() === 'json') {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);

        } else {
            console.error("Tipo de dado não especificado corretamente");
            return null;
        }
    } catch (error) {
        console.error(`Erro ao carregar o arquivo ${fileName}:`, error);
        return null;
    }
}

module.exports = {
    loadData
};
