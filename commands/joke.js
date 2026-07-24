module.exports = {
    name: 'joke',
    command: ['joke'],
    description: 'Random joke',
    execute: async (sock, msg) => {
        const jokes = ["Why did bot cross road? To reply faster", "I am not lazy, I am in power saving mode"]
        await sock.sendMessage(msg.key.remoteJid, { text: `😂 ${jokes[Math.floor(Math.random()*jokes.length)]}` })
    }
} 
