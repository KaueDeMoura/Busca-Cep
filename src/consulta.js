// consulta.js


function consultarCep() {
    let cep = document.querySelector("#cep").value;
    if (cep.length !== 8) {
        alert('Você digitou um CEP inválido');
        return;
    }

    let URL = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(URL)
    .then(response => response.json())
    .then(dados => {
        if (dados.erro) {
            mostrarErro();
        } else {
            mostrarCep(dados);
            enviarParaServidor(dados); // Enviar os dados para o servidor Node.js
        }
    });
}

function mostrarErro() {
    let resultado = document.querySelector("#resultado");
    resultado.innerHTML = "Não foi possível localizar este CEP";
}

function mostrarCep(dados) {
    let resultado = document.querySelector("#resultado");
    resultado.innerHTML = ` <p>Cidade: ${dados.localidade} - ${dados.uf}</p>
                            <p>Endereço: ${dados.logradouro}</p>
                            <p>Bairro: ${dados.bairro}</p> 
                            <p>CEP: ${dados.cep}</p>
                            `;
}

function enviarParaServidor(dados) {
    fetch('/salvar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (response.ok) {
            console.log('Dados enviados com sucesso para o servidor.');
        } else {
            console.error('Erro ao enviar dados para o servidor.');
        }
    })
    .catch(error => console.error('Erro ao enviar dados para o servidor:', error));
}
