(function() {
    let zoomLevel = 1;
    let enabled = true;

    const vCursor = document.createElement('div');
    vCursor.id = 'v-cursor';

    Object.assign(vCursor.style, {
        position: 'fixed',
        width: '40px',
        height: '40px',
        backgroundImage: `url(${chrome.runtime.getURL("ladybug.png")})`, // Image by pngtree.com
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: '2147483647',
        left: '0',
        top: '0',
        transform: 'translate(-50%, -50%)',
        transition: 'none',
        display: 'block'
    });

    document.documentElement.appendChild(vCursor);

    window.addEventListener('mousemove', (e) => {
        if (!enabled) return;
        vCursor.style.left = `${e.clientX}px`;
        vCursor.style.top = `${e.clientY}px`;
    });

    window.addEventListener('wheel', (e) => {
        if (!enabled) return;
        const html = document.documentElement;
        const body = document.body;
        if (!html || !body) return;

        if (!e.shiftKey) {
            return;
        }

        e.preventDefault();

        //Capture mouse position
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        //Zoom level
        const sensitivity = 0.1;
        const oldLevel = zoomLevel;
        if (e.deltaY < 0) {
            zoomLevel += sensitivity;
        } else {
            zoomLevel = Math.max(1, zoomLevel - sensitivity);
        }

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
        } else {
            html.style.width = '';
            html.style.height = '';
            body.style.position = '';
        }

        // Scroll the window to keep the mouse point centered
        const ratio = zoomLevel / oldLevel;
        const newScrollX = mouseX * ratio - e.clientX;
        const newScrollY = mouseY * ratio - e.clientY;

        window.scrollTo(newScrollX, newScrollY);

    }, { passive: false });

    function setEnabled(val) {
        enabled = val;
        vCursor.style.display = enabled ? 'block' : 'none';
        if (!enabled) {
            // Reset zoom when turning off
            const html = document.documentElement;
            const body = document.body;
            body.style.transform = '';
            body.style.transformOrigin = '';
            body.style.width = '';
            body.style.position = '';
            html.style.width = '';
            html.style.height = '';
            html.style.overflow = '';
            zoomLevel = 1;
        }
    }

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "toggle") {
            setEnabled(msg.enabled);
        }
    });

})();
