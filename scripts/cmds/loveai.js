const axios = require('axios');

const Prefixes = [
  'babyai',
  'lovey',
  'Love',
  'love',
  '-love',
];

module.exports = {
  config: {
    name: "girlfriend",
    aliases: [`gf`],
    version: 1.0,
    author: "Aryan Chauhan",
    longDescription: "AI",
    category: "CHATGPT",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("💕 LOVE:\n\nHello! How can I assist you today.");
        return;
      }


      const response = await axios.get(`https://girlfriend-api.replit.app/gf?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;


    await message.reply(`💕 LOVE:\n\n${answer}`);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
