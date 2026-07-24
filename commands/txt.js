const fs = require('fs')
const path = require('path')

module.exports = {
    name: 'txt',
    command: ['txt', 'getmembers', 'members'],
    description: 'Export all group members to txt file',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        
        // Only works in groups
        if(!from.endsWith('@g.us')) {
            return sock.sendMessage(from, { text: '❌ This command only works in groups' })
        }

        try {
            await sock.sendMessage(from, { text: '👑 Fetching members... Please wait' })

            const metadata = await sock.groupMetadata(from)
            const groupName = metadata.subject
            const participants = metadata.participants

            let txt = `👑 COSSY REIGN MEMBER EXPORT 👑\n`
            txt += `Group: ${groupName}\n`
            txt += `Total Members: ${participants.length}\n`
            txt += `Date: ${new Date().toLocaleString()}\n`
            txt += `-----------------------------------\n\n`

            participants.forEach((p, i) => {
                const number = p.id.split('@')[0]
                txt += `${i+1}. ${number}@s.whatsapp.net\n`
            })

            // Save file
            const filePath = path.join(__dirname, '../members.txt')
            fs.writeFileSync(filePath, txt)

            // Send file
            await sock.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/plain',
                fileName: `${groupName}_members.txt`,
                caption: `✅ *Member Export Complete*\n\nGroup: ${groupName}\nTotal: ${participants.length}\n\nReply this file in another group with .transfer to add them`
            })

            // Delete file after sending
            fs.unlinkSync(filePath)

        } catch(e) {
            console.log(e)
            await sock.sendMessage(from, { text: '❌ Error: ' + e.message })
        }
    }
              } 
