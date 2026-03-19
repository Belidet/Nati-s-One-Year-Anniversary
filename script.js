// Bank accounts data
const bankAccounts = {
    maryjoy: [
        { bank: 'CBE', logo: 'CBE.jpg', account: '1000006578377' },
        { bank: 'Abyssinia Bank', logo: 'ABYSSINIA BANK.jpg', account: '01308267176100' },
        { bank: 'Dashen Bank', logo: 'DASHEN BANK.jpg', account: '0025914084001' }
    ],
    mekedonia: [
        { bank: 'CBE', logo: 'CBE.jpg', account: '7979' },
        { bank: 'Abyssinia Bank', logo: 'ABYSSINIA BANK.jpg', account: '7979' },
        { bank: 'Dashen Bank', logo: 'DASHEN BANK.jpg', account: '7979' }
    ],
    mathiwos: [
        { bank: 'CBE', logo: 'CBE.jpg', account: '1000007229686' },
        { bank: 'Dashen Bank', logo: 'DASHEN BANK.jpg', account: '5012908016006' },
        { bank: 'Abay Bank', logo: 'ABAY BANK.jpg', account: '1819411034907514' }
    ]
};

// DOM Elements
const modal = document.getElementById('donationModal');
const modalClose = document.querySelector('.modal-close');
const bankDetails = document.getElementById('bankDetails');
const donateButtons = document.querySelectorAll('.donate-btn');
const toast = document.getElementById('toast');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to donate buttons
    donateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ngo = e.target.dataset.ngo;
            openModal(ngo);
        });
    });

    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-row, .ngo-card, .thanks-card, .memorial-circle-photo').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add special animation for circular photo
    const circlePhoto = document.querySelector('.memorial-circle-photo');
    if (circlePhoto) {
        circlePhoto.style.animation = 'fadeIn 1s ease';
    }
});

// Modal functions
function openModal(ngo) {
    populateBankDetails(ngo);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Populate bank details in modal
function populateBankDetails(ngo) {
    const accounts = bankAccounts[ngo];
    if (!accounts) return;

    let html = '';
    accounts.forEach(account => {
        html += `
            <div class="bank-item">
                <div class="bank-logo-container">
                    <img src="${account.logo}" alt="${account.bank}" class="bank-logo" 
                         onerror="handleBankImageError(this, '${account.bank}')">
                </div>
                <div class="bank-info">
                    <div class="bank-name">${account.bank}</div>
                    <div class="account-number">
                        <span>${account.account}</span>
                        <button class="copy-btn" onclick="copyAccountNumber('${account.account}', this)">
                            <svg viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    bankDetails.innerHTML = html;
}

// Handle bank image errors with better fallback
function handleBankImageError(img, bankName) {
    console.log(`Image not found: ${img.src} for bank: ${bankName}`);
    
    // Create a colored div with bank initials as fallback
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'bank-logo-fallback';
    
    // Get initials from bank name
    let initials = '';
    let bgColor = '';
    
    if (bankName.includes('CBE')) {
        initials = 'CBE';
        bgColor = '#003366';
    } else if (bankName.includes('Abyssinia')) {
        initials = 'AB';
        bgColor = '#8B0000';
    } else if (bankName.includes('Dashen')) {
        initials = 'DB';
        bgColor = '#006400';
    } else if (bankName.includes('Abay')) {
        initials = 'ABAY';
        bgColor = '#4A90E2';
    } else {
        initials = bankName.substring(0, 3).toUpperCase();
        bgColor = '#2c3e50';
    }
    
    fallbackDiv.textContent = initials;
    fallbackDiv.style.backgroundColor = bgColor;
    
    // Replace the img with the fallback div
    img.parentNode.replaceChild(fallbackDiv, img);
}

// Copy account number to clipboard
function copyAccountNumber(accountNumber, buttonElement) {
    // Use modern clipboard API
    navigator.clipboard.writeText(accountNumber).then(() => {
        // Show success state on button
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        
        // Show toast notification
        showToast('Account number copied to clipboard!');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy. Please try again.', 'error');
        
        // Fallback for older browsers
        fallbackCopy(accountNumber, buttonElement);
    });
}

// Fallback copy method for older browsers
function fallbackCopy(text, buttonElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            showToast('Account number copied to clipboard!');
            
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showToast('Failed to copy. Please select and copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.style.background = '#e74c3c';
    } else {
        toast.style.background = '#2c3e50';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        // Reset background color
        setTimeout(() => {
            toast.style.background = '#2c3e50';
        }, 300);
    }, 3000);
}

// Preload images for better performance
function preloadImages() {
    const images = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
        'MEKEDONIA.jpg', 'MARY JOY ETHIOPIA.jpg', 'MATHIWOS WONDU FOUNDATION.jpg',
        'CBE.jpg', 'ABYSSINIA BANK.jpg', 'DASHEN BANK.jpg', 'ABAY BANK.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onerror = () => console.log(`Could not preload: ${src}`);
    });
}

// Call preloadImages when page loads
document.addEventListener('DOMContentLoaded', preloadImages);

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
    // Adjust modal position if open
    if (modal.style.display === 'block') {
        setTimeout(() => {
            modal.scrollTop = 0;
        }, 100);
    }
});

// Export functions for global use
window.copyAccountNumber = copyAccountNumber;
window.handleBankImageError = handleBankImageError;