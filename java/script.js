// 1. Configuração das URLs
const urlGoogle = 'https://script.google.com/macros/s/AKfycbxzsW1BIV_VjjOWl_6QVlSyw9MHXTp-TfELJXE2eGi3AV6mDWsKjiReRjA4fB6EH98/exec'; 
const proxyUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(urlGoogle);

async function carregarLivros() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white;">Carregando...</p>';
        
        const resposta = await fetch(proxyUrl);
        
        // Verifica se a resposta foi bem sucedida
        if (!resposta.ok) throw new Error("Erro na rede");
        
        const biblioteca = await resposta.json();

        lista.innerHTML = ''; 

        biblioteca.forEach(livro => {
            const item = document.createElement('li');
            item.className = 'book-item';
            
            // Pega os dados baseados no título da sua coluna na planilha
            let titulo = livro.titulo || "Sem título";
            let capa = livro.capa || "https://via.placeholder.com/100x150";

            item.innerHTML = `
                <div class="card-livro" style="padding: 10px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 15px;">
                    <img src="${capa}" style="width: 60px; border-radius: 4px;">
                    <div>
                        <strong style="color: white; display: block;">${titulo}</strong>
                        <button style="margin-top: 5px; background: #00ff9d; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Pegar</button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (e) {
        console.error("Falha:", e);
        lista.innerHTML = '<p style="color: #ff4d4d;">Os livros não puderam ser carregados. Verifique a URL do script.</p>';
    }
}

// Inicializa quando a página carregar
window.onload = carregarLivros;
