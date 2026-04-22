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
