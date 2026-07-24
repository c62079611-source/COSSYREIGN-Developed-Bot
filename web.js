const express = require('express')
const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')

const app = express()
const PORT = process.env.PORT || 3000

let qr = null
let pairingCode = null
let sock = null

app.use(express.static('public'))

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/qr', async (req, res) => {
    if(qr) {
        const qrImage = await QRCode.toDataURL(qr)
        res.send(`<img src="${qrImage}" style="width:300px"/><h3>Option 1: Scan QR</h3><h3>Option 2: Use Pairing Code Below</h3><h2 style="color:green">${pairingCode || 'Generating...'}</h2>`)
    } else {
        res.send(`<h3>Already Connected</h3><h2 style="color:green">Code: ${pairingCode || 'Check WhatsApp'}</h2>`)
    }
})

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions')
    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['COSSY REIGN', 'Chrome', '7.0']
    })

    // Generate pairing code if no session
    if (!sock.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000))
        const number = process.env.OWNER.split(',')[0] // uses first owner number
        pairingCode = await sock.requestPairingCode(number)
        console.log(chalk.green(`PAIRING CODE: ${pairingCode}`))
    }

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr: qrCode } = update
        if(qrCode) {
            qr = qrCode
            console.log(chalk.yellow('New QR Generated'))
        }
        if(connection === 'open') {
            qr = null
            pairingCode = null
            console.log(chalk.green('✅ WhatsApp Connected!'))
        }
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            if(shouldReconnect) startBot()
        }
    })
}

app.listen(PORT, () => {
    console.log(chalk.cyan(`Website running on port ${PORT}`))
    startBot()
}) 
