module.exports = {
    name: 'ytmp3',
    command: ['ytmp3', 'yta'],
    description: 'Download youtube audio',
    execute: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `🎵 Downloading MP3: ${args[0]}` })
    }
} 
