document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a UI passando o Banco de Dados e a instância do Carrinho
    window.UI = new UIManager(DB, cart);
    window.UI.init();
});
