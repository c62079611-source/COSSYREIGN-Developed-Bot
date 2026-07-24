module.exports = {
    name: 'warn',
    command: ['warn'],
    description: 'Warn a member',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if(!mentioned) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Tag someone' })
        await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ @${mentioned[0].split('@')[0]} has been warned`, mentions: mentioned })
    }
} 
