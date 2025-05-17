const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "yardım",
    async execute(client, message, args, config) {
        const embed = new EmbedBuilder()
            .setTitle("Yardım Menüsü")
            .setColor("#00C897")
            .setDescription("Bu bot, yöneticiler için özel DM duyuru sistemine sahiptir.\n\nKomutları görmek için: `!komutlar`")
            .setFooter({ text: "Bot geliştirici: .vodqa", iconURL: client.user.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};
