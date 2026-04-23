// 1. Substitua pela URL que o Render ou PythonAnywhere te fornecer após o deploy
// Enquanto testa no seu PC, use: 'http://127.0.0.1:5000'
const URL_API = 'http://127.0.0.1:5000'; 

// FUNÇÃO PARA CARREGAR E EXIBIR OS LIVROS VINDO DO EXCEL
async function Livros() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white;">Carregando biblioteca do Excel...</p>';
        
        // Agora buscamos da rota /listar do seu servidor Python
        const resposta = await fetch(`${URL_API}/listar`);
        const biblioteca = await resposta.json();

        lista.innerHTML = ''; 

        if (biblioteca.length === 0) {
            lista.innerHTML = '<p style="color: white;">Nenhum livro cadastrado no Excel ainda.</p>';
            return;
        }

        biblioteca.forEach(livro => {
            const item = document.createElement('li');
            item.className = 'book-item';
            
            // Os nomes aqui devem ser IGUAIS aos cabeçalhos da sua coluna no Excel
            let titulo = livro.titulo || "Sem título";
            let autor = livro.autor || "Autor desconhecido";
            let capa = livro.capa || "https://via.placeholder.com/100x150?text=Sem+Capa";
            let desc = livro.descricao || "Sem descrição disponível.";

            item.innerHTML = `
                <div class="card-livro" style="display: flex; gap: 20px; padding: 15px; border-bottom: 1px solid #333; background: #111; margin-bottom: 10px; border-radius: 8px;">
                    <img src="${capa}" style="width: 100px; height: 140px; object-fit: cover; border-radius: 4px;">
                    <div class="info" style="flex: 1;">
                        <strong style="color: #00ff9d; font-size: 1.2em; display: block;">${titulo}</strong>
                        <em style="color: #aaa; display: block; margin-bottom: 5px;">${autor}</em>
                        <p style="color: white; font-size: 0.9em; line-height: 1.4;">${desc}</p>
                        <button style="margin-top: 10px; background: #00ff9d; color: black; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Pegar</button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (e) {
        console.error("Erro ao carregar do servidor Python:", e);
        lista.innerHTML = '<p style="color: #ff4d4d;">Erro ao conectar com o servidor Python. Ele está ligado?</p>';
    }
}

// FUNÇÃO PARA CADASTRAR NOVO LIVRO NO EXCEL
async function cadastrarLivro() {
    const t = document.getElementById('titulo').value;
    const a = document.getElementById('autor').value;
    const c = document.getElementById('capa').value;
    const g = document.getElementById('generol').value;
    const d = document.getElementById('descricao').value;
    const h = document.getElementById('quantidade').value;

    if (!t || !a || !g) {
        alert("Preencha o título, autor e gênero!");
        return;
    }

    const novoLivro = {
        id: Date.now().toString(),
        titulo: t,
        autor: a,
        capa: c,
        generol: g,
        descricao: d,
        quantidade: h
    };

    try {
        // Agora enviamos para a rota /cadastrar do seu Python
        const response = await fetch(`${URL_API}/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoLivro)
        });

        if (response.ok) {
            alert("Livro cadastrado no Excel com sucesso!");
            location.reload();
        } else {
            throw new Error("Erro no servidor");
        }
    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("Erro ao conectar com o servidor Python.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Livros();
});
