module.exports = {
    name: 'tagall',
    command: ['tagall', 'everyone'],
    description: 'Tag everyone in group',
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const metadata = await sock.groupMetadata(from)
        const participants = metadata.participants.map(p => p.id)
        await sock.sendMessage(from, { text: '👑 TAGALL BY COSSY REIGN', mentions: participants })
    }
} 
