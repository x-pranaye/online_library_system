// Main Application Logic

// Sample Book Data
const booksData = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "fiction",
        rating: 4.8,
        cover: "https://via.placeholder.com/220x280/6366f1/ffffff?text=Gatsby",
        description: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
        pages: 320,
        downloads: 1234
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        category: "education",
        rating: 4.9,
        cover: "https://via.placeholder.com/220x280/10b981/ffffff?text=Atomic",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
        pages: 280,
        downloads: 2345
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "technology",
        rating: 4.7,
        cover: "https://via.placeholder.com/220x280/ec4899/ffffff?text=Clean+Code",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
        pages: 464,
        downloads: 1890
    },
    {
        id: 4,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "business",
        rating: 4.8,
        cover: "https://via.placeholder.com/220x280/f59e0b/ffffff?text=Psychology",
        description: "Doing well with money isn't necessarily about what you know. It's about how you behave.",
        pages: 256,
        downloads: 1567
    },
    {
        id: 5,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "science",
        rating: 4.6,
        cover: "https://via.placeholder.com/220x280/8b5cf6/ffffff?text=Sapiens",
        description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution.",
        pages: 443,
        downloads: 2100
    },
    {
        id: 6,
        title: "Deep Work",
        author: "Cal Newport",
        category: "education",
        rating: 4.5,
        cover: "https://via.placeholder.com/220x280/3b82f6/ffffff?text=Deep+Work",
        description: "Rules for focused success in a distracted world.",
        pages: 304,
        downloads: 1345
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingBooks();
    initNavigation();
    checkAuth();
});

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Load Trending Books on Homepage
function loadTrendingBooks() {
    const container = document.getElementById('trendingBooks');
    if (!container) return;

    const trending = booksData.slice(0, 4);
    
    container.innerHTML = trending.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}">
                <div class="book-overlay">
                    <button onclick="event.stopPropagation(); addToFavorites(${book.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button onclick="event.stopPropagation(); openBookModal(${book.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <div class="book-rating">
                    ${'⭐'.repeat(Math.floor(book.rating))} ${book.rating}
                </div>
            </div>
        </div>
    `).join('');
}

// Search Functionality
function searchBooks() {
    const searchTerm = document.getElementById('navSearch')?.value || 
                      document.getElementById('mainSearch')?.value;
    
    if (searchTerm) {
        window.location.href = `books.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Book Modal
function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('bookModal');
    if (!modal) {
        window.location.href = `books.html?book=${bookId}`;
        return;
    }

    document.getElementById('modalBookCover').src = book.cover;
    document.getElementById('modalBookTitle').textContent = book.title;
    document.getElementById('modalBookAuthor').textContent = `by ${book.author}`;
    document.getElementById('modalBookRating').innerHTML = `
        ${'⭐'.repeat(Math.floor(book.rating))} <span>(${book.rating}/5)</span>
    `;
    document.getElementById('modalBookCategory').innerHTML = `
        <i class="fas fa-tag"></i> ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
    `;
    document.getElementById('modalBookPages').innerHTML = `
        <i class="fas fa-file-alt"></i> ${book.pages} pages
    `;
    document.getElementById('modalBookDesc').textContent = book.description;

    modal.classList.add('active');
    
    // Store current book for actions
    modal.dataset.currentBook = bookId;
}

function closeModal() {
    const modal = document.getElementById('bookModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function readBook() {
    const modal = document.getElementById('bookModal');
    const bookId = modal?.dataset.currentBook;
    window.location.href = `read.html?book=${bookId}`;
}

function downloadBook() {
    const modal = document.getElementById('bookModal');
    const bookId = modal?.dataset.currentBook;
    
    // Simulate download
    showNotification('Download started!', 'success');
    
    // In real implementation, this would trigger actual file download
    setTimeout(() => {
        showNotification('Download completed!', 'success');
    }, 2000);
}

function addToFavorites(bookId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(bookId)) {
        showNotification('Already in favorites!', 'warning');
        return;
    }
    
    favorites.push(bookId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showNotification('Added to favorites!', 'success');
}

// Profile Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }
    
    // Update nav active state
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function continueReading() {
    window.location.href = 'read.html';
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auth Check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    const protectedPages = ['profile.html', 'admin.html', 'read.html'];
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        // In development, allow access
        // window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
        closeModal();
    }
}