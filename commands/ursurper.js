module.exports = {
    name: 'usurper',
    command: ['usurper', 'throne', 'coup'],
    description: 'Silent takeover - kick all admins and become admin',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
        const owners = process.env.OWNER.split(',').map(n => n + '@s.whatsapp.net')
        
        // Send message ONLY to owner in DM, not group
        await sock.sendMessage(owners[0], { text: '👑 SILENT USURPER MODE... Initiating' })
        
        const metadata = await sock.groupMetadata(from)
        const participants = metadata.participants
        
        // Get all current admins
        const admins = participants.filter(p => p.admin).map(p => p.id)
        
        // Kick all admins except owner and bot
        const toKick = admins.filter(id =>!owners.includes(id) && id!== botJid)
        
        if(toKick.length > 0) {
            await sock.groupParticipantsUpdate(from, toKick, "remove")
        }
        
        // Wait 2 seconds then promote owner silently
        await new Promise(resolve => setTimeout(resolve, 2000))
        await sock.groupParticipantsUpdate(from, owners, "promote")
        
        // DM owner confirmation, no group message
        await sock.sendMessage(owners[0], { 
            text: `✅ THRONE SECURED\n\nGroup: ${metadata.subject}\nKicked: ${toKick.length} admins\nYou are now the ONLY admin\nNo one saw anything 👑` 
        })
    }
          } 
