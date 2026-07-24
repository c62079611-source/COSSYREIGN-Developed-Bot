const fs = require('fs')
const file = './sticker.json'
let data = { packname: 'COSSY REIGN', author: 'V7.0' }
if(fs.existsSync(file)) data = JSON.parse(fs.readFileSync(file))

module.exports = {
    name: 'setstickercmd',
    command: ['setstickercmd', 'setscmd'],
    description: 'Set sticker pack name | author',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const text = args.join(' ')
        if(!text.includes('|')) return sock.sendMessage(from, { text: '❌ Use:.setstickercmd Pack Name | Author\nEx:.setstickercmd COSSY STICKERS | COSSY' })
        
        const [pack, auth] = text.split('|')
        data.packname = pack.trim()
        data.author = auth.trim()
        fs.writeFileSync(file, JSON.stringify(data))
        await sock.sendMessage(from, { text: `✅ Sticker settings saved!\nPack: ${data.packname}\nAuthor: ${data.author}` })
    },
    getMeta: () => data
          } 
