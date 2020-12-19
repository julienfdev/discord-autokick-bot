# discord-autokick-bot

A Node.js Discord bot which kicks anyone who doesn't introduce himself within a set delay, it grants access to the whole server once the user has reacted to the rules of the server. It also features a fully functional command handler

## Prerequisites

In order for this bot to work, you need to create a Discord App and Bot withing your Discord developers console : 
https://discordpy.readthedocs.io/en/latest/discord.html

## Setup

### Discord-side

On your Discord server, you need to set-up quite a few things : 

- The @everyone pseudo-role shouldn't have access to anything but a "Rules" channel
- Post a message into the rules channels with the rules you want the users to react to
- You need to react to the message with the emoji you want your users to react with
- Set-up a channel you want your bot to send a mean message when a user leaves
- You need to create a role which can access the other channels once the user has reacted to the "rules" post
- Obviously, you need to set-up your permissions as usual to prevent anybody to post into the Rules channel

You will find an "config.example.js" file into the config folder, fill it accordingly and rename it "config.js".

### Node.js-side

Install missing dependencies :

```npm install --save```

Test the bot or run an instance of PM2 :

```node index```
