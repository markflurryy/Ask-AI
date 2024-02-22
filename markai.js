const axios = require('axios');

module.exports = {
    config: {
        name: "markai",
        aliases: [`mark`,`Mark`],
        version: "2.1.0",
        author: "Mark",
        longDescription: "chatgpt",
        category: "Mark CHATBOT",
        guide: {
            en: "{p}{n} questions",
        },
    },
    async makeApiRequest(encodedPrompt, uid, a) {
        try {
            const response = await axios.get(`https://orochiapis.replit.app/gpt?prompt=${encodedPrompt}`);
            return response.data.answer;
        } catch (error) {
            throw error;
        }
    },
    async handleCommand({ message, event, args, api }) {
        try {
            const uid = event.senderID;
            const encodedPrompt = encodeURIComponent(args.join(" "));
            const a = "repl";

            if (!encodedPrompt) {
                return message.reply("🤖 | MARK AI\n\nHello, How can I assist you today!");
            } else {
                const result = await this.makeApiRequest(encodedPrompt, uid, a);

                message.reply({
                    body: `🤖 | MARK AI \n\n${result}`,
                }, (err, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID
                    });
                });
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    },
    onStart: function (params) {
        return this.handleCommand(params);
    },
    onReply: function (params) {
        return this.handleCommand(params);
    },
};
