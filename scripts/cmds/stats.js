const os = require('os');
const { bold, thin } = require("fontstyles");

module.exports = {
  config: {
    name: 'stats',
    aliases: ['status', 'system'],
    version: '1.0',
    author: 'softrilez',
    countDown: 15,
    role: 0,
    shortDescription: 'Display bot system stats',
    longDescription: {
      id: 'Display bot system stats',
      en: 'Display bot system stats'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot system stats',
      en: '{pn}: Display bot system stats'
    }
  },

  onStart: async function ({ message, event, usersData, threadsData, api }) {
    const startTime = Date.now();

    // Fetch users and groups data
    const users = await usersData.getAll();
    const groups = await threadsData.getAll();

    // Get uptime
    const uptime = process.uptime();

    // Send initial loading message
    const sentMessage = await message.reply(thin("🔄 | Loading please wait..."));

    try {
      // Calculate uptime components
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercentage = (usedMemory / totalMemory * 100).toFixed(2);

      // Get CPU usage and info
      const cpuUsage = os.loadavg();
      const cpuCores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;

      // Get Node.js version and platform
      const nodeVersion = process.version;
      const platform = os.platform();

      // Get network interfaces
      const networkInterfaces = os.networkInterfaces();
      const networkInfo = Object.keys(networkInterfaces).map(interface => {
        return {
          interface,
          addresses: networkInterfaces[interface].map(info => `${info.family}: ${info.address}`)
        };
      });

      const endTime = Date.now();
      const botPing = endTime - startTime;
      const apiPing = sentMessage.timestamp - startTime;

      // Construct message content
      const messageContent = `
        🖥 ${bold("System Statistics")}:\n\n
        • Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s\n
        • Memory Usage: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n
        • Total Memory: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n
        • Free Memory: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n
        • Memory Usage Percentage: ${memoryUsagePercentage}%\n
        • CPU Usage (1m): ${cpuUsage[0].toFixed(2)}%\n
        • CPU Usage (5m): ${cpuUsage[1].toFixed(2)}%\n
        • CPU Usage (15m): ${cpuUsage[2].toFixed(2)}%\n
        • CPU Cores: ${cpuCores}\n
        • CPU Model: ${cpuModel}\n
        • Node.js Version: ${nodeVersion}\n
        • Platform: ${platform}\n
        • Ping: ${botPing}ms\n
        • API: ${apiPing}ms\n
        • Total Users: ${users.length}\n
        • Total Groups: ${groups.length}\n\n
        🌐 ${bold("Network Interfaces")}:\n\n
        ${networkInfo.map(info => `• ${info.interface}: ${info.addresses.join(', ')}`).join('\n')}
      `;

      // Edit the initial loading message with the stats
      return api.editMessage(thin(messageContent), sentMessage.messageID);
    } catch (err) {
      console.error(err);
      return api.editMessage("❌ An error occurred while fetching system statistics.", sentMessage.messageID);
    }
  }
};
