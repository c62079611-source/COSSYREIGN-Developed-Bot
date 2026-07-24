module.exports = {
    name: 'ping',
    command: ['ping', 'p'],
    description: 'Check bot speed',
    ownerOnly: true,
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const start = Date.now()
        let m = await sock.sendMessage(from, { text: '👑 COSSY REIGN PONG...' })
        const end = Date.now()
        await sock.sendMessage(from, { text: `Speed: ${end - start}ms`, edit: m.key })
    }
} 
