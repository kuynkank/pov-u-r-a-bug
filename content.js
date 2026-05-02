(function() {
    let zoomLevel = 1;

    window.addEventListener('wheel', (e) => {
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

})();