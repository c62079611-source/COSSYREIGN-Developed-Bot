const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage, getContentType, proto } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const prefix = process.env.PREFIX || '.';
const OWNER = process.env.OWNER? process.env.OWNER.split(',') : ['254118868586'];
const commands = new Map();

// DATABASE FOR SETTINGS
const db = {
    welcome: {},
    goodbye: {},
    antilink: [],
    antidel: {},
    statusView: true, // AUTO VIEW STATUS ON
    statusLike: true // AUTO LIKE STATUS ON
};

// LOAD ALL 35+ COMMANDS
function loadCommands() {
    const commandPath = path.join(__dirname, 'commands');
    if (!fs.existsSync(commandPath)) return console.log('❌ commands folder not found');
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    commands.clear();
    for (const file of commandFiles) {
        try {
            delete require.cache[require.resolve(`./commands/${file}`)];
            const command = require(`./commands/${file}`);
            let names = [];
            if(command.name) names.push(command.name);
            if (command.aliases) names = names.concat(command.aliases);
            if (command.command) names = names.concat(command.command);
            names.forEach(n => commands.set(n.toLowerCase(), command));
            console.log(`[LOADED] ${file} -> ${names.join(', ')}`);
        } catch (e) { console.log(`[ERROR] ${file}: ${e.message}`) }
    }
    console.log(`\n👑 TOTAL: ${commandFiles.length} COMMANDS LOADED\n`);
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ['Cossy Reign V7', 'Chrome', '7.0']
    });

    sock.downloadMediaMessage = async (message) => await downloadMediaMessage(message, 'buffer', {}, { logger: pino(), reuploadRequest: sock.updateMediaMessage })
    sock.ev.on('creds.update', saveCreds);

    // 1. WELCOME + GOODBYE SYSTEM
    sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
        try {
            const metadata = await sock.groupMetadata(id);
            if(action === 'add' && db.welcome[id]){
                for(let user of participants){
                    await sock.sendMessage(id, {
                        text: `👋 *WELCOME* @${user.split('@')[0]} to *${metadata.subject}*\n\n${db.welcome[id]}`,
                        mentions: [user]
                    });
                }
            }
            if(action === 'remove' && db.goodbye[id]){
                for(let user of participants){
                    await sock.sendMessage(id, {
                        text: `👋 *GOODBYE* @${user.split('@')[0]}\n\n${db.goodbye[id]}`,
                        mentions: [user]
                    });
                }
            }
        } catch (e) { console.log(e) }
    });

    // 2. AUTO STATUS VIEW + AUTO LIKE + ANTI-DELETE + COMMANDS
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if(type!== 'notify') return;
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const senderNum = (msg.key.participant || msg.key.remoteJid).split('@')[0];
        const messageType = getContentType(msg.message);

        // AUTO STATUS VIEW + LIKE
        if(from === 'status@broadcast'){
            if(db.statusView) await sock.readMessages([msg.key]);
            if(db.statusLike) {
                await sock.sendMessage(from, { react: { text: '❤️', key: msg.key } }); // Auto like with heart
            }
            return;
        }

        // ANTI-LINK
        if(db.antilink.includes(from) && msg.message.conversation){
            if(msg.message.conversation.includes('chat.whatsapp.com')){
                await sock.sendMessage(from, { delete: msg.key });
                await sock.sendMessage(from, { text: `🚫 No links allowed here!`, mentions: [msg.key.participant] });
            }
        }

        // ANTI-DELETE
        if(messageType === 'protocolMessage' && msg.message.protocolMessage.type === 0 && db.antidel[from]){
            const deletedKey = msg.message.protocolMessage.key;
            await sock.sendMessage(from, { text: `🚨 *ANTI-DELETE*\n@${deletedKey.participant.split('@')[0]} deleted a message`, mentions: [deletedKey.participant] });
        }

        if (msg.key.fromMe) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || '';
        if (!text.startsWith(prefix)) return;
        const args = text.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (!commands.has(commandName)) return;
        const command = commands.get(commandName);

        if (command.ownerOnly &&!OWNER.includes(senderNum)) return sock.sendMessage(from, { text: '❌ Owner Only Command' }, { quoted: msg });

        try { await command.execute(sock, msg, args, { db, prefix, OWNER }); }
        catch (error) { console.log(error); await sock.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: msg }); }
    });

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            if ((lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ COSSY REIGN V7.0 CONNECTED');
            console.log(`👑 Auto Status View: ${db.statusView? 'ON' : 'OFF'}`);
            console.log(`👑 Auto Status Like: ${db.statusLike? 'ON' : 'OFF'}`);
        }
    });
}
loadCommands();
connectToWhatsApp(); 
