const axios = require("axios"); 

const EMAIL_API_URL = "https://www.samirxpikachu.run.place/tempmail/get";
const INBOX_API_URL = "https://www.samirxpikachu.run.place/tempmail/inbox/"; 

module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    author: "coffee",
    countDown: 5,
    role: 0,
    category: "tool",
  }, 

  onStart: async function ({ api, args, event }) {
    try {
      if (args.length === 0) {
        return api.sendMessage("Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages.", event.threadID, event.messageID);
      } 

      const command = args[0].toLowerCase(); 

      if (command === "create") {
        let email;
        try {
          // Generate a random temporary email
          const response = await axios.get(EMAIL_API_URL);
          email = response.data.email; 

          if (!email) {
            throw new Error("Failed to generate email");
          }
        } catch (error) {
          console.error("❌ | Failed to generate email", error.message);
          return api.sendMessage(`❌ | Failed to generate email. Error: ${error.message}`, event.threadID, event.messageID);
        }
        return api.sendMessage(`📩 Generated email: ${email}`, event.threadID, event.messageID);
      } else if (command === "inbox" && args.length === 2) {
        const email = args[1];
        if (!email) {
          return api.sendMessage("❌ | Please provide an email address to check the inbox.", event.threadID, event.messageID);
        } 

        let inboxMessages;
        try {
          // Retrieve messages from the specified email
          const inboxResponse = await axios.get(`${INBOX_API_URL}${email}`);
          inboxMessages = inboxResponse.data; 

          if (!Array.isArray(inboxMessages)) {
            throw new Error("Unexpected response format");
          }
        } catch (error) {
          console.error(`❌ | Failed to retrieve inbox messages`, error.message);
          return api.sendMessage(`❌ | Failed to retrieve inbox messages. Error: ${error.message}`, event.threadID, event.messageID);
        } 

        if (inboxMessages.length === 0) {
          return api.sendMessage("❌ | No messages found in the inbox.", event.threadID, event.messageID);
        } 

        // Get the most recent message
        const latestMessage = inboxMessages[0];
        const { date, from, subject } = latestMessage; 

        const formattedMessage = `📧 From: ${from}\n📩 Subject: ${subject}\n📅 Date: ${date}\n━━━━━━━━━━━━━━━━`;
        return api.sendMessage(`━━━━━━━━━━━━━━━━\n📬 Inbox messages for ${email}:\n${formattedMessage}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`❌ | Invalid command. Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages.`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return api.sendMessage(`❌ | An unexpected error occurred: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
