const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const path = require('path')
const pino = require('pino')

// ============ DATABASE ============
const db = {
    welcome: {},
    goodbye: {},
    antidel: {}
}
if(fs.existsSync('./database.json')) {
    Object.assign(db, JSON.parse(fs.readFileSync('./database.json')))
}
setInterval(() => {
    fs.writeFileSync('./database.json', JSON.stringify(db))
}, 10000)

// ============ CONFIG ============
const OWNER = process.env.OWNER? process.env.OWNER.split(',') : ['254118868586']
const PREFIX = process.env.PREFIX || '.'
const MODE = process.env.MODE || 'public'

// ============ LOAD COMMANDS ============
const commands = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    if(command.command) {
        const cmds = Array.isArray(command.command)? command.command : [command.command]
        cmds.forEach(cmd => commands.set(cmd.toLowerCase(), command))
    }
    if(command.aliases) {
        command.aliases.forEach(alias => commands.set(alias.toLowerCase(), command))
    }
}
console.log(`✅ Loaded ${commands.size} commands`)

// ============ CONNECT ============
async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting...', shouldReconnect)
            if(shouldReconnect) connect()
        } else if(connection === 'open') {
            console.log('👑 COSSY REIGN V7.0 ONLINE ✅')
        }
    })

    // ============ AUTO STATUS VIEW + LIKE ============
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message) return
        if(m.key.remoteJid === 'status@broadcast') {
            try {
                await sock.readMessages([m.key])
                await sock.sendMessage(m.key.remoteJid, { react: { text: '❤️', key: m.key }})
                console.log('Viewed + Liked Status')
            } catch(e) {}
        }
    })

    // ============ WELCOME + GOODBYE ============
    sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
        try {
            if(action === 'add') {
                const msg = db.welcome[id] || 'Welcome @user to the group!'
                const text = msg.replace('@user', `@${participants[0].split('@')[0]}`)
                await sock.sendMessage(id, { text, mentions: participants })
            }
            if(action === 'remove') {
                const msg = db.goodbye[id] || 'Goodbye @user'
                const text = msg.replace('@user', `@${participants[0].split('@')[0]}`)
                await sock.sendMessage(id, { text, mentions: participants })
            }
        } catch(e) { console.log(e) }
    })

    // ============ ANTI DELETE ============
    sock.ev.on('messages.update', async (updates) => {
        for(const { key, update } of updates) {
            if(update.message === null && db.antidel[key.remoteJid]) {
                await sock.sendMessage(key.remoteJid, { text: `🚨 Someone deleted a message`})
            }
        }
    })

    // ============ COMMAND HANDLER ============
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if(!msg.message || msg.key.remoteJid === 'status@broadcast') return

        const from = msg.key.remoteJid
        const body = Object.values(msg.message)[0]?.text || msg.message.conversation || ''
        if(!body.startsWith(PREFIX)) return

        const args = body.slice(PREFIX.length).trim().split(/ +/)
        const cmdName = args.shift().toLowerCase()

        const command = commands.get(cmdName)
        if(!command) return

        // Owner check
        const sender = jidNormalizedUser(msg.key.participant || msg.key.remoteJid)
        const isOwner = OWNER.includes(sender.split('@')[0])
        if(command.ownerOnly &&!isOwner) {
            return sock.sendMessage(from, { text: '❌ Owner only command' }, { quoted: msg })
        }

        try {
            await command.execute(sock, msg, args, { db, OWNER, PREFIX, MODE })
        } catch(e) {
            console.error(e)
            await sock.sendMessage(from, { text: '❌ Error executing command' }, { quoted: msg })
        }
    })
}

connect() 
