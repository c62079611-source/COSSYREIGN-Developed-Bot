module.exports = {
    name: 'tiktok',
    command: ['tiktok', 'tt'],
    description: 'Download tiktok',
    execute: async (sock, msg, args) => {
        const link = args[0]
        if(!link) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Use:.tiktok https://tiktok.com/...' })
        await sock.sendMessage(msg.key.remoteJid, { text: `📱 Downloading TikTok: ${link}\n\nAdd tiktok API to make this work` })
    }
} 
