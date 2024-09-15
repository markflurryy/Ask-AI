-cmd install tempmail.js const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    aliases: ["temp", "mail"],
    version: "1.0.0",
    author: "ch4n",//change credit if you gay
    role: 0,
    shortDescription: {
      en: "Generates a temporary email address and checks the inbox."
    },
    longDescription: {
      en: "Generates a temporary email address and optionally checks the inbox for messages."
    },
    category: "utility",
    guide: {
      en: "Use {p}tempmail to generate a new temporary email. Use {p}tempmail check to check the inbox for messages."
    },
    cooldown: 5,
  },
  onStart: async function ({ api, event, args }) {
    const command = args[0]; // 'check' or empty

    if (!command || command === "gen") {
      // Generate a new temporary email address
      try {
        const response = await axios.get('https://c-v1.onrender.com/tempmail/gen');
        const email = response.data.email;

        api.sendMessage(`📧 | your generated email: ${email}`, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        api.sendMessage('An error occurred while generating the temporary email.', event.threadID, event.messageID);
      }
    } else if (command === "inbox") {
      const email = args[1]; // Email to check, should be provided in the second argument

      if (!email) {
        return api.sendMessage('Please provide the temporary email address to check.', event.threadID, event.messageID);
      }

      // Check the inbox for the provided temporary email address
      try {
        const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(email)}`);
        const messages = response.data;

        if (messages.length > 0) {
          let messageList = messages.map((msg, index) => `#${index + 1} From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}`).join('\n\n');
          api.sendMessage(`📬 | checked Inbox for ${email}:\n\n${messageList}`, event.threadID, event.messageID);
        } else {
          api.sendMessage('📭 | Your inbox is empty.', event.threadID, event.messageID);
        }
      } catch (error) {
        console.error(error);
        api.sendMessage('❌ | An error occurred while checking the inbox.', event.threadID, event.messageID);
      }
    } else {
      api.sendMessage( '❌ | Invalid command.\n Use tempmail\n\n-tempmail gen\n\nto generate a new email.\nand Use\n\n-tempmail inbox (email)\n\nto check the inbox.', event.threadID, event.messageID);
    }
  }
};
