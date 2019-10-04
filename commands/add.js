module.exports = {
	name: 'add',
    description: 'adds reminder for next avaliable day at time\nargs: ?add <user> <chore(use underscore as spaces)> <dayofweek> <remindertime(24hr)>',
	execute(client, message, args) {
        //function which gets the user from mention format
        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
        
                return client.users.get(mention);
            }
        }
        
        //arg count check
        if(args.length!=4){
            message.reply('error: Format for command incorrect. Be sure to separate words in chore with underscore(_) and use 24hr time format\nSpecified format:\n?add <user> <chore> <dayofweek> <remindertime(24hr)')
            return;
        }
       
        //parsing user
        if(!getUserFromMention(args[0])){
            message.reply('error: You did not specify a user for the chore. Please use Discord mention format.\nie. \"@user\"');
        }
        //parsing chore
        var chorearray = args[1].split('_');
        var chores = "";
        for(x in chorearray){
            chores += chorearray[x];
            chores += " ";
        }
        chores = chores.substring(0, chores.length-1);
        //parsing day of week
        var d = new Date();
        var argsday = -1;
        switch(args[2]){
            case "sunday":
                argsday = 0;
                break;
            case "monday":
                argsday = 1;
                break;
            case "tuesday":
                argsday = 2;
                break;
            case "wednesday":
                argsday = 3;
                break;
            case "thursday":
                argsday = 4;
                break;
            case "friday":
                argsday = 5;
                break;
            case "saturday":
                argsday = 6;
            default:
                message.reply('error: you did not specify a day of the week, or misspelled it. Please use the full name of day\n ie. \"sunday\"');
        }
        //parsing hours and minutes
        if(args[3].length!=4 || isNaN(args[3]) || parseInt(args[3])>2400 || parseInt(args[3])<0){
            message.reply('error: incorrect time format, please use 24hour format with leading zeros and no other characters.\n ie 1:00PM is \"1300\"');
        }

        var hours = parseInt(args[3].substring(0,2));
        var minutes = parseInt(args[3].substring(2));
        //calculating sleep time
        var daydiff = argsday-d.getDay();
        if(daydiff<0){ daydiff = daydiff + 7; }
        var hourdiff = hours-d.getHours();
        if(hourdiff<0){ hourdiff = hourdiff + 24; }
        var mindiff = minutes-d.getMinutes();
        if(mindiff<0){ mindiff = mindiff + 60; }
        var sleeptime = daydiff * (1000 * 60 * 60 * 24) + hourdiff * (1000 * 60 * 60) + mindiff * (1000 * 60);

        //queueing command
        var reminder = getUserFromMention(args[0]) + ' it\'s time to ' + chores;
        message.channel.send('Reminder for ' + getUserFromMention(args[0]) + ' to ' + chores + ' at ' + args[3] + ' is set.');
        setTimeout(function() {
            message.channel.send(reminder);
            setInterval(function(){message.channel.send(reminder)}, 7*24*60*60*1000);
        }, sleeptime);
        
    },

};