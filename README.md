# Skype bot using botbuilder
 The bot can be tested locally using the BotFramework-Emulator.
 This bot helps set a appointment for a given date and time
 It uses some advanced features for bot builder framework like the datetime parser,
 the createpro.js file can be run to get the dialogs to store the user data in memory(Bot state)
 to learn more about bot state visit https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-state.
 The components for the bot have been seperated into modules 
	1. app.js - Runs the server and imports all the module and also contains the default dialog
	2. dialog.js - Has all the dialogs for bot app.js and createpro.js
	3. event.js - Has actions for all the events triggered by the client

### The bot reacts to the following events 
	1. When bot is added to a group 
	2. Starting a conversation with someone
	3. New member is added to the conversation
	4. When the bot is removed from a conversation
	5. When a user starts typing 
	6. When a user pings the bot 
#### The emulator can be downloaded from https://github.com/Microsoft/BotFramework-Emulator
