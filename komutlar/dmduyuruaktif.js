const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'dmduyuruaktif',
    description: 'Aktif kullanıcılara DM duyurusu gönderir.',
    async execute(client, message, args, config) {
        if (!config.admins.includes(message.author.id)) 
            return message.reply({ content: "Bu komutu kullanmak için yetkiniz yok.", ephemeral: true });

        if (!args.length) 
            return message.reply({ content: "Lütfen duyuru mesajını yazınız.", ephemeral: true });

        const duyuruMetni = args.join(' ');

        // Onay Embed'i
        const onayEmbed = new EmbedBuilder()
            .setTitle("DM Duyuru Onayı")
            .setDescription(`Aşağıdaki mesaj aktif kullanıcılara DM olarak gönderilecektir.\n\n` +
                `Mesaj:\n${duyuruMetni.length > 800 ? duyuruMetni.slice(0, 800) + '...' : duyuruMetni}`)
            .setColor('#00ffae')
            .setFooter({ text: "Onaylamak için butona tıklayın." });

        // Onay butonları
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('onayla')
                    .setLabel('Onayla')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('iptal')
                    .setLabel('İptal')
                    .setStyle(ButtonStyle.Danger),
            );

        // Komut kanalına onay mesajını gönder
        const onayMesaji = await message.channel.send({ embeds: [onayEmbed], components: [row] });

        // Buton etkileşimlerini dinle
        const filter = i => i.user.id === message.author.id;
        const collector = onayMesaji.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'iptal') {
                await i.update({ content: 'DM duyuru işlemi iptal edildi.', embeds: [], components: [] });
                collector.stop();
                return;
            } else if (i.customId === 'onayla') {
                await i.update({ content: 'Duyuru gönderiliyor, lütfen bekleyiniz...', embeds: [], components: [] });
                collector.stop();

                try {
                    const members = await message.guild.members.fetch();
                    let basarili = 0;
                    let basarisiz = 0;

                    // DM için embed şablonu
                    const dmEmbed = new EmbedBuilder()
                        .setTitle("Özel Duyuru")
                        .setDescription(duyuruMetni)
                        .setColor('#00ffae')
                        .setFooter({ text: "VODQA BOT ile gönderildi" });

                    for (const [, member] of members) {
                        if (member.user.bot) continue;
                        if (member.presence && member.presence.status !== 'offline') {
                            try {
                                await member.send({ embeds: [dmEmbed] });
                                basarili++;
                            } catch {
                                basarisiz++;
                            }
                        }
                    }

                    // Özet embed
                    const sonucEmbed = new EmbedBuilder()
                        .setTitle("DM Duyuru Sonucu")
                        .setColor('#00ffae')
                        .addFields(
                            { name: 'Gönderilen üye sayısı', value: `${basarili}`, inline: true },
                            { name: 'Gönderilemeyen üye sayısı', value: `${basarisiz}`, inline: true },
                        )
                        .setFooter({ text: "VODQA BOT" })
                        .setTimestamp();

                    await message.channel.send({ embeds: [sonucEmbed] });

                } catch (err) {
                    console.error(err);
                    await message.channel.send('Bir hata oluştu, lütfen tekrar deneyiniz.');
                }
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                onayMesaji.edit({ content: 'Zaman aşımı nedeniyle DM duyuru iptal edildi.', embeds: [], components: [] });
            }
        });
    }
};
