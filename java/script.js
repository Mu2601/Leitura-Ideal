const urlGoogle = 'https://script.google.com/macros/s/AKfycbwxsW1BIV_VjjOWl_6QVlSyw9MHXTp-TfELJXE2eGi3AV6mDWsKjiReRjA4fB6EH98/exec';
const proxyUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(urlGoogle);

async function carregarBiblioteca() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white;">Carregando livros...</p>';
        const resposta = await fetch(proxyUrl);
        const biblioteca = await resposta.json();

        lista.innerHTML = ''; 

        biblioteca.forEach(livro => {
            const item = document.createElement('li');
            item.className = 'book-item';
            
            // Ajustado para os nomes exatos da sua planilha (Captura de tela 143950)
            let titulo = livro.titulo || "Sem título";
            let autor = livro.autor || "Autor desconhecido";
            let capa = livro.capa || "https://via.placeholder.com/100x150?text=Sem+Capa";
            let desc = livro.descricão || livro.descricao || "Sem descrição."; // O Google Apps Script remove o 'til' (~) às vezes

            item.innerHTML = `
                <div class="card-livro" style="display: flex; gap: 20px; padding: 15px; border-bottom: 1px solid #333; align-items: flex-start; background: #111; margin-bottom: 10px; border-radius: 8px;">
                    <img src="${capa}" alt="Capa" style="width: 100px; height: 140px; object-fit: cover; border-radius: 4px; border: 1px solid #444;">
                    
                    <div class="info" style="flex: 1;">
                        <strong style="color: #00ff9d; font-size: 1.2em; display: block;">${titulo}</strong>
                        <em style="color: #aaa; display: block; margin-bottom: 8px;">${autor}</em>
                        <p style="color: white; font-size: 0.9em; line-height: 1.4; margin-bottom: 12px;">${desc}</p>
                        <button class="btn-pegar" style="background: #00ff9d; color: black; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            Pegar
                        </button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (e) {
        console.error("Erro:", e);
        lista.innerHTML = '<p style="color: #ff4d4d;">Erro ao carregar a biblioteca.</p>';
    }
}

window.addEventListener('load', carregarBiblioteca);
