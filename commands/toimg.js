module.exports = {
    name: 'toimg',
    command: ['toimg', 'photo'],
    description: 'Convert sticker to image',
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Feature coming soon. Needs ffmpeg' })
    }
} 
