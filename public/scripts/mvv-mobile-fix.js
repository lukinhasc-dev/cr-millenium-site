// === MVV MOBILE TOUCH HANDLER - FUNCIONAL ===
// Este código faz o MVV funcionar no mobile
// Esperar DOM carregar
window.addEventListener('load', function () {

    const mvvItems = document.querySelectorAll('.mvv-item');

    if (mvvItems.length === 0) {
        return;
    }

    // Detectar mobile
    const larguraTela = window.innerWidth;
    const ehMobile = larguraTela <= 768;

    if (!ehMobile) {
        return;
    }

    // Para cada card MVV
    mvvItems.forEach(function (card, indice) {

        // Variáveis para detectar se foi tap ou scroll
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouching = false;

        // Quando começa o toque
        function aoIniciarToque(event) {
            isTouching = true;
            touchStartY = event.touches[0].clientY;
            touchStartX = event.touches[0].clientX;
        }

        // Quando termina o toque
        function aoTerminarToque(event) {
            if (!isTouching) return;
            isTouching = false;

            // Calcular quanto moveu
            const touchEndY = event.changedTouches[0].clientY;
            const touchEndX = event.changedTouches[0].clientX;
            const moveY = Math.abs(touchEndY - touchStartY);
            const moveX = Math.abs(touchEndX - touchStartX);

            // Se moveu muito, é scroll - IGNORAR
            if (moveY > 10 || moveX > 10) {
                return;
            }

            // É um TAP! Executar toggle

            const estaAtivo = card.classList.contains('mvv-mobile-active');

            // Desativar todos
            mvvItems.forEach(function (outroCard, outroIndice) {
                outroCard.classList.remove('mvv-mobile-active');
            });

            // Toggle no card atual
            if (!estaAtivo) {
                card.classList.add('mvv-mobile-active');
            } else {
            }
        }

        // Adicionar eventos
        card.addEventListener('touchstart', aoIniciarToque, { passive: true });
        card.addEventListener('touchend', aoTerminarToque, { passive: true });
    });
});
