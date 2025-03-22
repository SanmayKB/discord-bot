module.exports = {
    name: 'ping',

    description: 'replies with the bot pong!',

    callback: async (client, interaction) =>{
        await interaction.deferReply();

        const reply  = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        interaction.editReply(`Pong! client: ${ping} ms | Websocket: ${client.ws.ping}`); 
    }
}