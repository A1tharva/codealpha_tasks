document.addEventListener('DOMContentLoaded', () => {
    // --- Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    // contentArray will store objects { src, title, category } for currently visible items
    let visibleItems = []; 

    function updateVisibleItems() {
        visibleItems = [];
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (!item.classList.contains('hide')) {
                const img = item.querySelector('img');
                const title = item.querySelector('h3').textContent;
                const category = item.querySelector('p').textContent;
                visibleItems.push({
                    src: img.src,
                    title: title,
                    category: category,
                    originalElement: item
                });
            }
        });
    }

    function openLightbox(index) {
        updateVisibleItems();
        // Find the index in the *visible* items array that corresponds to the clicked item
        // This is a bit tricky because the click event listener is on the original element
        // We need to map the clicked element to its index in visibleItems
        
        currentIndex = index; 
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scroll
    }

    function updateLightboxContent() {
        const item = visibleItems[currentIndex];
        lightboxImg.src = item.src;
        lightboxTitle.textContent = item.title;
        lightboxCategory.textContent = item.category;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxContent();
    }

    // Add click events to gallery items
    // We need to re-bind or handle this dynamically because filtering changes visibility
    // But the elements themselves don't change, just their display state.
    // However, the "index" passed to openLightbox needs to be relative to the *visible* set.
    
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            // Find index of this item in the visibleItems array
            const clickedIndex = visibleItems.findIndex(vItem => vItem.originalElement === item);
            if (clickedIndex !== -1) {
                openLightbox(clickedIndex);
            }
        });
    });

    // Lightbox Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
