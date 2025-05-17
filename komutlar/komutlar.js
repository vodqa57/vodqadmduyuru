const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "komutlar",
  description: "Botun tüm komutlarını kategorilere göre sayfalı olarak gösterir.",
  async execute(client, message, args, config) {
    const p = config.prefix;
    const commandsPath = __dirname;
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    // Komutları oku ve kategorize et
    const commands = [];
    for (const file of commandFiles) {
      if (file === "komutlar.js") continue; // kendi komutunu atla
      const cmd = require(path.join(commandsPath, file));
      if (!cmd.name) continue;

      // Açıklama boşsa doldur
      let desc = cmd.description || "Bu komut hakkında açıklama bulunmamaktadır.";
      let cat = cmd.category || "Genel";

      // Örnek açıklama atama
      switch (cmd.name) {
        case "prefix":
          desc = "Botun komut ön ekini değiştirir. Örnek: `!prefix ?`";
          cat = "Yönetim";
          break;
        case "dmduyuru":
          desc = "Sunucudaki tüm üyelere özel mesaj (DM) duyurusu gönderir.";
          cat = "Yönetim";
          break;
        case "dmduyuruaktif":
          desc = "Aktif üyelere (DM) duyurusu gönderir.";
          cat = "Yönetim";
          break;
        case "dmgonder":
          desc = "Belirttiğiniz kullanıcıya özel mesaj (DM) gönderir.";
          cat = "Yönetim";
          break;
        case "komutlar":
          desc = "Botun tüm komutlarını kategorilere göre listeler.";
          cat = "Genel";
          break;
        case "yardım":
          desc = "Botun temel yardım menüsünü gösterir.";
          cat = "Genel";
          break;
        case "ban":
          desc = "Belirtilen kullanıcıyı sunucudan yasaklar.";
          cat = "Yönetim";
          break;
        case "kick":
          desc = "Belirtilen kullanıcıyı sunucudan atar.";
          cat = "Yönetim";
          break;
        case "slot":
          desc = "Slot oyunu oynar, bahis yaparak şansınızı deneyin.";
          cat = "Eğlence";
          break;
        case "avatar":
          desc = "Belirtilen kullanıcının avatarını gösterir.";
          cat = "Eğlence";
          break;
        case "ping":
          desc = "Botun gecikme (ping) süresini gösterir.";
          cat = "Genel";
          break;
        default:
          break;
      }

      commands.push({
        name: cmd.name,
        description: desc,
        category: cat
      });
    }

    // Kategorilere göre grupla
    const categories = {};
    for (const cmd of commands) {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    }

    // Sayfalar oluştur
    const pages = [];
    for (const [category, cmds] of Object.entries(categories)) {
      const embed = new EmbedBuilder()
        .setTitle(`🔥 ${category} Komutları`)
        .setColor("#FF4500")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Prefix: \`${p}\`\nAşağıdaki komutları kullanabilirsin.`)
        .setFooter({ text: "Bot Geliştirici: .vodqa", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      for (const cmd of cmds) {
        const önemliKomutlar = ["prefix", "dmduyuru", "yardım", "ban", "kick"];
        const emoji = önemliKomutlar.includes(cmd.name) ? "🔥" : "🔹";
        embed.addFields({
          name: `${emoji} \`${p}${cmd.name}\``,
          value: cmd.description,
        });
      }

      pages.push(embed);
    }

    let currentPage = 0;

    // Butonlar
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("◀️ Geri")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("İleri ▶️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(pages.length === 1)
    );

    const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async i => {
      if (i.customId === "next") {
        currentPage++;
        if (currentPage >= pages.length - 1) {
          currentPage = pages.length - 1;
          row.components[1].setDisabled(true);
        }
        row.components[0].setDisabled(false);
      } else if (i.customId === "prev") {
        currentPage--;
        if (currentPage <= 0) {
          currentPage = 0;
          row.components[0].setDisabled(true);
        }
        row.components[1].setDisabled(false);
      }
      await i.update({ embeds: [pages[currentPage]], components: [row] });
    });

    collector.on("end", () => {
      row.components.forEach(b => b.setDisabled(true));
      msg.edit({ components: [row] });
    });
  },
};
