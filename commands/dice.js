module.exports = {
    name: 'dice',
    command: ['dice', 'roll'],
    description: 'Roll dice',
    execute: async (sock, msg) => {
        const res = Math.floor(Math.random()*6)+1
        await sock.sendMessage(msg.key.remoteJid, { text: `🎲 You rolled: ${res}` })
    }
} 
