async function cadastrarLivro() {
    const dados = {
        id: Date.now().toString(),
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        capa: document.getElementById('capa').value,
        descricao: document.getElementById('descricao').value,
        generol: document.getElementById('generol').value, // Verifique se o ID no HTML é 'generol' ou 'genero'
        quantidade: document.getElementById('quantidade').value
    };

    try {
        // MUDANÇA AQUI: Agora aponta para a nuvem, não para o seu PC
        const resposta = await fetch('https://Muri26.pythonanywhere.com/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) throw new Error('Erro no servidor');

        const resultado = await resposta.json();
        alert("📚 " + (resultado.mensagem || "Sucesso!"));
    } catch (erro) {
        console.error("Erro ao conectar com o PythonAnywhere:", erro);
        alert("Erro de conexão! Verifique se você deu 'Reload' na aba Web do PythonAnywhere.");
    }
}
