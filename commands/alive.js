module.exports = {
    name: 'alive',
    command: ['alive', 'up'],
    description: 'Shows bot status with logo',

    execute: async (sock, msg) => {
        try {
            const from = msg.key.remoteJid;

            // Bot uptime
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Current date & time
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();

            const caption = `
╭━━〔 👑 COSSY REIGN 👑 〕━━⬣
┃
┃ 🤖 *Bot Status:* Online ✅
┃ ⚡ *Speed:* Stable
┃ 🕒 *Uptime:* ${hours}h ${minutes}m ${seconds}s
┃ 📅 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ 📌 *Prefix:* .
┃ 🚀 *Version:* 1.0.0
┃ 👑 *Developer:* COSSY REIGN
┃
╰━━━━━━━━━━━━━━━━━━⬣

💎 *Your trusted WhatsApp assistant is online and ready to serve!*
            `;

            await sock.sendMessage(from, {
                image: {
                    url: "https://cdn.imgchest.com/files/4204754f3eae.jpg"
                },
                caption: caption
            }, {
                quoted: msg
            });

        } catch (err) {
            console.error("Alive Command Error:", err);

            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ Failed to execute the alive command."
            });
        }
    }
}; 
