module.exports = {
    name: 'demote',
    command: ['demote'],
    description: 'Remove admin from member',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if(!mentioned) return sock.sendMessage(from, { text: '❌ Tag an admin to demote\nEx:.demote @user' })
        await sock.groupParticipantsUpdate(from, mentioned, "demote")
        await sock.sendMessage(from, { text: '✅ Demoted to member' })
    }
} 
