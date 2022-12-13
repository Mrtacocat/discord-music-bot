
const { EmbedBuilder } = require("discord.js")

module.exports = {
	name: "guildMemberAdd",
	async execute(member) {

		const newMemberEmbed = new EmbedBuilder()
        .setColor("#d81e5b")
        .setTitle(`You're our ${member.guild.memberCount}th member!`)
        .setDescription(`${member.user} has joined the server! Welcome!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

        member.guild.channels.cache.get("319901962843717652").send({ 
            embeds: [newMemberEmbed] 
        })
	}
}
