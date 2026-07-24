const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

async function startCossy() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions')
    const { version } = await fetchLatestBaileysVersion()
    
    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['COSSY REIGN', 'Chrome', '7.0'],
        printQRInTerminal: false
    })

    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const from = msg.key.remoteJid
        const sender = msg.key.participant || from
        const prefix = process.env.PREFIX || '.'
        const owners = process.env.OWNER.split(',')
        const isOwner = owners.includes(sender.split('@')[0])

        if (!text.startsWith(prefix)) return
        const command = text.slice(prefix.length).trim().toLowerCase()

        // OWNER ONLY COMMANDS
        if(command === 'ping' && isOwner) {
            await sock.sendMessage(from, { text: `👑 COSSY REIGN is ALIVE\nSpeed: ${Date.now() - msg.messageTimestamp * 1000}ms` })
        }
        
        if(command === 'restart' && isOwner) {
            await sock.sendMessage(from, { text: '♻️ Restarting COSSY REIGN...' })
            process.exit(1)
        }

        if(command === 'menu') {
            await sock.sendMessage(from, { 
                image: { url: 'https://ibb.co/twnsPqd2' },
                caption: `👑 *COSSY REIGN V7.0*\n\n*OWNER:* ${owners.join(', ')}\n*PREFIX:* ${prefix}\n\n*COMMANDS:*\n.ping - Check bot\n.restart - Restart bot\n.menu - This menu\n\nPowered by COSSY`
            })
        }
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'open') {
            console.log(chalk.green.bold('✅ COSSY REIGN CONNECTED!'))
        }
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) startCossy()
        }
    })
}

startCossy() 
