// === MVV MOBILE TOUCH HANDLER - FUNCIONAL ===
// Este código faz o MVV funcionar no mobile

console.log('🔧 MVV Mobile: Iniciando...');

// Esperar DOM carregar
window.addEventListener('load', function () {
    console.log('📄 DOM carregado, procurando MVV items...');

    const mvvItems = document.querySelectorAll('.mvv-item');
    console.log(`📦 Encontrados ${mvvItems.length} items MVV`);

    if (mvvItems.length === 0) {
        console.error('❌ ERRO: Nenhum .mvv-item encontrado!');
        return;
    }

    // Detectar mobile
    const larguraTela = window.innerWidth;
    const ehMobile = larguraTela <= 768;
    console.log(`📱 Largura da tela: ${larguraTela}px | É mobile: ${ehMobile}`);

    if (!ehMobile) {
        console.log('⏭️ Desktop detectado - usando hover normal');
        return;
    }

    console.log('✅ Mobile detectado - configurando touch handlers');

    // Para cada card MVV
    mvvItems.forEach(function (card, indice) {
        console.log(`  ➕ Configurando card #${indice + 1}`);

        // Variáveis para detectar se foi tap ou scroll
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouching = false;

        // Quando começa o toque
        function aoIniciarToque(event) {
            isTouching = true;
            touchStartY = event.touches[0].clientY;
            touchStartX = event.touches[0].clientX;
            console.log(`  📍 Touch start no card #${indice + 1}`);
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

            console.log(`  📐 Movimento: X=${moveX}px, Y=${moveY}px`);

            // Se moveu muito, é scroll - IGNORAR
            if (moveY > 10 || moveX > 10) {
                console.log(`  ⏭️ Movimento detectado - ignorando (era scroll)`);
                return;
            }

            // É um TAP! Executar toggle
            console.log(`\n👆 TAP no card #${indice + 1}`);

            const estaAtivo = card.classList.contains('mvv-mobile-active');
            console.log(`  📋 Estado atual: ${estaAtivo ? 'ATIVO' : 'INATIVO'}`);

            // Desativar todos
            mvvItems.forEach(function (outroCard, outroIndice) {
                outroCard.classList.remove('mvv-mobile-active');
            });

            // Toggle no card atual
            if (!estaAtivo) {
                card.classList.add('mvv-mobile-active');
                console.log(`  ✅ Card #${indice + 1} ATIVADO!`);
            } else {
                console.log(`  ❌ Card #${indice + 1} DESATIVADO`);
            }
        }

        // Adicionar eventos
        card.addEventListener('touchstart', aoIniciarToque, { passive: true });
        card.addEventListener('touchend', aoTerminarToque, { passive: true });
        console.log(`  ✓ Eventos touch adicionados no card #${indice + 1}`);
    });

    console.log('\n🎉 MVV Mobile configurado com SUCESSO!');
    console.log('📝 Toque em um card para testar\n');
});
