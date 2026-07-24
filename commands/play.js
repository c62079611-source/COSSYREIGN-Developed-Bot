module.exports = {
    name: 'play',
    command: ['play', 'song'],
    description: 'Download music',
    execute: async (sock, msg, args) => {
        const song = args.join(' ')
        if(!song) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Use:.play despacito' })
        await sock.sendMessage(msg.key.remoteJid, { text: `🎵 Searching: ${song}\n\nAdd yt-dl to make this download real music` })
    }
} 
