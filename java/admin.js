async function cadastrarLivro() {
    const dados = {
        id: Date.now().toString(),
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        capa: document.getElementById('capa').value,
        descricao: document.getElementById('descricao').value,
        generol: document.getElementById('generol').value,
        quantidade: document.getElementById('quantidade').value
    };

    try {
        const resposta = await fetch('http://127.0.0.1:5000/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        alert(resultado.mensagem);
    } catch (erro) {
        console.error("Erro ao conectar com o Python:", erro);
        alert("O servidor Python está ligado?");
    }
}
