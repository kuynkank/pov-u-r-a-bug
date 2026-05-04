(function() {
    // Listen for messages from the extension popup
    chrome.runtime.onMessage.addListener((message) => {
        if (message.zoom) {
            applyAntPerspective(parseFloat(message.zoom));
        }
    });

    function applyAntPerspective(zoomLevel) {
        const html = document.documentElement;
        const body = document.body;
        if (!html || !body) return;


        html.style.perspective = "1000px"; // Lower = more extreme triangle
        html.style.perspectiveOrigin = "50% 0%"; // Keeps the "vanishing point" at the top center
        // const tiltAngle = Math.min((zoomLevel - 1) * 3, 45);

        // Apply zoom to body
        body.style.transformOrigin = '0 0'; //helps site stay in scrollable area
        body.style.transform = `scale(${zoomLevel})`;
        body.style.transition = "none";

        // Locking
        if (zoomLevel > 1) {
        // Enable scrollbars
        html.style.width = `${100 * zoomLevel}vw`;
        html.style.height = `${100 * zoomLevel}vh`;
        html.style.overflow = 'auto';        
        //Lock layout at zoomed
        body.style.width = '100vw';
        body.style.position = 'absolute';

        const ratio = zoomLevel / oldLevel;
        window.scrollTo(window.scrollX * ratio, window.scrollY * ratio);
        
        } else {
                html.style.width = '';
                html.style.height = '';
                body.style.position = '';
            }
        }
    }
)();