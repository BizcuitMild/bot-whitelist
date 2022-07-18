const Discord = require('discord.js')
const { Permissions } = require('discord.js');
const db = require('quick.db');
module.exports = {
    name: "check",
    description: "WebhookSet",
    run: async (client, interaction) => {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("RED").setTitle("คุณไม่มีสิทธิ์ตั้งค่า")]}).then(a => {
            setTimeout(function() {
            interaction.deleteReply()
            }, 5000)
        }).catch()
        interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setDescription(`ไอดีห้อง : ${db.get(`${interaction.guildId}.webhooklink`)}\nไอดียศ : ${db.get(`${interaction.guildId}.role`)}`)]})
    },
};