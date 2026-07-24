module.exports = {
    name: 'menu',
    command: ['menu', 'help'],
    description: 'Show bot menu',
    execute: async (sock, msg, args, isOwner) => {
        const from = msg.key.remoteJid
        const owners = process.env.OWNER.split(',')
        let menu = `👑 *COSSY REIGN V7.0* 👑\n\n`
        menu += `*Owner:* ${owners.join(', ')}\n`
        menu += `*Prefix:* ${process.env.PREFIX}\n`
        menu += `*Mode:* ${process.env.MODE}\n\n`
        menu += `*CORE COMMANDS:*\n`
        menu += `.ping - Check bot speed\n`
        menu += `.restart - Restart bot\n`
        menu += `.menu - Show this menu\n`
        menu += `.sticker - Reply image to make sticker\n`
        menu += `.toimg - Reply sticker to image\n`
        menu += `.ai <text> - Chat with AI\n`
        menu += `.play <song> - Download music\n`
        menu += `.tiktok <link> - Download tiktok\n`
        menu += `.ytmp4 <link> - Download youtube\n`
        menu += `.kick @user - Kick member\n`
        menu += `.promote @user - Promote admin\n`
        menu += `_More commands coming..._`
        
        await sock.sendMessage(from, { 
            image: { url: 'https://ibb.co/twnsPqd2' },
            caption: menu 
        })
    }
                             } 
