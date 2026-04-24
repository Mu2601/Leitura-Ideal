// =========================================================
// CONFIGURAÇÃO: Substitua pelo seu link do PythonAnywhere
// Exemplo: https://murilo.pythonanywhere.com
// =========================================================
const URL_API = 'https://Muri26.pythonanywhere.com'; 

// 1. FUNÇÃO PARA CARREGAR OS LIVROS DO EXCEL (VIA PYTHON)
async function carregarLivros() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white;">Buscando livros no acervo...</p>';
        
        // Faz a requisição para a rota /listar do Python
        const resposta = await fetch(`${URL_API}/listar`);
        
        if (!resposta.ok) throw new Error("Erro ao conectar com o servidor");
        
        const biblioteca = await resposta.json();

        lista.innerHTML = ''; 

        if (biblioteca.length === 0) {
            lista.innerHTML = '<p style="color: white;">Nenhum livro encontrado no Excel.</p>';
            return;
        }

        biblioteca.forEach(livro => {
            const item = document.createElement('li');
            item.className = 'book-item';
            
            // Mapeia os campos exatamente como estão nas colunas do Excel
            let titulo = livro.titulo || "Sem título";
            let autor = livro.autor || "Autor desconhecido";
            let capa = livro.capa || "https://via.placeholder.com/100x150?text=Sem+Capa";
            let desc = livro.descricao || "Sem descrição disponível.";

            item.innerHTML = `
                <div class="card-livro" style="display: flex; gap: 20px; padding: 15px; border-bottom: 1px solid #333; background: #111; margin-bottom: 10px; border-radius: 8px;">
                    <img src="${capa}" style="width: 100px; height: 140px; object-fit: cover; border-radius: 4px;" alt="Capa do livro">
                    <div class="info" style="flex: 1;">
                        <strong style="color: #00ff9d; font-size: 1.2em; display: block;">${titulo}</strong>
                        <em style="color: #aaa; display: block; margin-bottom: 5px;">${autor}</em>
                        <p style="color: white; font-size: 0.9em; line-height: 1.4;">${desc}</p>
                        <button onclick="alert('Funcionalidade de empréstimo em breve!')" style="margin-top: 10px; background: #00ff9d; color: black; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Pegar</button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (e) {
        console.error("Erro na API:", e);
        lista.innerHTML = '<p style="color: #ff4d4d;">Erro ao carregar livros. Verifique se o servidor está online.</p>';
    }
}

// 2. FUNÇÃO PARA CADASTRAR NOVO LIVRO NO EXCEL (VIA PYTHON)
async function cadastrarLivro() {
    // Pega os valores dos campos do seu formulário HTML
    const t = document.getElementById('titulo').value;
    const a = document.getElementById('autor').value;
    const c = document.getElementById('capa').value;
    const g = document.getElementById('generol').value;
    const d = document.getElementById('descricao').value;
    const q = document.getElementById('quantidade').value;

    // Validação básica
    if (!t || !a) {
        alert("Pelo menos Título e Autor são obrigatórios!");
        return;
    }

    const novoLivro = {
        id: Date.now().toString(),
        titulo: t,
        autor: a,
        capa: c,
        generol: g,
        descricao: d,
        quantidade: q
    };

    try {
        const response = await fetch(`${URL_API}/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoLivro)
        });

        if (response.ok) {
            alert("Livro cadastrado com sucesso no Excel!");
            // Limpa o formulário ou recarrega a página
            location.reload(); 
        } else {
            const erroData = await response.json();
            alert("Erro ao salvar: " + erroData.mensagem);
        }
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro ao conectar com o servidor PythonAnywhere.");
    }
}

// 3. INICIALIZAÇÃO: Roda quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
});
