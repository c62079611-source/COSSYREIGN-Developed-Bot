module.exports = {
    name: 'antidel',
    command: ['antidel'],
    description: 'Toggle anti delete',
    ownerOnly: true,
    execute: async (sock, msg, args, { db }) => {
        const from = msg.key.remoteJid;
        db.antidel[from] =!db.antidel[from];
        await sock.sendMessage(from, { text: `✅ AntiDelete: ${db.antidel[from]? 'ON' : 'OFF'}` });
    }
      } 
