module.exports = {
    name: 'kick',
    command: ['kick'],
    description: 'Kick member from group',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if(!mentioned) return sock.sendMessage(from, { text: '❌ Tag someone to kick' })
        await sock.groupParticipantsUpdate(from, mentioned, "remove")
        await sock.sendMessage(from, { text: '✅ Kicked' })
    }
} 
