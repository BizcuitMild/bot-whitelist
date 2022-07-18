const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 32767
});
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require('fs');
const config = require('./config.json')
client.login(config.token)
const express = require('express')
const app = express()
const db = require('quick.db')
app.get('/', function (req, res) {
   res.send('Avenue')
})

app.listen(3000)
process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)
client.on('ready', () => {
    console.log(client.user.tag)
    client.user.setActivity("Playing Avenue Roleplay")
})


const discordModals = require('discord-modals')
discordModals(client);

let commands = [];
fs.readdir('commands', (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
        try {
            let props = require(`./commands/${f}`);
            commands.push({
                name: props.name,
                description: props.description,
                options: props.options
            });
        } catch (err) {
            console.log(err);
        }
    });
});

const rest = new REST({ version: "9" }).setToken(config.token);
client.once("ready", () => {
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await commands,
            });
            console.log("Successfully reloaded application [/] command");
        } catch { };
    })();
});




client.on('modalSubmit', async (modal) => {
    
    const webhook = db.get(`${modal.guildId}.webhooklink`)
    if(modal.customId === "testmo"){
        //if(db.get(modal.guildId) === null) return
        const steamm = modal.getTextInputValue('steamLink')
        const OC = modal.getTextInputValue('OC')
        const discordname = modal.getTextInputValue('discordname')
        const nameIC = modal.getTextInputValue('nameIC')
        const characterTheam = modal.getTextInputValue('characterTheam')
        let a = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`กรอกฟอร์มโดย ${modal.user.tag}`)
        .addFields(
            { name: "ลิงค์ Steam", value: `\`\`\`${steamm}\`\`\``},
            { name: "ชื่อ อายุ เพศ OC", value: `\`\`\`${OC}\`\`\``},
            { name: "ลิงค์เฟส", value: `\`\`\`${discordname} \`\`\``},
            { name: "ชื่อ อายุ บทบาท IC", value: `\`\`\`${nameIC}\`\`\` `},
            { name: " นิสัยตัวละคร", value: `\`\`\`${characterTheam}\`\`\``}
        )
        .setDescription(`คนที่กรอกฟอร์ม <@${modal.user.id}>`)
        .setTimestamp()
        .setThumbnail(modal.user.avatarURL({ dynamic: true}))
        let accept = new Discord.MessageButton()
        .setStyle(`SUCCESS`)
        .setEmoji("✅")
        .setCustomId("accep")

        let unaccept = new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji("❌")
        .setCustomId("unaccep")

        
        let row = new Discord.MessageActionRow().addComponents(accept, unaccept)
        const cid = db.get(`${modal.guildId}.webhooklink`)
        
        var s = client.guilds.cache.get(modal.guildId)
        var f = s.channels.cache.get(cid)
        await modal.guild.channels.cache.get(cid).send({ embeds: [a], components: [row]}).then(yy => {
        db.set(yy.id, modal.user.id)
        })
      
        modal.reply({ content: `**กรอกสำเร็จ โปรดรอแอดมินตอบกลับ**` }).then(a => {
            setTimeout(function() {
                modal.deleteReply()
            }, 5000)
        }).catch()
    }
    if(modal.customId === "webhookconfig"){

        const webhook = modal.getTextInputValue("webhooklink")
        const roleid = modal.getTextInputValue('roleid')
        if(db.get(modal.guildId) === null){
            db.set(modal.guildId, { webhooklink: webhook, role: roleid })
            
            modal.reply({ embeds: [new Discord.MessageEmbed().setColor("GREEN").setTitle("ConfigSuccess")]}).then(a => {
                setTimeout(function() {
                    modal.deleteReply()
                }, 5000)
            }).catch()

        }else{
            db.set(modal.guildId, { webhooklink: webhook, role: roleid })

            modal.reply({ embeds: [new Discord.MessageEmbed().setColor("GREEN").setTitle("NewConfigSuccess")]}).then(a => {
                setTimeout(function() {
                    modal.deleteReply()
                }, 5000)
            }).catch()

        }
    }
})

client.on('interactionCreate', async (interaction) => {
        if(!interaction.isButton()) return
        if (interaction.customId == "accep") {
            const rolee = db.get(`${interaction.guildId}.role`)
            const memm = db.get(interaction.message.id)
            client.guilds.cache.get(interaction.guildId).members.cache.get(memm).roles.add(rolee)
            interaction.message.fetch(interaction.message.id).then(message => {
                message.edit({ content: "✅",components: []})
                db.delete(interaction.message.id)
                client.users.cache.get(memm).send({ embeds: [new Discord.MessageEmbed().setColor('GREEN').setTitle(` คุณได้รับไวริสแล้ว ${interaction.guild.name}`)]}).catch(error => {
                message.edit({ content: "✅ แอดยศแล้วแต่ไม่สามารถส่งข้อความได้",components: []})    
                })
            }).catch(err => {
                console.error(err);
            });
        }

        if (interaction.customId == "unaccep") {
            const memm = db.get(interaction.message.id)
            interaction.message.fetch(interaction.message.id).then(a => {
                a.edit({ content: "❌",components: []})
                db.delete(interaction.message.id)
                client.users.cache.get(memm).send({ embeds: [new Discord.MessageEmbed().setColor('RED').setTitle(` โปรดกรอกไวริสใหม่คุณยังไม่ได้ไวริส `)]}).catch(error => {
                message.edit({ content: "❌ ไม่สามารถส่งข้อความได้",components: []})    
                })
            })
        }
})


client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return

    fs.readdir('commands', (err, files) => {
        if (err) throw err;
        files.forEach(async (f) => {
            let props = require(`./commands/${f}`);
            if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
                try {
                    if ((props?.permissions?.length || [].length) > 0) {
                        (props?.permissions || [])?.map(perm => {
                            if (interaction.member.permissions.has(config.permissions[perm])) {
                                return props.run(client, interaction);
                            } else {
                                return interaction.reply({ content: `Missing permission: **${perm}**`, ephemeral: true });
                            }
                        })
                    } else {
                        return props.run(client, interaction);
                    }
                } catch (e) {
                    return interaction.reply({ content: `Something went wrong...\n\n\`\`\`${e.message}\`\`\``, ephemeral: true });
                }
            }
        });
    });
});

