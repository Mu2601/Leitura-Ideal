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

// ... (mantenha o topo do arquivo com as variáveis e funções de login)

function renderizarLivros(lista) { // Ou renderizarCards, dependendo do nome que você chama no fetch
    const tbody = document.getElementById('lista-livros-tbody');
    if (!tbody) return;
    tbody.innerHTML = "";

    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));

    lista.forEach(livro => {
        let acaoHtml = "";

        // Tratamento de IDs seguro
        const listaIds = String(livro.usuario_id || "").split(',')
            .map(id => id.trim())
            .filter(id => id && id !== "None" && id !== "null");
            
        const disponivel = (parseInt(livro.quantidade) || 0) - listaIds.length;

        // Botões (Pegar / Devolver / Excluir)
        if (sessao) {
            const meuId = String(sessao.id);
            if (listaIds.includes(meuId)) {
                acaoHtml = `<button class="btn-acao btn-devolver" onclick="devolverLivro(${livro.id})">Devolver</button>`;
            } else if (disponivel > 0) {
                acaoHtml = `<button class="btn-acao btn-pegar" onclick="pegarLivro(${livro.id})">Pegar (${disponivel})</button>`;
            } else {
                acaoHtml = `<span class="txt-esgotado">Esgotado</span>`;
            }

            if (sessao.tipo === 'admin') {
                acaoHtml += `<button class="btn-acao btn-excluir" title="Excluir" onclick="excluirLivro(${livro.id})">🗑️</button>`;
            }
        }

        // Criando a Linha (TR) da Planilha
        tbody.innerHTML += `
            <tr>
                <td>
                    <img src="${livro.capa}" class="mini-capa" onerror="this.src='https://via.placeholder.com/55x80?text=Capa'">
                </td>
                <td style="font-weight: bold; color: #fff; font-size: 1.05rem;">
                    ${livro.titulo}
                </td>
                <td style="color: #bbb; font-size: 0.95rem;">
                    ${livro.autor}
                </td>
                <td>
                    <span class="tag-genero">${livro.generol || 'Geral'}</span>
                </td>
                <td style="text-align: center;">
                    ${acaoHtml}
                </td>
            </tr>
        `;
    });
}

// ... (mantenha o resto das funções de empréstimo/devolução)
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
