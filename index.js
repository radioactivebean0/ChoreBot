const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
function resumeTasks(){
    const tasks = fs.readdirSync('./userdat/').filter(file => file.endsWith('.json'));
    var d = new Date();
    for(x in tasks){
        var textdata = fs.readFileSync(`./userdat/${tasks[x]}`);
        var data = JSON.parse(textdata);
        var hours = data.time.substring(0,2);
        var minutes =data.time.substring(2);
        //calculating sleep time
        var daydiff = data.day-d.getDay();
        //if(daydiff<0){ daydiff = daydiff + 7; }
        var hourdiff = hours-d.getHours();
        //if(hourdiff<0){ hourdiff = hourdiff + 24; }
        var mindiff = minutes-d.getMinutes();
        //if(mindiff<0){ mindiff = mindiff + 60; }
        var sleeptime = daydiff * (1000 * 60 * 60 * 24) + hourdiff * (1000 * 60 * 60) + mindiff * (1000 * 60);
        if(sleeptime<0){ sleeptime += 1000*60*60*24*7;}
        setTimeout(function() {
            if(data.active != true){
                return;
            }
            var reminder = `${client.users.get(tasks[x].substring(0, tasks[x].length-5))} its time to ${data.chore}.`;
            console.log(data.channel);
            client.channels.get(data.channel).send(reminder);

            setInterval(function(){client.channels.get(data.channel).send(reminder);}, 7*24*60*60*1000);
        }, sleeptime);
    }
}

client.once('ready', () => {
    console.log('Resuming tasks...');
    resumeTasks();
	console.log('Ready!');
});

client.on('message', message=>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command)) return;
    
    try {
        client.commands.get(command).execute(client, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
    
})

client.login(token);