// E-Reader Functionality

let currentFontSize = 18;
let currentTheme = 'light';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    loadBookContent();
    initReader();
});

function initReader() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'Escape') toggleSettings();
    });
    
    // Load saved preferences
    const savedFontSize = localStorage.getItem('readerFontSize');
    const savedTheme = localStorage.getItem('readerTheme');
    
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        updateFontSize();
    }
    
    if (savedTheme) {
        setTheme(savedTheme);
    }
}

function loadBookContent() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book');
    
    // In real implementation, fetch book content from server
    // For demo, using static content
    const book = booksData.find(b => b.id == bookId);
    
    if (book) {
        document.getElementById('readerBookTitle').textContent = book.title;
    }
}

function toggleSettings() {
    const settings = document.getElementById('readerSettings');
    settings.classList.toggle('active');
}

function changeFontSize(delta) {
    currentFontSize += delta * 2;
    currentFontSize = Math.max(12, Math.min(32, currentFontSize));
    
    updateFontSize();
    localStorage.setItem('readerFontSize', currentFontSize);
}

function updateFontSize() {
    const content = document.getElementById('readerContent');
    const display = document.getElementById('fontSizeValue');
    
    content.style.fontSize = currentFontSize + 'px';
    if (display) display.textContent = currentFontSize + 'px';
}

function changeFont() {
    const font = document.getElementById('fontFamily').value;
    const content = document.getElementById('readerContent');
    content.style.fontFamily = font + ', serif';
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = 'reader-mode ' + theme;
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.theme-btn.${theme}`)?.classList.add('active');
    
    localStorage.setItem('readerTheme', theme);
}

function changeSpacing() {
    const spacing = document.getElementById('lineSpacing').value;
    const content = document.getElementById('readerContent');
    content.style.lineHeight = spacing;
}

function toggleBookmark() {
    const icon = document.getElementById('bookmarkIcon');
    const isBookmarked = icon.classList.contains('fas');
    
    if (isBookmarked) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Bookmark removed', 'info');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Page bookmarked!', 'success');
        
        // Save bookmark
        const currentPage = document.getElementById('pageProgress').textContent;
        bookmarks.push({
            page: currentPage,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function prevPage() {
    // In real implementation, this would load previous page content
    showNotification('Previous page', 'info');
    updateProgress(-5);
}

function nextPage() {
    // In real implementation, this would load next page content
    showNotification('Next page', 'info');
    updateProgress(5);
}

function updateProgress(percent) {
    const progressBar = document.getElementById('readingProgress');
    let currentWidth = parseInt(progressBar.style.width) || 14;
    let newWidth = Math.max(0, Math.min(100, currentWidth + percent));
    
    progressBar.style.width = newWidth + '%';
    
    // Update page number (mock)
    const totalPages = 320;
    const currentPage = Math.floor((newWidth / 100) * totalPages);
    document.getElementById('pageProgress').textContent = `Page ${currentPage} of ${totalPages}`;
}

function showNotification(message, type) {
    // Reuse notification from main.js or create simple version
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--success)' : '#333'};
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2000);
}