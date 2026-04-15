// Book Management Logic

let currentPage = 1;
let filteredBooks = [...booksData];
let currentView = 'grid';

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    checkUrlParams();
});

function loadBooks() {
    const container = document.getElementById('booksContainer');
    if (!container) return;

    renderBooks();
    updatePagination();
}

function renderBooks() {
    const container = document.getElementById('booksContainer');
    const start = (currentPage - 1) * 12;
    const end = start + 12;
    const booksToShow = filteredBooks.slice(start, end);

    if (booksToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = booksToShow.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}">
                <div class="book-overlay">
                    <button onclick="event.stopPropagation(); addToFavorites(${book.id})" title="Add to Favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button onclick="event.stopPropagation(); openBookModal(${book.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="event.stopPropagation(); quickRead(${book.id})" title="Quick Read">
                        <i class="fas fa-book-open"></i>
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <div class="book-meta">
                    <span class="book-rating">${'⭐'.repeat(Math.floor(book.rating))} ${book.rating}</span>
                    <span class="downloads"><i class="fas fa-download"></i> ${formatNumber(book.downloads)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterBooks() {
    const searchTerm = document.getElementById('mainSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    
    filteredBooks = booksData.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || book.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    renderBooks();
    updatePagination();
}

function sortBooks() {
    const sortType = document.getElementById('sortFilter')?.value || 'newest';
    
    switch(sortType) {
        case 'popular':
            filteredBooks.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'az':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            filteredBooks.sort((a, b) => b.id - a.id);
    }
    
    renderBooks();
}

function toggleView(view) {
    currentView = view;
    const container = document.getElementById('booksContainer');
    const buttons = document.querySelectorAll('.view-toggle button');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('button').classList.add('active');
    
    if (view === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredBooks.length / 12);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderBooks();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / 12);
    const pageInfo = document.getElementById('pageInfo');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

function quickRead(bookId) {
    window.location.href = `read.html?book=${bookId}`;
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('search');
    const bookId = params.get('book');
    
    if (searchTerm) {
        const searchInput = document.getElementById('mainSearch');
        if (searchInput) {
            searchInput.value = searchTerm;
            filterBooks();
        }
    }
    
    if (bookId) {
        openBookModal(parseInt(bookId));
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

// Make booksData available globally
window.booksData = booksData;