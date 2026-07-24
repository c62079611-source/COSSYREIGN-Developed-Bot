module.exports = {
    name: 'ai',
    command: ['ai', 'gpt'],
    description: 'Chat with AI',
    execute: async (sock, msg, args) => {
        const text = args.join(' ')
        if(!text) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Use:.ai who are you' })
        await sock.sendMessage(msg.key.remoteJid, { text: `🤖 COSSY AI:\nYou asked: "${text}"\n\nReply: I am COSSY REIGN V7.0 👑` })
    }
  } 
