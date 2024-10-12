const axios = require("axios");

module.exports = {
  config: {
    name: "bible",
    version: "1.0",
    author: "Ace",
    countDown: 10,
    role: 0,
    description: "Random Bible Verse",
    category: "𝗘𝗗𝗨𝗖𝗔𝗧𝗜𝗢𝗡"
  },
  onStart: async function ({ api, event, message }) {
    const sentMessage = await message.reply("📖 Retrieving a random Bible verse...");

    try {
      const res = await axios.get("https://bible-api.com/?random=verse");
      const verseData = res.data;

      if (verseData && verseData.verses && verseData.verses.length > 0) {
        const verse = verseData.verses[0];
        const responseMessage = `📜 ${verseData.reference}\n\n${verse.text}\n\nTranslation: ${verseData.translation_name}`;
        
        return api.editMessage(responseMessage, sentMessage.messageID);
      } else {
        throw new Error("Invalid response from the Bible API.");
      }

    } catch (error) {
      return api.editMessage(`An error occurred while retrieving the Bible verse: ${error.message}`, sentMessage.messageID);
    }
  }
};
