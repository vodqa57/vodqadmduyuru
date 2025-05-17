const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'panel',
  description: 'Bot istatistiklerini gösterir',
  async execute(client, message, args, config) {
    if (!config.admins.includes(message.author.id)) {
      return message.reply('Bu komutu sadece yöneticiler kullanabilir.');
    }

    let istatistik;
    try {
      istatistik = JSON.parse(fs.readFileSync('./istatistikler.json', 'utf8'));
    } catch (err) {
      return message.reply('İstatistik verisi okunamadı.');
    }

    // En çok gönderim yapan admini bul
    let maxAdminId = null;
    let maxGonderim = 0;
    for (const [id, sayi] of Object.entries(istatistik.gonderimler || {})) {
      if (sayi > maxGonderim) {
        maxGonderim = sayi;
        maxAdminId = id;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('DM Duyuru Botu - İstatistik Paneli')
      .setColor('Blurple')
      .addFields(
        { name: 'Toplam DM Gönderimi', value: `${istatistik.toplamGonderim || 0}`, inline: true },
        { name: 'Sunucu Sayısı', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Komut Sayısı', value: `${client.commands.size}`, inline: true },
        { name: 'Günlük Gönderim', value: `${istatistik.gunlukGonderim || 0}`, inline: true },
        {
          name: 'Son Gönderim',
          value: istatistik.sonGonderim ? `<t:${Math.floor(new Date(istatistik.sonGonderim).getTime() / 1000)}:R>` : 'Veri yok',
          inline: true
        },
        {
          name: 'En Çok Gönderim Yapan',
          value: maxAdminId ? `<@${maxAdminId}> (${maxGonderim} gönderim)` : 'Veri yok',
          inline: true
        }
      )
      .setFooter({ text: `Yapımcı: .vodqa | Prefix: ${config.prefix}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
