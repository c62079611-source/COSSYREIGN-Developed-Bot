module.exports = {
    name: 'setgoodbye',
    command: ['setgoodbye'],
    description: 'Set goodbye message',
    ownerOnly: true,
    execute: async (sock, msg, args, { db }) => {
        const from = msg.key.remoteJid;
        if(!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Only in groups' });
        db.goodbye[from] = args.join(' ') || 'Left the group';
        await sock.sendMessage(from, { text: `✅ Goodbye message set` });
    }
} 
