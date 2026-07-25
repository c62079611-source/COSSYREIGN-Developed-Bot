const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const readline = require('readline');

const SESSION_DIR = './sessions';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR);
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    let usePairingCode = false;
    let userPhone = "";

    if (!state.creds.registered) {
        const choice = await question('\n🔰 COSSY REIGN LOGIN\n[1] QR Code\n[2] Pairing Code/Numericals\nChoose 1 or 2: ');

        if (choice.trim() === '2') {
            usePairingCode = true;
            userPhone = await question('Enter your WhatsApp number with country code e.g +2547xxxxxxx: ');
        } else {
            console.log('QR Mode selected. Scan the QR below...');
        }
    } else {
        console.log('Found saved session. Connecting...');
    }

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal:!usePairingCode,
        logger: pino({ level: 'info' }),
        browser: ['COSSY-REIGN', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    if (usePairingCode &&!sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = await sock.requestPairingCode(userPhone.replace(/[^0-9]/g, ''));
            console.log(`\n🔢 YOUR PAIRING CODE: ${code}`);
            console.log('Go to WhatsApp > Settings > Linked Devices > Link with phone number\n');
        }, 3000);
    }

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = code!== DisconnectReason.loggedOut;
            console.log(`❌ Disconnected. Reason: ${code}. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) startBot();
            else rl.close();
        } else if (connection === 'open') {
            console.log('✅ COSSY REIGN BOT IS ONLINE');
            rl.close();
        }
    });

    // ========== GROUP WELCOME + GOODBYE ==========
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        try {
            const metadata = await sock.groupMetadata(id);
            const groupName = metadata.subject;

            for (const participant of participants) {
                const ppUrl = await sock.profilePictureUrl(participant, 'image').catch(() => 'https://i.imgur.com/2DZr4Lv.png');

                if (action === 'add') {
                    // WELCOME
                    await sock.sendMessage(id, {
                        text: `👋 Welcome @${participant.split('@')[0]} to *${groupName}*!\n\nPlease read group rules and have fun 🎉`,
                        mentions: [participant]
                    });
                } else if (action === 'remove') {
                    // GOODBYE
                    await sock.sendMessage(id, {
                        text: `👋 Goodbye @${participant.split('@')[0]}\nWe will miss you from *${groupName}*`,
                        mentions: [participant]
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    });

    // ========== STATUS VIEW ==========
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const from = m.key.remoteJid;
        const isStatus = from === 'status@broadcast';

        // AUTO VIEW STATUS
        if (isStatus) {
            await sock.readMessages([m.key]);
            console.log('👀 Viewed status from:', m.key.participant);
            return;
        }

        // YOUR OTHER COMMANDS GO HERE
        const text = m.message.conversation || m.message.extendedTextMessage?.text;
        if (!text || m.key.fromMe) return;

        // EXAMPLE COMMAND
        if (text.toLowerCase() === '.ping') {
            await sock.sendMessage(from, { text: 'pong 🏓' }, { quoted: m });
        }
    });
}

startBot ();
