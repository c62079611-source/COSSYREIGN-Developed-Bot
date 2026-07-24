module.exports = {
    name: 'tts',
    command: ['tts'],
    description: 'Text to speech',
    execute: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: `🔊 TTS: ${args.join(' ')}\nAdd google-tts to make voice` })
    }
} 
