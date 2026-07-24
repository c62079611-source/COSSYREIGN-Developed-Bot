    if(update.action === 'remove') {
        const groupMetadata = await sock.groupMetadata(update.id)
        const groupName = groupMetadata.subject

        for(const participant of update.participants) {
            const user = participant.split('@')[0]
            const byeMsg = `😢 *@${user} left ${groupName}*\n\nWe'll miss you! Come back soon ❤️\n\n- COSSY REIGN BOT`

            await sock.sendMessage(update.id, {
                image: { url: 'https://i.ibb.co/0XJ1p4v/goodbye.png' }, // change to your goodbye image link
                caption: byeMsg,
                mentions: [participant]
            })
        }
    }
}) 
