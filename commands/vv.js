const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = {
    name: 'vv',
    command: ['vv', 'viewonce', 'reveal'],
    description: 'Forward viewonce to your own chat',
    execute: async (sock, msg) => {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!quoted) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Reply to a viewonce image/video' })

        const type = Object.keys(quoted)[0]
        if(!type.includes('viewOnce')) return sock.sendMessage(msg.key.remoteJid, { text: '❌ That is not viewonce' })

        const media = quoted[type]
        const mediaType = type.replace('Message', '').toLowerCase() // image or video

        await sock.sendMessage(msg.key.remoteJid, { text: '👀 Opening viewonce and sending to you...' })

        const stream = await downloadContentFromMessage(media, mediaType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) buffer = Buffer.concat([buffer, chunk])

        const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net' // your own chat

        if(mediaType === 'image') {
            await sock.sendMessage(myJid, { image: buffer, caption: '📸 ViewOnce from COSSY REIGN' })
        } else if(mediaType === 'video') {
            await sock.sendMessage(myJid, { video: buffer, caption: '🎥 ViewOnce from COSSY REIGN' })
        }

        await sock.sendMessage(msg.key.remoteJid, { text: '✅ Sent to your own chat' })
    }
                                           } 
