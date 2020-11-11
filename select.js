const sqlite3 = require('sqlite3').verbose();
//importa os módulos para utilizar o sqlite no NodeJs

let sql = `SELECT nom_estab FROM ubs WHERE dsc_cidade LIKE "NATAL";`;
let row;

let db = new sqlite3.Database('./ubs.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

db.all(sql, [], (err, row)=>{
  if(err){
    throw err;
  }
  row.forEach((row)=>{
    console.log(row.nom_estab);
  });
});


db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});