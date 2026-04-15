// Admin Panel Logic

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadDashboardData();
    initAdminEvents();
});

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
        // For demo purposes, allow access
        console.log('Admin access granted for demo');
    }
}

function initAdminEvents() {
    // Admin menu navigation
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('onclick').match(/'(\w+)'/)[1];
            showAdminSection(section);
        });
    });
}

function showAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected
    const target = document.getElementById('admin-' + sectionId) || 
                   document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }
    
    // Update menu
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function loadDashboardData() {
    // In real implementation, fetch from API
    updateStats();
    loadBooksTable();
}

function updateStats() {
    // Animate numbers
    animateValue(document.querySelector('.stat-card.blue h3'), 0, 12450, 2000);
    animateValue(document.querySelector('.stat-card.green h3'), 0, 45678, 2000);
    animateValue(document.querySelector('.stat-card.orange h3'), 0, 89234, 2000);
    animateValue(document.querySelector('.stat-card.purple h3'), 0, 234567, 2000);
}

function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function loadBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = booksData.map(book => `
        <tr>
            <td><img src="${book.cover}" alt="${book.title}"></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><span class="badge">${book.category}</span></td>
            <td>${book.downloads.toLocaleString()}</td>
            <td>⭐ ${book.rating}</td>
            <td>
                <button class="btn btn-icon" onclick="editBook(${book.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon delete" onclick="deleteBook(${book.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openAddBookModal() {
    const modal = document.getElementById('addBookModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAddBookModal() {
    const modal = document.getElementById('addBookModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function editBook(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (book) {
        openAddBookModal();
        // Populate form with book data
        console.log('Editing book:', book);
    }
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        const index = booksData.findIndex(b => b.id === bookId);
        if (index > -1) {
            booksData.splice(index, 1);
            loadBooksTable();
            showNotification('Book deleted successfully', 'success');
        }
    }
}

// Handle add book form
document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate adding book
            showNotification('Book added successfully!', 'success');
            closeAddBookModal();
            addBookForm.reset();
            
            // Refresh table
            setTimeout(() => loadBooksTable(), 500);
        });
    }
});