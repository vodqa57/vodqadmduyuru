module.exports = {
    name: "prefix",
    async execute(client, message, args, config) {
        if (!config.admins.includes(message.author.id)) {
            return message.reply("❌ Bu komutu sadece bot yöneticileri kullanabilir.");
        }

        const fs = require("fs");
        const newPrefix = args[0];
        if (!newPrefix) return message.reply("Lütfen yeni prefix'i yaz.");

        config.prefix = newPrefix;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
        message.reply(`✅ Prefix başarıyla **${newPrefix}** olarak ayarlandı.`);
    }
};
