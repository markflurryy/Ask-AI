module.exports = {
config : {
  name: "gemini",
  role: 0,
  author: "Deku",
  description: "can describe picture",
  version: "5.6.7",
  aliases: ["bard"],
  usage: "gemini [picture-url]"
},

onStart: async function ({ api, event, args }) {
  const axios = require("axios");
  let uid = event.senderID,
    url;
  if (event.type == "message_reply") {
    if (event.messageReply.attachments[0]?.type == "photo") {
      url = encodeURIComponent(event.messageReply.attachments[0].url);
      api.sendTypingIndicator(event.threadID);
      try {
        const response = (await axios.get(`https://deku-rest-api.replit.app/gemini?prompt=describe%20this%20photo&url=${url}&uid=${uid}`)).data;
        return api.sendMessage(response.gemini, event.threadID);
      } catch (error) {
        console.error(error);
        return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
      }
    } else {
      return api.sendMessage('Please reply to an image.', event.threadID);
    }
  } else {
    return api.sendMessage(`Please enter a picture URL or reply to an image with "gemini answer this".`, event.threadID);
  }
}
};
