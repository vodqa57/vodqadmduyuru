const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const figlet = require('figlet');
const chalk = require('chalk');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences // presence için
    ],
    partials: [Partials.Channel]
});

client.commands = new Map();

try {
    const komutDosyalari = fs.readdirSync('./komutlar').filter(file => file.endsWith('.js'));
    for (const file of komutDosyalari) {
        try {
            const komut = require(`./komutlar/${file}`);
            client.commands.set(komut.name, komut);
        } catch (err) {
            console.log(chalk.red(`[HATA] Komut yüklenemedi: ${file} - ${err.message}`));
        }
    }
} catch (err) {
    console.log(chalk.red(`[HATA] Komutlar klasörü okunamadı: ${err.message}`));
}

async function loadingBar(text, total = 20, delay = 80) {
    process.stdout.write(chalk.blue(`${text} [`));
    for (let i = 0; i < total; i++) {
        await new Promise(res => setTimeout(res, delay));
        process.stdout.write(chalk.green('█'));
    }
    process.stdout.write(chalk.blue(`] Tamamlandı\n`));
}

async function girisAnimasyonu() {
    console.clear();
    await loadingBar("Bot başlatılıyor");

    return new Promise((resolve) => {
        figlet.text('VODQA BOT', { font: 'Standard' }, (err, data) => {
            if (err) {
                console.log("Figlet hatası:", err);
                resolve();
            }

            console.clear();
            console.log(chalk.hex('#00ffe1').bold(data));

            const infoBox = [
                `┃ ${chalk.bold('Bot İsmi:')}     ${chalk.cyan(client.user.tag)}`,
                `┃ ${chalk.bold('Komut Sayısı:')} ${chalk.yellow(client.commands.size)} adet`,
                `┃ ${chalk.bold('Prefix:')}       ${chalk.green(config.prefix)}`,
                `┃ ${chalk.bold('Yapımcı:')}      ${chalk.magenta('.vodqa')}`,
            ];

            console.log(chalk.hex('#ffaa00')('╭' + '─'.repeat(40)));
            infoBox.forEach(line => console.log(chalk.hex('#ffaa00')(line)));
            console.log(chalk.hex('#ffaa00')('╰' + '─'.repeat(40)));
            resolve();
        });
    });
}

client.on('ready', async () => {
    await girisAnimasyonu();
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(client, message, args, config);
    } catch (error) {
        console.error(chalk.red(`[HATA] Komut yürütülürken: ${error}`));
        message.reply('Bir hata oluştu, geliştiriciye bildir.');
    }
});

// Unhandled rejection handler
process.on('unhandledRejection', error => {
    console.error(chalk.red('Unhandled promise rejection:', error));
});

client.login(config.token);
