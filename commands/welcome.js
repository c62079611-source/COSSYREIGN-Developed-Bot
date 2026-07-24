const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')

sock.ev.on('group-participants.update', async (update) => {
    if(update.action === 'add') {
        const groupMetadata = await sock.groupMetadata(update.id)
        const groupName = groupMetadata.subject // auto updates every day

        for(const participant of update.participants) {
            const user = participant.split('@')[0]
            const welcomeMsg = `🎉 *WELCOME TO ${groupName.toUpperCase()}* 🎉\n\nHey @${user}, welcome to the family!\n\nPlease read group rules and have fun ❤️\n\n- COSSY REIGN BOT`

            // Send gift image + text
            await sock.sendMessage(update.id, {
                image: { url: 'https://i.ibb.co/V3LkR5k/welcome-gift.png' }, // change to your gift image link
                caption: welcomeMsg,
                mentions: [participant]
            })
        }
    }
}) 
