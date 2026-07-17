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

    /* ── Google Reviews ── */
    var GOOGLE_API_KEY = '';  // <-- Add your Google Places API key here
    var PLACE_ID = '';

    function fetchReviews() {
        if (!GOOGLE_API_KEY || !PLACE_ID) return;
        var container = document.getElementById('reviews-container');
        if (!container) return;
        container.innerHTML = '<p class="reviews-loading">Loading reviews\u2026</p>';
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + encodeURIComponent(PLACE_ID) + '&fields=rating,user_ratings_total,reviews&key=' + encodeURIComponent(GOOGLE_API_KEY);
        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.status !== 'OK' || !data.result.reviews) {
                    container.innerHTML = '';
                    return;
                }
                var avg = data.result.rating;
                var total = data.result.user_ratings_total;
                var html = '<div class="reviews-summary">';
                html += '<span class="review-stars">' + '&#9733;'.repeat(Math.round(avg)) + '</span>';
                html += ' <strong>' + avg + '</strong> &middot; <a href="https://www.google.com/maps/place/Om+Spice+and+Sweets+Temple+TX/" target="_blank" rel="noopener">' + total + ' reviews on Google</a>';
                html += '</div><div class="reviews-list">';
                var count = Math.min(data.result.reviews.length, 3);
                for (var i = 0; i < count; i++) {
                    var r = data.result.reviews[i];
                    html += '<div class="review-card">';
                    html += '<div class="review-header">';
                    if (r.profile_photo_url) {
                        html += '<img src="' + r.profile_photo_url + '" alt="" class="review-avatar" loading="lazy">';
                    }
                    html += '<div><strong>' + escapeHtml(r.author_name) + '</strong>';
                    html += '<span class="review-stars">';
                    for (var s = 0; s < 5; s++) {
                        html += s < r.rating ? '&#9733;' : '&#9734;';
                    }
                    html += '</span></div></div>';
                    html += '<p class="review-text">' + escapeHtml(r.text) + '</p>';
                    html += '<span class="review-time">' + relativeTime(r.time) + '</span>';
                    html += '</div>';
                }
                html += '</div>';
                container.innerHTML = html;
            })
            .catch(function () { container.innerHTML = ''; });
    }

    function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function relativeTime(ts) {
        var diff = Math.floor(Date.now() / 1000) - ts;
        var days = Math.floor(diff / 86400);
        if (days < 1) return 'today';
        if (days < 7) return days + ' day' + (days > 1 ? 's' : '') + ' ago';
        if (days < 30) return Math.floor(days / 7) + ' week' + (Math.floor(days / 7) > 1 ? 's' : '') + ' ago';
        return Math.floor(days / 30) + ' month' + (Math.floor(days / 30) > 1 ? 's' : '') + ' ago';
    }

    fetchReviews();

});
