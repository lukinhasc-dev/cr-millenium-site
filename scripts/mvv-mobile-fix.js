// MVV Mobile Touch Handler - Replicates desktop hover behavior for mobile
window.addEventListener("load", function () {
    const mvvItems = document.querySelectorAll(".mvv-item");

    // Exit if no MVV items found
    if (mvvItems.length === 0) return;

    const windowWidth = window.innerWidth;

    // Only apply touch handling on mobile devices (≤768px)
    if (windowWidth <= 768) {
        mvvItems.forEach(function (item) {
            let startY = 0;
            let startX = 0;
            let isTouching = false;

            // Track touch start position
            item.addEventListener("touchstart", function (e) {
                isTouching = true;
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            }, { passive: true });

            // Handle touch end - toggle active state
            item.addEventListener("touchend", function (e) {
                if (!isTouching) return;
                isTouching = false;

                // Get end position
                const endY = e.changedTouches[0].clientY;
                const endX = e.changedTouches[0].clientX;

                // Calculate movement distance
                const deltaY = Math.abs(endY - startY);
                const deltaX = Math.abs(endX - startX);

                // If there was significant movement, it's a scroll/swipe, not a tap
                if (deltaY > 10 || deltaX > 10) return;

                // It's a tap - toggle the active state
                const isActive = item.classList.contains("mvv-mobile-active");

                // Remove active class from all items
                mvvItems.forEach(function (mvvItem) {
                    mvvItem.classList.remove("mvv-mobile-active");
                });

                // If this item wasn't active, make it active
                if (!isActive) {
                    item.classList.add("mvv-mobile-active");
                }
            }, { passive: true });
        });
    }
});