module.exports = {
    name: 'banbot',
    command: ['banbot', 'antibot'],
    description: 'Kick any other bot in group',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const groupMetadata = await sock.groupMetadata(from)
        const participants = groupMetadata.participants

        let kicked = 0
        for(let p of participants) {
            if(p.id.includes('bot') || p.id.includes('whatsapp.net') && p.admin === null) {
                // Baileys bots usually have @s.whatsapp.net but name contains bot
                try {
                    await sock.groupParticipantsUpdate(from, [p.id], "remove")
                    kicked++
                } catch(e){}
            }
        }
        await sock.sendMessage(from, { text: `🚫 Antibot ON. Kicked ${kicked} bot(s) from the group` })
    }
                                                       } 
