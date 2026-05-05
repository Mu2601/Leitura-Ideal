const API_URL = "https://Muri26.pythonanywhere.com";
let todosOsLivros = []; 

// --- 1. LOGIN E SESSÃO ---
function realizarLogin(usuario, senha) {
    let dadosUsuario = null;
    if (usuario === "admin" && senha === "123") {
        dadosUsuario = { nome: "Bibliotecária", tipo: "admin", id: "999" };
    } else if (usuario === "leitor" && senha === "123") {
        dadosUsuario = { nome: "Miroki", tipo: "leitor", id: "101" };
    }

    if (dadosUsuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        alert(`Bem-vindo(a), ${dadosUsuario.nome}!`);
        window.location.href = "index.html"; 
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
}

function atualizarDashboard() {
    const sessao = localStorage.getItem('usuarioLogado');
    const painelAdmin = document.getElementById('painel-admin');
    const infoLogin = document.getElementById('dashboard-header') || document.getElementById('info-login');

    if (sessao && infoLogin) {
        const usuario = JSON.parse(sessao);
        infoLogin.innerHTML = `
            <span>Olá, <strong>${usuario.nome}</strong></span>
            <button onclick="fazerLogout()" style="padding:2px 8px; margin-left:10px; background:#ff4757; color:white; border:none; border-radius:4px; cursor:pointer;">Sair</button>
        `;
        if (usuario.tipo === 'admin' && painelAdmin) {
            painelAdmin.style.display = 'block';
        }
    }
}

// --- 2. GESTÃO DE LIVROS (CADASTRO) ---
function cadastrarLivro() {
    const campoTitulo = document.getElementById('titulo');
    const campoAutor = document.getElementById('autor');
    const campoCapa = document.getElementById('capa');
    const campoDesc = document.getElementById('descricao');
    const campoGen = document.getElementById('generol');
    const campoQtd = document.getElementById('quantidade');

    if (!campoTitulo || !campoAutor) return;

    const livro = {
        id: Date.now(),
        titulo: campoTitulo.value,
        autor: campoAutor.value,
        capa: campoCapa.value,
        descricao: campoDesc.value,
        generol: campoGen.value,
        quantidade: campoQtd.value
    };

    if (!livro.titulo || !livro.autor) {
        alert("Título e Autor são obrigatórios!");
        return;
    }

    fetch(`${API_URL}/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    })
    .then(res => res.json())
    .then(dados => {
        alert("📚 Livro cadastrado com sucesso!");
        const form = document.getElementById('form-livro');
        if(form) form.reset(); 
        listarLivros(); // Atualiza a lista após cadastrar
    })
    .catch(err => console.error("Erro na API:", err));
}

// --- 3. LISTAGEM E BUSCA ---
function listarLivros() {
    fetch(`${API_URL}/listar`)
    .then(res => res.json())
    .then(dadosBrutos => {
        todosOsLivros = dadosBrutos.filter(l => l && l.titulo); 
        renderizarCards(todosOsLivros);
    })
    .catch(err => console.error("Erro ao listar:", err));
}

// FUNÇÃO DE BUSCA (FILTRO)
function filtrarLivros() {
    const termo = document.getElementById('pesquisar-input').value.toLowerCase();
    const filtrados = todosOsLivros.filter(livro => 
        livro.titulo.toLowerCase().includes(termo) || 
        livro.autor.toLowerCase().includes(termo)
    );
    renderizarCards(filtrados);
}

function renderizarCards(lista) {
    const container = document.getElementById('lista-livros');
    if (!container) return;
    container.innerHTML = "";

    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));

    lista.forEach(livro => {
        let acaoHtml = "";
        const listaIds = String(livro.usuario_id || "").split(',').filter(id => id && id !== "None" && id !== "null");
        const disponivel = (parseInt(livro.quantidade) || 0) - listaIds.length;

        if (sessao) {
            const meuId = String(sessao.id);
            if (listaIds.includes(meuId)) {
                acaoHtml = `<button class="btn-pegar" style="background: #e67e22;" onclick="devolverLivro(${livro.id})">Devolver</button>`;
            } else if (disponivel > 0) {
                acaoHtml = `<button class="btn-pegar" onclick="pegarLivro(${livro.id})">Pegar (${disponivel} un.)</button>`;
            } else {
                acaoHtml = `<span class="indisponivel">Esgotado</span>`;
            }

            if (sessao.tipo === 'admin') {
                acaoHtml += `<button class="btn-pegar" onclick="excluirLivro(${livro.id})" style="background:#ff1869; margin-top: 5px; width: 45px; align-self: center;">🗑️</button>`;
            }
        }

        container.innerHTML += `
            <div class="card-livro">
                <div class="capa-container">
                    <img src="${livro.capa}" onerror="this.src='https://via.placeholder.com/240x320?text=Sem+Capa'">
                </div>
                <div class="card-detalhes">
                    <span class="genero-tag">${livro.generol || 'Geral'}</span>
                    <h3>${livro.titulo}</h3>
                    <p>${livro.autor}</p>
                    ${acaoHtml}
                </div>
            </div>
        `;
    });
}

// --- 4. AÇÕES DE EMPRÉSTIMO ---
function pegarLivro(id) {
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    if(!sessao) return alert("Faça login para pegar livros.");
    
    fetch(`${API_URL}/emprestar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livro_id: id, usuario_id: sessao.id })
    }).then(() => listarLivros());
}

function devolverLivro(id) {
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    fetch(`${API_URL}/devolver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livro_id: id, usuario_id: sessao.id })
    }).then(() => listarLivros());
}

function excluirLivro(id) {
    if (!confirm("Excluir este livro?")) return;
    fetch(`${API_URL}/excluir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livro_id: id })
    }).then(() => listarLivros());
}

// --- 5. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
    listarLivros();
    
    // Adiciona evento de busca se o input existir
    const inputBusca = document.getElementById('pesquisar-input');
    if(inputBusca) {
        inputBusca.addEventListener('input', filtrarLivros);
    }
});
