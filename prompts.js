
var restify = require('restify');
var builder = require('botbuilder');
var event = require('./event');
var dialog = require('./dialog');

var inMemoryStorage = new builder.MemoryBotStorage();

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
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("This is prompt example");
        builder.Prompts.time(session, "Please provide a appointment date and time suitable for you (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        builder.Prompts.confirm(session, "Are you sure you wish to proceed ?");
    },
    function (session, results) {
        builder.Prompts.number(session, "How old are you ?");
    },
    function (session, results) {
        builder.Prompts.choice(session, "Which color?", "red|green|blue", { listStyle: 4 });
    },
    function (session, results) {
        builder.Prompts.attachment(session, "Upload a picture for me to transform.");
    },
    function (session, results) {
        builder.Prompts.text(session, "Who's name will this appointment be under?");
    },
    function (session, results) {
        // Process request and display reservation details
        session.send('End of prompts');
        session.endDialog();
    }
]

).set('storage', inMemoryStorage); // Register in-memory storage 

// Import events 
event.addeventtrigger(bot,builder);
// Add first run dialog
dialog.getdialog(bot,builder)
