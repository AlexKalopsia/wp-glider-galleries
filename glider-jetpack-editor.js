(() => {

    // Always re-run "wp i18n make-json languages" to generate updated json translations

    const { __ } = wp.i18n;

    wp.domReady(() => {
        const CHECK_INTERVAL = 500;
        const MAX_ATTEMPTS = 20;
        let attempts = 0;

        function injectWarning(block) {
            const jetpackSlideshow = block.querySelector('.wp-block-jetpack-slideshow');
            if (jetpackSlideshow && !block.querySelector('.glider-warning')) {
                const msg = document.createElement('div');
                msg.className = 'glider-warning';
                msg.style = 'background: #fff3cd; border: 1px solid #ffeeba; padding: 8px; margin-bottom: 8px; font-size: 14px;';
                msg.textContent = __('✅ This Jetpack gallery will automatically be converted to a Glider gallery.', 'wp-glider-galleries');
                jetpackSlideshow.parentElement.insertBefore(msg, jetpackSlideshow);
            }
        }

        function scanAndInject() {
            document.querySelectorAll('.wp-block-missing').forEach((block) => {
                injectWarning(block);
            });
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(scanAndInject, CHECK_INTERVAL);
            }
        }

        scanAndInject();
    });

})();