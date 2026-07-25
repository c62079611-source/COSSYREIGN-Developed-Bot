const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')
const { exec } = require('child_process')
const { getMeta } = require('./setstickercmd')

module.exports = {
    name: 'sticker',
    command: ['sticker', 's'],
    description: 'Make sticker from image/video',
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
        const media = quoted || msg.message

        if(!media.imageMessage &&!media.videoMessage) return sock.sendMessage(from, { text: '❌ Reply to image or video' })

        await sock.sendMessage(from, { text: '⏳ Making sticker...' })
        const stream = await downloadContentFromMessage(media.imageMessage || media.videoMessage, media.imageMessage? 'image' : 'video')
        let buffer = Buffer.from([])
        for await(const chunk of stream) buffer = Buffer.concat([buffer, chunk])

        fs.writeFileSync('./temp.jpg', buffer)
        const meta = getMeta()
        exec(`ffmpeg -i./temp.jpg -vcodec libwebp -lossless 1 -metadata s="${meta.packname}" -metadata a="${meta.author}"./sticker.webp`, async() => {
            await sock.sendMessage(from, { sticker: fs.readFileSync('./sticker.webp') })
            fs.unlinkSync('./temp.jpg')
            fs.unlinkSync('./sticker.webp')
        })
    }
            } 
