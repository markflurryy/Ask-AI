const { getStreamFromURL } = require("fb-watchman");
module.exports = {
  config: {
    name: "info",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "info about bot and owner",
    category: "ai",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const imgURL = "https://i.imgur.com/8qfUABI.jpeg";
    const attachment = await global.utils.getStreamFromURL(imgURL);

    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;

    const ment = [{ id: id, tag: name }];
    const a = "Alice Bot";
    const b = " - ";
    const c = "Mark";
const e = "Male";
    const d = "https://facebook.com/markflurry14";
const f = "https://www.instagram.com/markflurry14";
const g = "none";
    message.reply({ 
      body: `${name}, here is the information 🌝
🎀 Bot's Name: ${a}
🎀 Bot's prefix: ${b}  
🎀 Owner: ${c}
🎀 Gender: ${e}
🎀 Facebook: ${d}
🎀 Insta: ${f}
🎀 Relationship: ${g}`,
mentions: ment,
      attachment: attachment });
  }
};
