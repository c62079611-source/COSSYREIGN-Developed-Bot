const fs = require('fs')
module.exports = {
    name: 'transfer',
    command: ['transfer', 'addfromfile'],
    description: 'Add members from a txt file to current group/channel',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        
        // Check if user replied to a document
        const documentMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage 
        if(!documentMsg) {
            return sock.sendMessage(from, { text: '❌ Reply to the members.txt file with .transfer' })
        }

        try {
            // Download the file
            const stream = await sock.downloadMediaMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage)
            const fileContent = stream.toString()
            
            // Extract all @s.whatsapp.net from the file
            const numbers = fileContent.match(/\d+@s\.whatsapp\.net/g)
            if(!numbers || numbers.length === 0) {
                return sock.sendMessage(from, { text: '❌ No valid numbers found in file' })
            }

            // Remove bot and duplicates
            const uniqueNumbers = [...new Set(numbers)].filter(n => n !== sock.user.id)
            
            await sock.sendMessage(from, { text: `👑 Found ${uniqueNumbers.length} members. Starting transfer... This will be slow to avoid ban`})

            let added = 0, failed = 0

            for(const number of uniqueNumbers) {
                try {
                    await sock.groupParticipantsUpdate(from, [number], 'add')
                    added++
                    await sock.sendMessage(from, { text: `✅ Added: ${number.split('@')[0]}`})
                } catch(e) {
                    failed++
                    console.log('Failed to add', number, e.message)
                }
                await new Promise(r => setTimeout(r, 5000)) // 5s delay between adds. IMPORTANT to avoid ban
            }

            await sock.sendMessage(from, { 
                text: `👑 *TRANSFER COMPLETE*\n\n✅ Added: ${added}\n❌ Failed: ${failed}\n\nFailed = they have privacy on or already in group`
            })

        } catch(e) {
            await sock.sendMessage(from, { text: '❌ Error: ' + e.message })
        }
    }
                                                            } 
