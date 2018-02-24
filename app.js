
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    if(session.message.text)
    console.log(session.message)
    session.send("You said: %s", session.message.text);
});
//When the bot is added to a conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        // Say hello
        var isGroup = message.address.conversation.isGroup;
        var txt = isGroup ? "Hello everyone!" : "Hello..."+message.membersAdded[0].name;
        var reply = new builder.Message()
                .address(message.address)
                .text(txt);
        bot.send(reply);
    } else if (message.membersRemoved) {
        // See if bot was removed
        var botId = message.address.bot.id;
        for (var i = 0; i < message.membersRemoved.length; i++) {
            if (message.membersRemoved[i].id === botId) {
                console.log('The bot was removed...............')
                // Say goodbye
                var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                bot.send(reply);
                break;
            }
        }
    }
});
bot.on('contactRelationUpdate', function (message) {
    var isGroup = message.address.conversation.isGroup;
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hey %s... Thanks for adding me.", name || 'there');
        bot.send(reply);
    }else if(message.action === 'remove') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("It was great talking to you %s... see you next time.", isGroup?'all':name || 'there');
        bot.send(reply);
    }
});
bot.on('typing', function (message) {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
        .address(message.address)
        .text("I am eager to hear what you have to say %s",name);
    bot.send(reply);
});

bot.on('deleteUserData', function (message) {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
        .address(message.address)
        .text("Data for %s deleted",name);
    bot.send(reply);
});
bot.on('ping', function (message) {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
        .address(message.address)
        .textFormat("markdown")
        .textLocale("en-us")
        .text("### How can I help you %s ?",name);
    bot.send(reply);});

// Add first run dialog
bot.dialog('firstRun', function (session) {    
    session.userData.firstRun = true;
    session.send("Hello...").endDialog();
}).triggerAction({
    onFindAction: function (context, callback) {
        // Only trigger if we've never seen user before
        if (!context.userData.firstRun && session.message.channelId !=='emulator') {
            // Return a score of 1.1 to ensure the first run dialog wins
            callback(null, 1.1);
        } else {
            callback(null, 0.0);
        }
    }
});
