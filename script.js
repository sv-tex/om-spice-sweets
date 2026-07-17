document.addEventListener('DOMContentLoaded', function () {

    /* ── Hamburger menu ── */
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ── Scroll shadow ── */
    var header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ── Daylight Saving Time hours ── */
    function isDST() {
        var now = new Date();
        var year = now.getFullYear();
        var marSecondSun = new Date(year, 2, 1);
        marSecondSun.setDate(14 - marSecondSun.getDay());
        var novFirstSun = new Date(year, 10, 1);
        novFirstSun.setDate(1 + (7 - novFirstSun.getDay()) % 7);
        return now >= marSecondSun && now < novFirstSun;
    }

    function getHours() {
        if (isDST()) {
            return { weekday: '11:00 AM – 7:30 PM', weekend: '12:00 PM – 7:30 PM', weekdayShort: '11AM–7:30PM', weekendShort: '12–7:30PM' };
        } else {
            return { weekday: '11:00 AM – 6:30 PM', weekend: '12:00 PM – 6:30 PM', weekdayShort: '11AM–6:30PM', weekendShort: '12–6:30PM' };
        }
    }

    function updateHours() {
        var h = getHours();
        document.querySelectorAll('.hours-dst').forEach(function (el) {
            var mode = el.getAttribute('data-mode') || 'short';
            if (mode === 'full') {
                el.textContent = 'Mon\u2013Sat ' + h.weekday + '  |  Sun ' + h.weekend;
            } else if (mode === 'weekday') {
                el.textContent = h.weekday;
            } else if (mode === 'weekend') {
                el.textContent = h.weekend;
            } else {
                el.textContent = 'Mon\u2013Sat ' + h.weekdayShort + '  |  Sun ' + h.weekendShort;
            }
        });
    }

    updateHours();

});
