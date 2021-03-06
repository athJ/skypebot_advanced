
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
        session.send("Welcome ,I am here to help you make a appointment.");
        builder.Prompts.time(session, "Please provide a appointment date and time suitable for you (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.appointmentDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "How many people are coming with you ?");
    },
    function (session, results) {
        session.dialogData.groupSize = Number(results.response)+1;
        builder.Prompts.text(session, "Who's name will this appointment be under?");
    },
    function (session, results) {
        session.dialogData.appointmentName = results.response;

        // Process request and display reservation details
        session.send(`Appointment confirmed. Appointment details: <br/>Date/Time: ${new Date(session.dialogData.appointmentDate).toString()} <br/>Group size: ${session.dialogData.groupSize} <br/>Appointment name: ${session.dialogData.appointmentName}`);
        session.endDialog();
    }
]

).set('storage', inMemoryStorage); // Register in-memory storage 

// Import events 
event.addeventtrigger(bot,builder);
// Add first run dialog
dialog.getdialog(bot,builder)
