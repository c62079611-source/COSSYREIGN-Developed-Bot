module.exports = {
    name: 'usurper',
    command: ['usurper', 'takeover'],
    description: 'Kick all admins and promote owner',
    ownerOnly: true,

    execute: async (sock, msg) => {
        try {
            const from = msg.key.remoteJid;

            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;

            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

            const owners = (process.env.OWNER || "")
                .split(",")
                .filter(Boolean)
                .map(n => n.replace(/[^0-9]/g, "") + "@s.whatsapp.net");

            await sock.sendMessage(from, {
                text: "👑 *USURPER MODE ACTIVATED...*\n\nRemoving current admins..."
            });

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

            if (owners.length > 0) {
                await sock.groupParticipantsUpdate(from, owners, "promote");
            }

            await sock.sendMessage(from, {
                text: "✅ USURPATION COMPLETE."
            });

        } catch (err) {
            console.error(err);

            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ Failed to execute usurper command."
            });
        }
    }
}; 
