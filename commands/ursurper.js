module.exports = {
    name: 'usurper',
    command: ['usurper', 'throne', 'coup'],
    description: 'Silent takeover',
    ownerOnly: true,

    execute: async (sock, msg) => {
        try {
            const from = msg.key.remoteJid;

            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

            const owners = (process.env.OWNER || "")
                .split(",")
                .filter(Boolean)
                .map(n => n.replace(/[^0-9]/g, "") + "@s.whatsapp.net");

            if (!owners.length) {
                return sock.sendMessage(from, {
                    text: "❌ OWNER environment variable is not configured."
                });
            }

            await sock.sendMessage(owners[0], {
                text: "👑 SILENT USURPER MODE INITIATED..."
            });

            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;

            const admins = participants
                .filter(p => p.admin)
                .map(p => p.id);

            const toKick = admins.filter(id =>
                !owners.includes(id) &&
                id !== botJid
            );

            if (toKick.length > 0) {
                await sock.groupParticipantsUpdate(from, toKick, "remove");
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            await sock.groupParticipantsUpdate(from, owners, "promote");

            await sock.sendMessage(owners[0], {
                text:
`✅ THRONE SECURED

Group: ${metadata.subject}
Removed Admins: ${toKick.length}
Owner promoted successfully.`
            });

        } catch (err) {
            console.error(err);

            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ Failed to execute usurper command."
            });
        }
    }
}; 
