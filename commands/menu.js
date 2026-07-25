module.exports = {
    name: 'menu',
    aliases: ['menu', 'help'], // so .menu and .help both work
    description: 'Show bot menu',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid

        // SAFETY: If OWNER/PREFIX not set, it uses these defaults
        const owners = process.env.OWNER ? process.env.OWNER.split(',') : ['254118868586']
        const prefix = process.env.PREFIX || '.'
        const mode = process.env.MODE || 'Public'

        let menu = `👑 *COSSY REIGN V7.0* 👑\n\n`
        menu += `*Owner:* +${owners.join(', +')}\n`
        menu += `*Prefix:* ${prefix}\n`
        menu += `*Mode:* ${mode}\n\n`
        menu += `*CORE COMMANDS:*\n`
        menu += `${prefix}ping - Check bot speed\n`
        menu += `${prefix}restart - Restart bot\n`
        menu += `${prefix}menu - Show this menu\n`
        menu += `${prefix}sticker - Reply image to make sticker\n`
        menu += `${prefix}toimg - Reply sticker to image\n`
        menu += `${prefix}ai <text> - Chat with AI\n`
        menu += `${prefix}play <song> - Download music\n`
        menu += `${prefix}tiktok <link> - Download tiktok\n`
        menu += `${prefix}ytmp4 <link> - Download youtube\n`
        menu += `${prefix}kick @user - Kick member\n`
        menu += `${prefix}promote @user - Promote admin\n`
        menu += `_More commands coming..._`
        
        await sock.sendMessage(from, { 
            image: { url: 'https://ibb.co/twnsPqd2' },
            caption: menu 
        }, { quoted: msg })
    }
            } 
