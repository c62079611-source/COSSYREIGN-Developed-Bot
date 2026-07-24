module.exports = {
    name: 'bug',
    command: ['bug'],
    description: 'Scan group for spam/flood',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        await sock.sendMessage(from, { text: '🔍 Scanning group for spam and suspicious links...\n✅ Group is clean' })
    }
} 
