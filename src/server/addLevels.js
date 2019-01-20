var mongoose = require('mongoose');
var dataread = require("./dataread");
var fs=require("fs");

mongoose.connect('mongodb://localhost/labirynt',{ useNewUrlParser: true },
    function(err){
        if(err) {
            console.log(" CONNECTION to DATABASE FAILED!");
            console.log(err);
            process.exit(1);
        }
});

var levels= JSON.parse(fs.readFileSync(__dirname+"\\..\\..\\backup_json\\plansze.json")).table;
var count = levels.length;
for(var i in levels)
{
    const level= levels[i];
    var dblevel = new dataread.level();
    dblevel.level.id= level.id;
    dblevel.level.solutions=[level.answer];
    dblevel.level.players=0;
    dblevel.level.leastmoves=level.answer.length;
    dblevel.save(function(err,ans){
        if(err)
        {
            dataread.level.deleteOne({"level.id":level.id, }, function(errr){
                if(!errr)
                {
                    dblevel.save(function(err,ans){
                        if(err) console.log("ERROR saving level ("+(count-1)+" more left)");
                        else console.log("Level saved* ("+(count-1)+" more left)");
                        if(--count==0) process.exit(0); } );
                }
                else
                {
                    console.log("ERROR saving level ("+(count-1)+" more left)");
                    if(--count==0) process.exit(0);
                }
            }); 
        }
        else console.log("Level saved ("+(--count)+" more left)");
        if(count==0) process.exit(0);
    });
}
