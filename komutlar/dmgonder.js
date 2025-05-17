const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "dmgonder",
    async execute(client, message, args, config) {
        if (!config.admins.includes(message.author.id))
            return message.reply("🚫 Bu komutu kullanmak için yetkiniz yok!");

        const user = message.mentions.users.first();
        if (!user) return message.reply("❗ Lütfen bir kullanıcı etiketleyin!");

        const content = args.slice(1).join(" ");
        if (!content) return message.reply("❗ Lütfen gönderilecek mesajı yazınız!");

        const embedToSend = new EmbedBuilder()
            .setTitle("📬 Sana Özel Mesaj!")
            .setDescription(content)
            .setColor("#3498DB")
            .setFooter({ text: `.vodqa tarafından gönderildi.` })
            .setTimestamp();

        // Animasyon efektli gönderiliyor mesajı:
        const loadingMessages = [
            "📤 Mesaj gönderiliyor.",
            "📤 Mesaj gönderiliyor..",
            "📤 Mesaj gönderiliyor..."
        ];

        const statusMsg = await message.reply(loadingMessages[0]);

        // 3 aşamada mesaj güncellemesi
        for (let i = 1; i < loadingMessages.length; i++) {
            await new Promise(res => setTimeout(res, 700));
            await statusMsg.edit(loadingMessages[i]);
        }

        try {
            await user.send({ embeds: [embedToSend] });

            const confirmEmbed = new EmbedBuilder()
                .setTitle("✅ Mesaj Gönderildi")
                .setDescription(`Mesaj başarıyla ${user.tag} kullanıcısına gönderildi!`)
                .addFields(
                    { name: "Gönderilen Mesaj", value: content.length > 1024 ? content.slice(0, 1021) + "..." : content },
                    { name: "Gönderim Zamanı", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
                )
                .setColor("#2ECC71")
                .setTimestamp();

            await statusMsg.edit({ content: null, embeds: [confirmEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setTitle("❌ Mesaj Gönderilemedi")
                .setDescription(`Mesaj gönderilemedi: **${error.message}**`)
                .setColor("#E74C3C")
                .setTimestamp();

            await statusMsg.edit({ content: null, embeds: [errorEmbed] });
        }
    },
};
