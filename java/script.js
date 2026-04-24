// URL do seu servidor no PythonAnywhere (Mude se o seu link for diferente)
const API_URL = "https://Muri26.pythonanywhere.com";

// 1. FUNÇÃO PARA CADASTRAR LIVRO
function cadastrarLivro() {
    // Pega os valores dos campos do formulário (Garanta que os IDs no HTML sejam esses)
    const livro = {
        id: Date.now(), // Gera um ID único baseado no tempo
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        capa: document.getElementById('capa').value,
        descricao: document.getElementById('descricao').value,
        generol: document.getElementById('genero').value,
        quantidade: document.getElementById('quantidade').value
    };

    // Verifica se os campos principais estão preenchidos
    if (!livro.titulo || !livro.autor) {
        alert("Por favor, preencha o título e o autor.");
        return;
    }

    // Faz a chamada para o seu servidor Python
    fetch(`${API_URL}/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(livro)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar no servidor');
        return response.json();
    })
    .then(data => {
        alert("Livro salvo com sucesso no Excel!");
        console.log(data);
        // Limpa o formulário após salvar
        document.getElementById('form-livro').reset();
    })
    .catch(error => {
        console.error("Erro no cadastro:", error);
        alert("Erro ao conectar com o servidor. Verifique se o PythonAnywhere está ligado.");
    });
}

// 2. FUNÇÃO PARA LISTAR LIVROS (Chamar ao carregar a página ou clicar em "Ver Livros")
function listarLivros() {
    fetch(`${API_URL}/listar`)
    .then(response => response.json())
    .then(livros => {
        const container = document.getElementById('lista-livros'); // Onde os livros vão aparecer
        if (!container) return;

        container.innerHTML = ""; // Limpa a lista antes de mostrar

        if (livros.length === 0) {
            container.innerHTML = "<p>Nenhum livro encontrado no Excel.</p>";
            return;
        }

        livros.forEach(livro => {
            const card = `
                <div class="livro-card">
                    <img src="${livro.capa}" alt="Capa" style="width:100px">
                    <h3>${livro.titulo}</h3>
                    <p>Autor: ${livro.autor}</p>
                    <p>Gênero: ${livro.generol}</p>
                    <p>Qtd: ${livro.quantidade}</p>
                </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => {
        console.error("Erro ao listar:", error);
    });
}

// Chamar a listagem automaticamente quando a página abrir
window.onload = listarLivros;
