module.exports = {
    name: 'info',
    command: ['info', 'botinfo'],
    description: 'Bot info',
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `👑 COSSY REIGN V7.0\nCreator: COSSY\nCommands: 25+\nMode: ${process.env.MODE}` })
    }
} 
