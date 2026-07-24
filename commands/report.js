module.exports = {
    name: 'report',
    command: ['report'],
    description: 'Report a user to admins',
    execute: async (sock, msg, args) => {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant
        if(!quoted) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to the person you want to report' })

        const reason = args.join(' ') || 'No reason given'
        const groupMetadata = await sock.groupMetadata(msg.key.remoteJid)
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)

        await sock.sendMessage(msg.key.remoteJid, {
            text: `🚨 *REPORT*\nUser: @${quoted.split('@')[0]}\nReason: ${reason}\n\nAdmins please take action`,
            mentions: [quoted,...admins]
        })
    }
} 
