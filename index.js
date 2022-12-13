const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")
const { Client, GatewayIntentBits } = require('discord.js');
const colors = require('colors');

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "537963608022188032"
const GUILD_ID = "182868145495605253"

const client = new Client({ intents: [	
    GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildVoiceStates, 
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
] });


const eventFiles = fs
	.readdirSync("./events")
	.filter(file => file.endsWith(".js"));
    console.log("----------------------------------------".yellow);
for (const file of eventFiles) {
   
	const event = require(`./events/${file}`);
	
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
        console.log(`[EVENTS] Couldn't load the file ${file}, missing name or aliases`.red.bold)
	} else {
		client.on(event.name, (...args) => event.execute(...args, commands));
        console.log(`[EVENTS] Loaded a file`.green)
	}
   
}
console.log("----------------------------------------".yellow);
client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []


const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log("----------------------------------------".yellow);
        console.log(`[SLASH] Loaded a file`.green)
        console.log("----------------------------------------".yellow);
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}





