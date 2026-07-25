module.exports = {
    name: 'setwelcome',
    command: ['setwelcome'],
    description: 'Set welcome message',
    ownerOnly: true,
    execute: async (sock, msg, args, { db }) => {
        const from = msg.key.remoteJid;
        if(!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Only in groups' });
        db.welcome[from] = args.join(' ') || 'Welcome to the group!';
        await sock.sendMessage(from, { text: `✅ Welcome message set` });
    }
          } 
