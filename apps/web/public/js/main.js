// Initialize on DOM ready
(d => {
    d.addEventListener('DOMContentLoaded', () => {
        // Setup toggle handlers
        const toggles = [
            { btn: 'mb-toggle-btn', target: 'hd-r', cls: 'nav-visible' },
            { btn: 'hs-menu-toggle', target: 'sk-menu', cls: 'sk-open' }
        ];

        toggles.forEach(({ btn, target, cls }) => {
            const b = d.getElementById(btn);
            const t = d.getElementById(target);
            b && t && b.addEventListener('pointerup', () => t.classList.toggle(cls));
        });

        // Hiscores world selector (CSP-safe, no inline handlers)
        const hsSelect = d.querySelector('.hs-nav-select');
        if (hsSelect) {
            hsSelect.addEventListener('change', (event) => {
                const target = event.currentTarget;
                if (!target) return;
                const baseUrl = target.getAttribute('data-base-url');
                const value = target.value;
                if (baseUrl && value) {
                    window.location.href = `${baseUrl}${value}`;
                }
            });
        }
    });
})(document);
