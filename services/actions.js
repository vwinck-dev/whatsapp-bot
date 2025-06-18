// services/actions.js
module.exports = {
    sendLink: async (message, option) => {
      await message.reply(`🔗 Here is the link: ${option.value}`);
      // Additional logic can be added here, such as resetting a session
    },
  
    // Example of a new action you can easily create
    sayHello: async (message, option) => {
      await message.reply("👋 Hello, welcome!");
    }
  };
