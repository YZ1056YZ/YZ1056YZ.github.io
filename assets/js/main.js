/**
 * Main JavaScript file for Yunuo Zhang's academic website
 * This provides interactive features and enhances user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initSmoothScrolling();
    initMobileNavigation();
    updateCopyrightYear();
    addScrollAnimation();
});


/**
 * Smooth scrolling for navigation links
 * Makes page navigation feel smoother when clicking on nav links
 */
function initSmoothScrolling() {
    // Get all links that have hash (#) references
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default jump-to behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just "#"
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // Skip if target doesn't exist
            
            // Scroll smoothly to the target
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Offset for header
                behavior: 'smooth'
            });
        });
    });
}


/**
 * Mobile navigation toggle for responsive design
 * Creates a hamburger menu for small screens
 */
function initMobileNavigation() {
    // Add mobile navigation toggle functionality
    const navToggle = document.createElement('div');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const nav = document.querySelector('nav');
    if (!nav) return; // Skip if nav doesn't exist
    
    // Insert toggle button before the nav
    nav.parentNode.insertBefore(navToggle, nav);
    
    // Toggle navigation menu when clicking the button
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
}


/**
 * Automatically update the copyright year
 * Ensures the footer always shows the current year
 */
function updateCopyrightYear() {
    const yearElement = document.querySelector('footer .container p');
    if (!yearElement) return; // Skip if element doesn't exist
    
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace(/\d{4}/, currentYear);
}


/**
 * Add scroll animation to page sections
 * Creates a fade-in effect for sections as they scroll into view
 */
function addScrollAnimation() {
    // Get all sections to animate
    const sections = document.querySelectorAll('.section');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add 'visible' class when section comes into view
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    // Start observing each section
    sections.forEach(section => {
        section.classList.add('fade-in'); // Add initial class
        observer.observe(section);
    });
}


/**
 * Handle form submission if contact form exists
 * Provides basic validation for contact forms
 */
document.addEventListener('submit', function(e) {
    // Check if it's a contact form
    if (e.target.id === 'contact-form') {
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Simple validation
        let isValid = true;
        
        if (!name.value.trim()) {
            highlightInvalid(name);
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            highlightInvalid(email);
            isValid = false;
        }
        
        if (!message.value.trim()) {
            highlightInvalid(message);
            isValid = false;
        }
        
        // Prevent form submission if validation fails
        if (!isValid) {
            e.preventDefault();
        }
    }
});


/**
 * Validate email format
 * @param {string} email - The email to validate
 * @return {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * Highlight invalid form fields
 * @param {HTMLElement} element - The element to highlight
 */
function highlightInvalid(element) {
    element.classList.add('invalid');
    
    // Remove highlight when user focuses on the field
    element.addEventListener('focus', function() {
        this.classList.remove('invalid');
    }, { once: true });
}


function createContributionGraph() {
    const graphContainer = document.querySelector('.contribution-graph');
    if (!graphContainer) return;
    
    // Create a placeholder graph - in a real implementation 
    // you would populate this with actual data
    const rows = 7;
    const cols = 52;
    const levels = ['low', 'med', 'high'];
    
    let graphHTML = '<div class="graph-wrapper">';
    
    for (let i = 0; i < rows; i++) {
        graphHTML += '<div class="graph-row">';
        for (let j = 0; j < cols; j++) {
            // Randomly assign activity levels for demonstration
            const level = Math.random() > 0.7 ? levels[Math.floor(Math.random() * levels.length)] : '';
            graphHTML += `<div class="graph-cell ${level}"></div>`;
        }
        graphHTML += '</div>';
    }
    
    graphHTML += '</div>';
    graphContainer.innerHTML = graphHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    // Other initialization code
    createContributionGraph();
});
