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
    const infoLogin = document.getElementById('info-login');

    if (sessao) {
        const usuario = JSON.parse(sessao);
        if (infoLogin) {
            infoLogin.innerHTML = `
                <span>Olá, <strong>${usuario.nome}</strong></span>
                <button onclick="fazerLogout()" style="padding:2px 8px; margin-left:10px; background:#ff4757; color:white; border:none; border-radius:4px; cursor:pointer;">Sair</button>
            `;
        }
        if (usuario.tipo === 'admin' && painelAdmin) {
            painelAdmin.style.display = 'block';
        }
    }
}

// --- 2. GESTÃO DE LIVROS (CADASTRO) ---
function cadastrarLivro() {
    // Verificando se os campos existem antes de pegar o valor (evita erro de 'null')
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
    })
    .catch(err => {
        console.error("Erro na API:", err);
        alert("Erro ao conectar com o servidor. Verifique se o PythonAnywhere está ativo.");
    });
}

// --- 3. LISTAGEM E BUSCA ---
function listarLivros() {
    const container = document.getElementById('lista-livros');
    if (!container) return; // Só executa se estiver na página de listagem

    fetch(`${API_URL}/listar`)
    .then(res => res.json())
    .then(dadosBrutos => {
        todosOsLivros = dadosBrutos.filter(l => l && l.titulo); 
        renderizarCards(todosOsLivros);
    })
    .catch(err => console.error("Erro ao listar:", err));
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
                acaoHtml = `<button onclick="devolverLivro(${livro.id})" style="background:orange">Devolver</button>`;
            } else if (disponivel > 0) {
                acaoHtml = `<button onclick="pegarLivro(${livro.id})">Pegar (${disponivel} un.)</button>`;
            } else {
                acaoHtml = `<span style="color:red">Esgotado</span>`;
            }

            if (sessao.tipo === 'admin') {
                acaoHtml += `<button onclick="excluirLivro(${livro.id})" style="background:red; margin-left:8px;">🗑️</button>`;
            }
        }

        container.innerHTML += `
            <div class="card-livro">
                <img src="${livro.capa}" width="100" onerror="this.src='https://via.placeholder.com/100x150'">
                <h3>${livro.titulo}</h3>
                <p>${livro.autor} | ${livro.generol}</p>
                <div>${acaoHtml}</div>
            </div>
        `;
    });
}

// --- 4. AÇÕES DE EMPRÉSTIMO ---
function pegarLivro(id) {
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
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
window.onload = () => {
    atualizarDashboard();
    listarLivros();
};
