const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const commands = new Map()

// Load all commands from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.set(command.name, command)
}

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
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const from = msg.key.remoteJid
        const sender = msg.key.participant || from
        const prefix = process.env.PREFIX || '.'
        const owners = process.env.OWNER.split(',')
        const isOwner = owners.includes(sender.split('@')[0])

        if (!text.startsWith(prefix)) return
        const args = text.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = commands.get(commandName) || [...commands.values()].find(cmd => cmd.command?.includes(commandName))
        if(!command) return

        if(command.ownerOnly &&!isOwner) {
            return sock.sendMessage(from, { text: '❌ Owner Only Command' })
        }

        try {
            await command.execute(sock, msg, args, isOwner)
        } catch(e) {
            console.log(chalk.red(e))
            await sock.sendMessage(from, { text: '❌ Error: ' + e.message })
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
