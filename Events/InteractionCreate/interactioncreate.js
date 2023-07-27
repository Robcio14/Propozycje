const { EmbedBuilder, ButtonBuilder, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);


module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (!interaction.inGuild() || !interaction.isButton()) return;
    if (!interaction.message.guild || !interaction.message.guild.available || !interaction.message.channel) return;
    if (interaction.message.author.id !== client.user.id) return;
    if (!interaction.customId.startsWith("Propozycja_")) return;

    if (interaction.customId.startsWith("Propozycja_")) {
      let SuggestionsData = client.propozycje.get(interaction.message.id);
      if (!SuggestionsData.downvoted_ppl) {
        client.propozycje.set(interaction.message.id, [], "downvoted_ppl");
        SuggestionsData = client.propozycje.get(interaction.message.id);
      }
      if (interaction.customId == "Propozycja_za") {
        if (SuggestionsData.voted_ppl.includes(interaction.user.id)) {
          return interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder()
              .setAuthor(client.getAuthor(ee.authorname, ee.authoricon, ee.authorurl))
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.blad}・Nie możesz dwukrotnie zagłosować na tą samą opcję!`)
            ]
          });
        } else {
          interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder()
              .setAuthor(client.getAuthor(ee.authorname, ee.authoricon, ee.authorurl))
              .setDescription(`${emoji.msg.sukces}・Pomyślnie oddałeś swój głos!`)
              .setColor(ee.successcolor)
            ]
          });
        }
        //Usunięcie głosu przeciw propozycji
        if (SuggestionsData.downvoted_ppl.includes(interaction.user.id)) {
          client.propozycje.math(interaction.message.id, "-", 1, "downvotes");
          client.propozycje.remove(interaction.message.id, interaction.user.id, "downvoted_ppl");
        }
        client.propozycje.math(interaction.message.id, "+", 1, "upvotes");
        client.propozycje.push(interaction.message.id, interaction.user.id, "voted_ppl");
      }
      if (interaction.customId == "Propozycja_przeciw") {
        if (SuggestionsData.downvoted_ppl.includes(interaction.user.id)) {
          return interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder()
              .setAuthor(client.getAuthor(ee.authorname, ee.authoricon, ee.authorurl))
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.blad}・Nie możesz dwukrotnie zagłosować na tą samą opcję!`)
            ]
          });
        } else {
          interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder()
              .setAuthor(client.getAuthor(ee.authorname, ee.authoricon, ee.authorurl))
              .setDescription(`${emoji.msg.sukces}・Pomyślnie oddałeś swój głos!`)
              .setColor(ee.successcolor)
            ]
          });
        }
        //Usunięcie głosu za propozycją
        if (SuggestionsData.voted_ppl.includes(interaction.user.id)) {
          client.propozycje.math(interaction.message.id, "-", 1, "upvotes");
          client.propozycje.remove(interaction.message.id, interaction.user.id, "voted_ppl");
        }
        client.propozycje.math(interaction.message.id, "+", 1, "downvotes");
        client.propozycje.push(interaction.message.id, interaction.user.id, "downvoted_ppl");
      }
      if (interaction.customId == "Propozycja_kto") {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(interaction.message.embeds[0].color)
              .setTitle(`❓ **Kto zagłosował?** ❓`)
              .addField(`${SuggestionsData.upvotes} Głosy za`, `${SuggestionsData.voted_ppl && SuggestionsData.voted_ppl.length > 0 ? SuggestionsData.voted_ppl.length < 20 ? SuggestionsData.voted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.voted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.voted_ppl.length - 20} więcej...`].join("\n") : "Brak głosów"}`.substring(0, 1024), true)
              .addField(`${SuggestionsData.downvotes} Głosy przeciw`, `${SuggestionsData.downvoted_ppl && SuggestionsData.downvoted_ppl.length > 0 ? SuggestionsData.downvoted_ppl.length < 20 ? SuggestionsData.downvoted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.downvoted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.downvoted_ppl.length - 20} więcej...`].join("\n") : "Brak głosów"}`.substring(0, 1024), true)
          ]
        });
      }
    }

    SuggestionsData = client.propozycje.get(interaction.message.id);
    let embed = interaction.message.embeds[0];
    embed.fields[0].value = `- Głosy za: \`${SuggestionsData.upvotes}\` | **${Math.round(SuggestionsData.upvotes / (SuggestionsData.upvotes + SuggestionsData.downvotes) * 100)}%**\n- Głosy przeciw: \`${SuggestionsData.downvotes}\` | **${Math.round(SuggestionsData.downvotes / (SuggestionsData.upvotes + SuggestionsData.downvotes) * 100)}%**`;

    const btn_up = new ButtonBuilder()
      .setLabel(String(SuggestionsData.upvotes))
      .setEmoji('934577543456112681')
      .setStyle('SECONDARY')
      .setCustomId('Propozycja_za')
      .setDisabled(false);
    const btn_down = new ButtonBuilder()
      .setLabel(String(SuggestionsData.downvotes))
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

    interaction.message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents([btn_up, btn_down, btn_who])] });

  }
};



