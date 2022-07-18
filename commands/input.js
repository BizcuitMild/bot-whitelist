const Discord = require('discord.js')
const config = require("../config.json");
const db = require('quick.db');
const { Modal, TextInputComponent, showModal } = require('discord-modals') 
module.exports = {
    name: "register",
    description: "กรอกไวริสเข้าประเทศ",
    run: async (client, interaction) => {
      if(db.get(interaction.guildId) === null){
        await interaction.reply({ embeds: [new Discord.MessageEmbed().setColor("RED").setTitle("โปรดบอกให้แอดมินตั้งค่าหลังบ้านก่อน")]}).then(a => {
          setTimeout(function() {
            interaction.deleteReply()
          }, 5000)
      }).catch()
      }else{
        const modal = new Modal() 
        .setCustomId('testmo')
        .setTitle(`${interaction.guild.name.substring(0,25)}`)
        .addComponents(
          new TextInputComponent()
          .setCustomId("steamLink")
          .setLabel("ลิงค์ Steam")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(99)
          .setPlaceholder("ลิงค์")
          .setRequired(true),
          new TextInputComponent()
          .setCustomId("OC")
          .setLabel("ชื่อ อายุ เพศOC")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(99)
          .setPlaceholder(" ชื่อ / อายุ / เพศ")
          .setRequired(true),
          new TextInputComponent()
          .setCustomId("discordname")
          .setLabel("ชื่อ Discord , ลิงค์เฟส")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(99)
          .setPlaceholder(" ชื่อดิส / ลิ้งเฟส")
          .setRequired(true),
          new TextInputComponent()
          .setCustomId("nameIC")
          .setLabel("ชื่อ อายุ เพศ IC")
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(99)
          .setPlaceholder(" ชื่อ / อายุ / เพศ")
          .setRequired(true),
          new TextInputComponent()
          .setCustomId("characterTheam")
          .setLabel("ประวัติความเป็นมาตัวละคร")
          .setStyle("LONG")
          .setMinLength(1)
          .setMaxLength(999)
          .setPlaceholder("คำตอบ")
          .setRequired(true)
        );
        showModal(modal, {
            client: client, // Client to show the Modal through the Discord API.
            interaction: interaction, // Show the modal with interaction data.
            ephemeral: true
          })
      }
      
    },
};