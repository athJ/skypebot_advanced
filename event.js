module.exports = {
    addeventtrigger:(bot,builder)=>{
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
    }
}
//When the bot is added to a conversation

