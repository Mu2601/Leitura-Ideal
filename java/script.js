const API_URL = "https://Muri26.pythonanywhere.com";

// ITEM 3: Função para filtrar livros ruins ou duplicados
function filtrarLivros(lista) {
    const vistos = new Set();
    return lista.filter(livro => {
        // Remove se faltar info importante
        const temInfo = livro.titulo && livro.capa && livro.autor && livro.generol;
        // Remove se for duplicado (mesmo título)
        const duplicado = vistos.has(livro.titulo.toLowerCase());
        vistos.add(livro.titulo.toLowerCase());

        return temInfo && !duplicado;
    });
}

function listarLivros() {
    fetch(`${API_URL}/listar`)
    .then(response => response.json())
    .then(dadosBrutos => {
        const livros = filtrarLivros(dadosBrutos); // Aplica a limpeza (Item 3)
        const container = document.getElementById('lista-livros');
        if (!container) return;

        container.innerHTML = "";
        const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));

        livros.forEach(livro => {
            // ITEM 2: Lógica visual de disponibilidade
            const estaEmprestado = livro.usuario_id; // Verificaremos isso no Excel depois
            const botaoAcao = estaEmprestado 
                ? `<span class="indisponivel">Indisponível</span>` 
                : `<button class="btn-pegar" onclick="pegarLivro(${livro.id})">Pegar</button>`;

            const card = `
                <div class="card-livro">
                    <div class="capa-container">
                        <img src="${livro.capa}" onerror="this.src='https://via.placeholder.com/150x220?text=Sem+Capa'">
                    </div>
                    <div class="card-detalhes">
                        <h3>${livro.titulo}</h3>
                        <span class="genero-tag">${livro.generol}</span>
                        <p class="descricao">${livro.descricao}</p>
                        ${sessao ? botaoAcao : '<p>Faça login para pegar</p>'}
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    });
}

function atualizarDashboard() {
    const sessao = localStorage.getItem('usuarioLogado');
    const painelAdmin = document.getElementById('painel-admin');
    const infoLogin = document.getElementById('info-login');

    if (sessao) {
        const usuario = JSON.parse(sessao);
        infoLogin.innerHTML = `Olá, <strong>${usuario.nome}</strong>! <button onclick="fazerLogout()">Sair</button>`;
        
        // ITEM 4: Login da bibliotecária libera o painel
        if (usuario.tipo === 'admin' && painelAdmin) {
            painelAdmin.style.display = 'block';
        }
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload();
}

// CORREÇÃO: Apenas um window.onload que gerencia tudo
window.onload = () => {
    atualizarDashboard();
    listarLivros();
};
