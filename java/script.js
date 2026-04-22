// 1. Definição das variáveis de URL (sem await aqui!)
const urlOriginal = 'https://script.google.com/macros/s/AKfycbxM3cRdtob2UCx3_UnUpVs_hjQ7Cr_pOn7hPNQ3T8u045ceWR_nllxVjwPi1mr_f-yL/exec'; 
const planilhalivros = 'https://corsproxy.io/?url=' + encodeURIComponent(urlOriginal);

// 2. O carregamento inicial da página
document.addEventListener('DOMContentLoaded', () => {
    const usuarioAtivo = localStorage.getItem('sessaoAtiva');
    
    // Verifica se precisa de login (bloqueia projeto.html e Bibliotecaria.html)
    if (!usuarioAtivo && (window.location.pathname.includes("projeto.html") || window.location.pathname.includes("Bibliotecaria.html"))) {
        alert("Ops! Você precisa estar logado.");
        window.location.href = "login.html";
        return;
    }
    
    // CHAMA A FUNÇÃO AQUI
    Livros(); 
});

// 3. A FUNÇÃO LIVROS (Onde os dados são buscados)
async function Livros() {
    const lista = document.getElementById('book-list');
    if (!lista) return;

    try {
        lista.innerHTML = '<p style="color: white;">Carregando...</p>';
        
        const resposta = await fetch(planilhalivros);
        const biblioteca = await resposta.json();

        lista.innerHTML = '';

        biblioteca.forEach((livro) => {
            // Lógica para criar os itens da lista (li)
            const item = document.createElement('li');
            item.className = 'book-item';
            
            // Exemplo de preenchimento (ajuste conforme suas colunas)
            let titulo = livro.titulo || livro[0];
            let capa = livro.capa || livro[2] || "https://via.placeholder.com/100x150";

            item.innerHTML = `
                <div class="card-livro">
                    <img src="${capa}" style="width:100px;">
                    <div class="info">
                        <strong style="color:white;">${titulo}</strong>
                        <button class="btn-pegar">Pegar</button>
                    </div>
                </div>
            `;
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro:", erro);
        lista.innerHTML = '<p style="color: red;">Erro ao carregar os livros.</p>';
    }
}
