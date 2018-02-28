
module.exports ={
    getdialog:(bot,builder)=>{
        /*// Add first run dialog
         bot.dialog('firstRun', function (session) {
            session.userData.firstRun = true;
            session.send("Hello...I am here to give you an appointment with Mr X").endDialog();
        }).triggerAction({
            onFindAction: function (context, callback) {
                // Only trigger if we've never seen user before
                if (!context.userData.firstRun) {
                    // Return a score of 1.1 to ensure the first run dialog wins
                    callback(null, 1.1);
                } else {
                    callback(null, 0.0);
                }
            }
        }); */
        bot.dialog('greetings', [
            function (session) {
                session.beginDialog('askName');
            },
            function (session, results) {
                session.endDialog('Hello %s!', results.response);
            }
        ]);
        bot.dialog('askName', [
            function (session) {
                builder.Prompts.text(session, 'Hi! What is your name?');
            },
            function (session, results) {
                session.endDialogWithResult(results);
            }
        ]);
        bot.dialog('ensureProfile', [
            function (session, args, next) {
                session.dialogData.profile = args || {}; // Set the profile or create the object.
                if (!session.dialogData.profile.name) {
                    builder.Prompts.text(session, "What's your name?");
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
                if (results.response) {
                    // Save user's name if we asked for it.
                    session.dialogData.profile.name = results.response;
                }
                if (!session.dialogData.profile.company) {
                    builder.Prompts.text(session, "What company do you work for?");
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results) {
                if (results.response) {
                    // Save company name if we asked for it.
                    session.dialogData.profile.company = results.response;
                }
                session.endDialogWithResult({ response: session.dialogData.profile });
            }
        ]);
        bot.dialog('help', function (session, args, next) {
            session.endDialog("This is a bot that can help you make a appointment. <br/>Please say 'next' to continue");
        })
        .triggerAction({
            matches: /^help$/i,
        });
        bot.dialog('cancel',function (session, args, next) {
            session.endDialog("Last task cancelled.")
        })
        .triggerAction({
            matches: /^cancel$/i,
        });
    }
}