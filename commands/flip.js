module.exports = {
    name: 'flip',
    command: ['flip', 'coin'],
    description: 'Flip coin',
    execute: async (sock, msg) => {
        const res = Math.random() > 0.5? 'HEADS' : 'TAILS'
        await sock.sendMessage(msg.key.remoteJid, { text: `🪙 ${res}` })
    }
} 
