module.exports = {
    name: 'quote',
    command: ['quote'],
    description: 'Get random quote',
    execute: async (sock, msg) => {
        const quotes = ["Stay Hungry", "Work in silence", "Be the king", "COSSY REIGN"]
        await sock.sendMessage(msg.key.remoteJid, { text: `👑 ${quotes[Math.floor(Math.random()*quotes.length)]}` })
    }
} 
