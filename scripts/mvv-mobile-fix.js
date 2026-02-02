window.addEventListener("load", function () {
    let e = document.querySelectorAll(".mvv-item");
    if (0 === e.length) return;
    let t = window.innerWidth;
    t <= 768 && e.forEach(function (t, n) {
        let i = 0, c = 0, s = !1;
        t.addEventListener("touchstart", function e(t) {
            s = !0, i = t.touches[0].clientY, c = t.touches[0].clientX
        }, { passive: !0 }), t.addEventListener("touchend", function n(a) {
            if (!s) return;
            s = !1;
            let l = a.changedTouches[0].clientY,
                o = a.changedTouches[0].clientX,
                v = Math.abs(l - i),
                r = Math.abs(o - c);
            if (v > 10 || r > 10) return;
            let u = t.classList.contains("mvv-mobile-active");
            e.forEach(function (e, t) { e.classList.remove("mvv-mobile-active") }), u || t.classList.add("mvv-mobile-active")
        }, { passive: !0 })
    })
});