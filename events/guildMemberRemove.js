const { EmbedBuilder } = require("discord.js")

module.exports = {
	name: "guildMemberRemove",
	async execute(member) {

		const newMemberEmbed = new EmbedBuilder()
        .setColor("#d81e5b")
        .setTitle(`We're down to ${member.guild.memberCount} members!`)
        .setDescription(`${member.user} has left the server!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

        member.guild.channels.cache.get("319901962843717652").send({ 
            embeds: [newMemberEmbed] 
        })
	}
}
