// 1. Defina a URL original e o Proxy (isso fica fora das funções)
const urlOriginal = 'https://script.google.com/macros/s/AKfycbxZRpkeeNeZPAnAODyNwuiJ0wxOO1BE-bV9X2RWXaykDq9v7zzRPnYZRzlDftx-VhLW/exec'; 
const planilhalivros = 'https://corsproxy.io/?url=' + encodeURIComponent(urlOriginal);

// A "Tranca" de login
document.addEventListener('DOMContentLoaded', () => {
    const usuarioAtivo = localStorage.getItem('sessaoAtiva');
    // Verifique se o nome do arquivo é index.html ou projeto.html
    if (!usuarioAtivo && (window.location.pathname.includes("projeto.html") || window.location.pathname.includes("Bibliotecaria.html"))) {
        alert("Ops! Você precisa estar logado para acessar esta área.");
        window.location.href = "login.html";
    }
    Livros(); // Chama a função aqui
});
async function Livros() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white; font-family: Varela Round, sans-serif;">Carregando acervo...</p>';
        
        // Chamada correta usando o Proxy definido acima
        const resposta = await fetch(planilhalivros);
        const biblioteca = await resposta.json();

        lista.innerHTML = '';

        if (!biblioteca || biblioteca.length === 0) {
            lista.innerHTML = '<p style="color: white;">Nenhum livro encontrado na planilha.</p>';
            return;
        }

        biblioteca.forEach((livro) => {
            // Ignora a linha de cabeçalho da planilha se necessário
            if (livro[0] === "titulo" || livro.titulo === "titulo") return;

            const item = document.createElement('li');
            item.className = 'book-item';

            // Mapeamento de colunas (Ajuste conforme a ordem da sua planilha)
            // Se o retorno for um Array (Google costuma mandar assim), use índices: livro[0], livro[1]...
            let titulo = livro.titulo || livro[0];
            let autor = livro.autor || livro[1];
            let capa = livro.capa || livro[2] || "https://via.placeholder.com/100x150?text=Sem+Capa";
            let genero = livro.generol || livro[3] || 'Geral';
            let desc = livro.descricao || livro[4] || 'Sem descrição.';
            let id = livro.id || Date.now();

            item.innerHTML = `
                <div class="card-livro">
                    <img src="${capa}" alt="Capa" style="width:100px; height:150px; object-fit: cover; border-radius: 5px;">
                    <div class="info">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: white; font-size: 1.2em;">${titulo}</strong>
                            <span style="background: #444; color: #00ff9d; padding: 2px 8px; border-radius: 10px; font-size: 0.7em;">${genero}</span>
                        </div>
                        <p style="color: #ccc; margin: 5px 0;">${autor}</p>
                        <p style="font-size: 0.85em; color: #aaa; margin-bottom: 10px;">${desc}</p>
                        <button class="btn-pegar" onclick="emprestarLivro('${id}')">Pegar Emprestado</button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro detalhado:", erro);
        lista.innerHTML = '<p style="color: red;">Erro ao carregar livros. Verifique se a planilha está pública.</p>';
    }
}
