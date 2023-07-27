const { SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Zmienia status bota")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("activity")
                .setDescription("Status bota")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Wybierz aktywność")
                        .setRequired(true)
                        .addChoices(
                            { name: "Gra", value: "Playing" },
                            { name: "Streamuje", value: "Streaming" },
                            { name: "Słucha", value: "Listening" },
                            { name: "Ogląda", value: "Watching" },
                            { name: "Współzawodniczy", value: "Competing" },
                        )
                )
                .addStringOption(option =>
                    option.setName("activity")
                        .setDescription("Ustaw swoją aktualną aktywność")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("status")
                .setDescription("Aktualizuje status bota")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Wybierz status")
                        .setRequired(true)
                        .addChoices(
                            { name: "Online", value: "online" },
                            { name: "Zajęty", value: "idle" },
                            { name: "Nie przeszkadzać", value: "dnd" },
                            { name: "Niewidoczny", value: "invisible" },

                        )
                )
        ),
    async execute(interaction, client) {
        const { options } = interaction;
        const sub = options.getSubcommand(["activity", "status"]);
        const type = options.getString("type");
        const activity = options.getString("activity");
        try {
            switch (sub) {
                case "activity":
                    switch (type) {
                        case "Playing":
                            client.user.setActivity(activity, { type: ActivityType.Playing });
                            break;
                        case "Streaming":
                            client.user.setActivity(activity, { type: ActivityType.Streaming });
                            break;
                        case "Listening":
                            client.user.setActivity(activity, { type: ActivityType.Listening });
                            break;
                        case "Watching":
                            client.user.setActivity(activity, { type: ActivityType.Watching });
                            break;
                        case "Competing":
                            client.user.setActivity(activity, { type: ActivityType.Competing });
                            break;

                    }
                case "status":
                    client.user.setPresence({ status: type });
            }
        } catch (err) {
            console.log(err);
        }
        const embed = new EmbedBuilder();
        return interaction.reply({ embeds: [embed.setDescription(`Pomyślnie zaktualizowano Twoje ${sub} na **${type}**.`)] })
    }
}
