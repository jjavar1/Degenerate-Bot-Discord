require('dotenv').config();
const { Client, Intents } = require('discord.js');
const sql = require('sqlite3').verbose();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.login(process.env.DISCORDJS_BOT_TOKEN)

//Opening db upon ready
client.on('ready', () =>{
    console.log('online client ready');
    let db = new sql.Database('../degen-bot.db', sql.OPEN_READWRITE, err => {
        if (err){
          console.log(err);
        } else {
          console.log('Success');
      };
})
})

//Upon message insert data into db, and increment values if needed
client.on('message', (messageCreate) =>{
    if (messageCreate.content == ".rollglove") {
        let userid = messageCreate.author.id;
        let db = new sql.Database('../degen-bot.db', sql.OPEN_READWRITE, err => {
            if (err){
              console.log(err);
            } else {
              console.log('Success');
          };
        db.serialize(() => {
            db.exec(`INSERT OR IGNORE INTO tries (name, attempts, won) VALUES ("${userid}", 0, 0)`)
            .exec(`UPDATE tries SET attempts = attempts + 1 WHERE name = ("${userid}")`)
            .get(`SELECT attempts, won FROM tries WHERE name = ("${userid}")`, (err, rows) => {
                if (err) {
                    console.log(err);
                    return
                }
                attempts = rows.attempts;
                wins = rows.won;
                let didWin = calculateAttempt();
                if (didWin) {
                    messageCreate.reply('You won, probably cheating');
                    db.exec(`UPDATE tries SET won = won + 1 WHERE name = ("${userid}")`);
                } else {
                    messageCreate.reply(`You did not win! Fucking loser! \n Number of attempts: ${attempts} \n Number of wins: ${wins}`);
                }
                db.close();
                })
            
        })
        return
    })
}
})

function calculateAttempt() {
    let number = Math.floor(Math.random() * 100,000);
    if (number == 1) {
        let quality = Math.random();
        if (quality < 0.25) {
            return true
        }
    } else {
        return false;
    }
}

