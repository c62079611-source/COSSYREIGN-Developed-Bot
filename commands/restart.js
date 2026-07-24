module.exports = {
    name: 'restart',
    command: ['restart', 'reboot'],
    description: 'Restart bot',
    ownerOnly: true,
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, { text: '♻️ Restarting COSSY REIGN...' })
        setTimeout(() => process.exit(1), 1000)
    }
} 
