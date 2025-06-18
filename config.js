module.exports = {
    start: {
      text: "📱 *MAIN MENU* 📱\n\n1. Educational Help\n2. Open Technical Support Ticket\n\nEnter the number of your choice:",
      options: {
        '1': { nextState: 'educational_help' },
        '2': { nextState: 'open_ticket' }
      }
    },
    educational_help: {
      text: "📚 *EDUCATIONAL HELP* 📚\n\n1. Access Portal\n2. Login Issues\n3. Study Materials\n\nEnter the number of your choice:",
      options: {
        '1': { action: 'sendLink', value: 'https://example.com/portal' },
        '2': { action: 'sendLink', value: 'https://example.com/login' },
        '3': { action: 'sendLink', value: 'https://example.com/materials' }
      }
    },
    open_ticket: {
      text: "🔧 To open a support ticket, visit:\nhttps://example.com/support\n\nLog in with your account.",
      options: null
    }
  };
  