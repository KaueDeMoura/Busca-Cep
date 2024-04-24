const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurações do banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'consulta_cep'
});

// Conectar ao banco de dados MySQL
connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados MySQL');
        criarTabela();
    }
});

// Função para criar a tabela 'enderecos' se ela não existir
function criarTabela() {
    const sql = `
        CREATE TABLE IF NOT EXISTS enderecos (
            cep VARCHAR(8) NOT NULL,
            logradouro VARCHAR(255),
            bairro VARCHAR(255),
            cidade VARCHAR(255),
            uf VARCHAR(2)
        )
    `;

    connection.query(sql, (error) => {
        if (error) {
            console.error('Erro ao criar tabela:', error);
        } else {
            console.log('Tabela enderecos criada ou já existe.');
        }
    });
}

// Rota para receber os dados e salvar no banco de dados
app.post('/salvar', (req, res) => {
    const dados = req.body;

    // Consulta SQL para inserir os dados na tabela 'enderecos'
    const sql = 'INSERT INTO enderecos (cep, logradouro, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?)';
    const values = [dados.cep, dados.logradouro, dados.bairro, dados.localidade, dados.uf];

    // Executar a consulta SQL
    connection.query(sql, values, (error, results, fields) => {
        if (error) {
            console.error('Erro ao inserir dados no banco de dados:', error);
            res.status(500).send('Erro ao inserir dados no banco de dados.');
        } else {
            console.log('Dados inseridos no banco de dados com sucesso:', results);
            res.sendStatus(200);
        }
    });
});

// Iniciar o servidor na porta 3000
app.listen(3006, () => {
    console.log('Servidor Node.js rodando na porta 3000');
});
