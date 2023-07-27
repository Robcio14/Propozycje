const { EmbedBuilder, ButtonBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const ustawienia = require(`${process.cwd()}/botconfig/ustawienia.json`);

module.exports = {
    name: "messageCreate",
    async execute (message,client)  {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (message.partial) await message.fetch();
    
        var suggestChannel = ustawienia.Propozycje.Kanal;
        if (!suggestChannel) return;
    
        if (message.channel.id === suggestChannel) {
          if (hasLink(message.content)) return;
          setTimeout(() => message.delete(), 1000);
    
          const btn_up = new ButtonBuilder()
            .setLabel(`0`)
            .setEmoji('934577543456112681')
            .setStyle('SECONDARY')
            .setCustomId('Propozycja_za')
            .setDisabled(false);
          const btn_down = new ButtonBuilder()
            .setLabel(`0`)
            .setEmoji('934577543422558218')
            .setStyle('SECONDARY')
            .setCustomId('Propozycja_przeciw')
            .setDisabled(false);
          const btn_who = new ButtonBuilder()
            .setLabel('Kto zagłosował?')
            .setEmoji('❓')
            .setStyle('PRIMARY')
            .setCustomId('Propozycja_kto')
            .setDisabled(false);
          const row = new ActionRowBuilder()
            .addComponents([btn_up, btn_down, btn_who]);
          var embed = new EmbedBuilder()
            .setAuthor({ name: `Propozycja: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`
          **Treść propozycji:**
          > ${message.content}
          `)
            .addFields([
              { name: `Status głosów:`, value: `- Głosy za: \`0\` | **0%**\n- Głosy przeciw: \`0\` | **0%**`, inline: false },
              { name: `Jak zagłosować?`, value: `Użyj jednego z dwóch przycisków zamieszczonych pod wiadomością propozycji.\n${emoji.msg.sukces} - Jestem za tą propozycją\n${emoji.msg.blad} - Jestem przeciwko tej propozycji`, inline: false }
            ])
            .setThumbnail(ee.footericon)
            .setImage(`https://cdn.discordapp.com/attachments/1010926279698157588/1010932971513065563/unknown.png`)
            .setColor(ee.color).setTimestamp().setFooter({ text: `Masz jakąś ciekawą propozycje? Napisz ją na tym kanale!`, iconURL: ee.footericon });
    
          message.channel.send({
            embeds: [embed],
            components: [row]
          }).then(async (m) => {
            m.startThread({
              name: `Debata na temat propozycji`,
              autoArchiveDuration: 60,
              type: 'GUILD_PUBLIC_THREAD'
            });
    
            client.propozycje.ensure(m.id, {
              upvotes: 0,
              downvotes: 0,
              user: message.author.id,
              voted_ppl: [],
              downvoted_ppl: [],
              createdAt: Date.now(),
            });
          });
        }
      }
    
};