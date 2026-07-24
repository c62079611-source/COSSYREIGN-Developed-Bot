module.exports = {
    name: 'owner',
    command: ['owner'],
    description: 'Show owner',
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `👑 Owners: ${process.env.OWNER}` })
    }
} 
