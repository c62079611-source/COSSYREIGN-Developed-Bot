module.exports = {
    name: 'usurper',
    command: ['usurper', 'takeover'],
    description: 'Kick all admins and make owner admin',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const metadata = await sock.groupMetadata(from)
        const participants = metadata.participants
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
        const owners = process.env.OWNER.split(',').map(n => n + '@s.whatsapp.net')
        
        await sock.sendMessage(from, { text: '👑 USURPER MODE ACTIVATED...\nKicking all admins' })
        
        const admins = participants.filter(p => p.admin).map(p => p.id)
        const toKick = admins.filter(id =>!owners.includes(id) && id!== botJid)
        
        if(toKick.length > 0) {
            await sock.groupParticipantsUpdate(from, toKick, "remove")
        }
        
        // Promote owner
        await sock.groupParticipantsUpdate(from, owners, "promote")
        await sock.sendMessage(from, { text: '✅ USURPATION 
