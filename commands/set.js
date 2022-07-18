const Discord = require('discord.js')
const { Modal, TextInputComponent, showModal } = require('discord-modals') 
const { Permissions } = require('discord.js');
module.exports = {
    name: "set",
    description: "ตั่งค่าระบบ",
    run: async (client, interaction) => {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("RED").setTitle("`คุณไม่มีสิทธิ์ตั้งค่า💥`")]}).then(a => {
            setTimeout(function() {
            interaction.deleteReply()
            }, 5000)
        }).catch()
        const modal = new Modal() 
        .setCustomId('webhookconfig')
        .setTitle(`ตั้งค่าเว็บฮุค`)
        .addComponents(
          new TextInputComponent()
          .setCustomId("webhooklink")
          .setLabel("ไอดีห้อง")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(30)
          .setPlaceholder("ไอดีห้อง")
          .setRequired(true),
          new TextInputComponent()
          .setCustomId("roleid")
          .setLabel("ไอดียศ")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(30)
          .setPlaceholder("ไอดียศ")
          .setRequired(true)
          );

        showModal(modal, {
            client: client, 
            interaction: interaction
          })

    },
};