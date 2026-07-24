module.exports = {
    name: 'ytmp4',
    command: ['ytmp4', 'ytv'],
    description: 'Download youtube video',
    execute: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `📺 Downloading YT: ${args[0]}\nAdd ytdl-core` })
    }
} 
