module.exports = {
    name: 'alive',
    command: ['alive', 'up'],
    description: 'Bot status with image',
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        
        const caption = `👑 *COSSY REIGN IS ALIVE* 👑\n\nStatus: Online ✅\nPrefix: .\nVersion: 1.0.0\nPowered by COSSY REIGN`
        
        await sock.sendMessage(from, {
            image: { url: 'https://i.ibb.co/XYZ123/cossy-logo.jpg' }, // <-- replace with your bot image
            caption: caption
        })
    }
} 
