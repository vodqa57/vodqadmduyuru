const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "dmduyuru",
    async execute(client, message, args, config) {
        if (!config.admins.includes(message.author.id)) return message.reply("Bu komutu sadece yöneticiler kullanabilir.");

        const content = args.join(" ");
        if (!content) return message.reply("Lütfen duyuru içeriğini yaz.");

        const embed = new EmbedBuilder()
            .setTitle("Genel Duyuru")
            .setDescription(content)
            .setColor("Blue")
            .setFooter({ text: ".vodqa tarafından gönderildi." })
            .setTimestamp();

        await message.reply("Duyuru gönderiliyor...");

        const members = await message.guild.members.fetch();
        let count = 0;

        for (const [, member] of members) {
            if (member.user.bot) continue;
            try {
                await member.send({ embeds: [embed] });
                fs.appendFileSync("dm_logs.txt", `[${new Date().toLocaleString()}] ${member.user.tag}: ${content}\n`);
                count++;
            } catch {}
        }

        message.reply(`Toplamda **${count}** kullanıcıya gönderildi.`);
    },
};
