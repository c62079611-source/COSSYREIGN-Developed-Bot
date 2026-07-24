module.exports = {
    name: 'prefix',
    command: ['prefix'],
    description: 'Show prefix',
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `Prefix: ${process.env.PREFIX}` })
    }
} 
