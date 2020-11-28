let express = require("express");
let app = express();
let bodyParser = require('body-parser');
const cors = require('cors');
let db = require("./database.js");

let HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
  console.log(`Servidor executando em https://localhost:%PORT`.replace(`%PORT`,HTTP_PORT))
});

//Consulta todos os estabelecimentos de saúde da cidade informada
app.get("/api/ubscidade/:cidade", function (req, res, next) {
  let sql = `SELECT nom_estab FROM ubs WHERE dsc_cidade LIKE '${req.params.cidade}';`;
  console.log(sql);
  let params = [req.params.id];

    db.all(sql, params, function(err, rows){
      if(err){
        res.status(400).json({"error":err.message});
      }
      res.json({
        "message": "success",
        "data": rows
      })
    });
});

//Insere paciente suspeito na tabela para consulta pelos orgãos de saúde

app.use(bodyParser.urlencoded({extended : false}));
app.use(cors());

app.post("/api/sintomatico/", function(req, res){
  
  let dados = {
    "nome": req.body.nome,
    "endereco": req.body.endereco,
    "numero": req.body.numero,
    "bairro": req.body.bairro,
    "cidade": req.body.cidade,
    "uf": req.body.uf  
  }

  var sql2 = `INSERT INTO sintomatico(nome,endereco,numero,bairro,cidade,uf) VALUES (?,?,?,?,?,?)`;
  var params2 = [dados.nome, dados.endereco, dados.numero, dados.bairro, dados.cidade, dados.uf];

  db.run(sql2, params2, function(err){
      if(err){
        res.status(400).json({"error": err.message})
        return;
      }
      //res.status(201);
      res.json({success: true});
      console.log("success:", res.json());
      
  });
});

let row;

app.get("/api/sintomatico", function(req, res){
  let sql3 = `SELECT * FROM sintomatico;`;
  //console.log(sql3);

  db.all(sql3, [], function(err,row){
    
    res.json(row);
    console.log(res.json());
  });
});

app.get("/api/sintomatico/getlast", function(req,res){
  let query = `SELECT nome,cidade, uf FROM ( select * from sintomatico ORDER BY ID desc limit 1) ORDER BY id;`;
  let output;

  db.all(query, [], function(err, output){
    if(err){
      output.status(400).json({"error":err.message});
    }

    res.json(output);
    console.log(query);
  });

});

app.use(function(req, res){
  res.status(404);
});