module.exports = {
    name: 'antilink',
    command: ['antilink'],
    description: 'Toggle antilink on/off',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        if(args[0] === 'on') {
            global.antilink = global.antilink || []
            global.antilink.push(from)
            await sock.sendMessage(from, { text: '✅ Antilink ON. Group links will be deleted' })
        } else {
            global.antilink = global.antilink.filter(g => g!== from)
            await sock.sendMessage(from, { text: '❌ Antilink OFF' })
        }
    }
} 
