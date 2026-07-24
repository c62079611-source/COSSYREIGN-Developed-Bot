module.exports = {
    name: 'unbug',
    command: ['unbug', 'clean'],
    description: 'Clean group - remove links',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        await sock.sendMessage(from, { text: '🧹 Antidote activated. Cleaning spam and links...' })
        // You can connect this to antilink later to auto-delete
    }
} 
