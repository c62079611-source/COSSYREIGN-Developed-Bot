module.exports = {
    name: 'promote',
    command: ['promote'],
    description: 'Promote to admin',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if(!mentioned) return sock.sendMessage(from, { text: '❌ Tag someone to promote' })
        await sock.groupParticipantsUpdate(from, mentioned, "promote")
        await sock.sendMessage(from, { text: '✅ Promoted to Admin' })
    }
                                           } 
