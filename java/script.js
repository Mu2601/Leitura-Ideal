// ... (mantenha o topo do arquivo igual até a função listarLivros)

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
                // Botão de devolver com estilo de alerta
                acaoHtml = `<button class="btn-pegar" style="background: #e67e22; color: white;" onclick="devolverLivro(${livro.id})">Devolver</button>`;
            } else if (disponivel > 0) {
                // Botão padrão azul do seu CSS
                acaoHtml = `<button class="btn-pegar" onclick="pegarLivro(${livro.id})">Pegar (${disponivel} un.)</button>`;
            } else {
                acaoHtml = `<span class="indisponivel">Esgotado</span>`;
            }

            // Ícone de lixeira para o Admin
            if (sessao.tipo === 'admin') {
                acaoHtml += `<button class="btn-pegar" onclick="excluirLivro(${livro.id})" style="background:#ff1869; margin-top: 5px; width: 40px; margin-left: auto; margin-right: auto;">🗑️</button>`;
            }
        }

        // HTML ESTRUTURADO PARA O SEU NOVO CSS
        container.innerHTML += `
            <div class="card-livro">
                <div class="capa-container">
                    <img src="${livro.capa}" onerror="this.src='https://via.placeholder.com/240x320?text=Sem+Capa'">
                </div>
                <div class="card-detalhes">
                    <span class="genero-tag">${livro.generol || 'Geral'}</span>
                    <h3 title="${livro.titulo}">${livro.titulo}</h3>
                    <p style="font-size: 0.8rem; color: #bbb; margin-bottom: 5px;">${livro.autor}</p>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        ${acaoHtml}
                    </div>
                </div>
            </div>
        `;
    });
}

// ... (mantenha as funções pegarLivro, devolverLivro e excluirLivro iguais ao final do seu arquivo)
