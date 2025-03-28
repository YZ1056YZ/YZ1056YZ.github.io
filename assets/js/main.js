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
    createContributionGraph();
    // Initialize POMDP Game
    initPOMDPGame();

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


function initPOMDPGame() {
    // Get DOM elements
    const startButton = document.getElementById('start-game');
    const playAgainButton = document.getElementById('play-again');
    const checkLocationButton = document.getElementById('check-location');
    const sensorButton = document.getElementById('sensor-btn');
    const moveButtons = document.querySelectorAll('.move-btn');
    const gameIntro = document.getElementById('game-intro');
    const gamePlay = document.getElementById('game-play');
    const gameOver = document.getElementById('game-over');
    const canvas = document.getElementById('game-canvas');
    const movesCounter = document.getElementById('moves-counter');
    const scoreCounter = document.getElementById('score-counter');
    const beliefCounter = document.getElementById('belief-counter');
    const finalScore = document.getElementById('final-score');
    
    // Game state
    let gameState = {
        started: false,
        gameOver: false,
        score: 100,
        moves: 0,
        playerPos: { x: 0, y: 0 },
        targetPos: { x: 0, y: 0 },
        particles: [],
        observations: [],
        beliefCertainty: 0,
        gameSize: 7,
        particleCount: 50,
        sensorNoise: 1
    };
    
    // Initialize game
    function initGame() {
        // Get settings
        gameState.gameSize = parseInt(document.getElementById('grid-size').value);
        gameState.particleCount = parseInt(document.getElementById('particle-count').value);
        gameState.sensorNoise = parseFloat(document.getElementById('sensor-noise').value);
        
        // Random player position
        gameState.playerPos = {
            x: Math.floor(Math.random() * gameState.gameSize),
            y: Math.floor(Math.random() * gameState.gameSize)
        };
        
        // Random target position (different from player)
        do {
            gameState.targetPos = {
                x: Math.floor(Math.random() * gameState.gameSize),
                y: Math.floor(Math.random() * gameState.gameSize)
            };
        } while (
            gameState.targetPos.x === gameState.playerPos.x && 
            gameState.targetPos.y === gameState.playerPos.y
        );
        
        // Initialize particles uniformly across the grid
        gameState.particles = [];
        for (let i = 0; i < gameState.particleCount; i++) {
            gameState.particles.push({
                x: Math.floor(Math.random() * gameState.gameSize),
                y: Math.floor(Math.random() * gameState.gameSize),
                weight: 1 / gameState.particleCount
            });
        }
        
        // Reset game state
        gameState.observations = [];
        gameState.moves = 0;
        gameState.score = 100;
        gameState.beliefCertainty = 0;
        gameState.started = true;
        gameState.gameOver = false;
        
        // Update UI
        movesCounter.textContent = gameState.moves;
        scoreCounter.textContent = gameState.score;
        beliefCounter.textContent = Math.round(gameState.beliefCertainty * 100);
        checkLocationButton.disabled = true;
        
        // Show game play view
        gameIntro.classList.add('hidden');
        gamePlay.classList.remove('hidden');
        gameOver.classList.add('hidden');
        
        // Draw initial game state
        drawGame();
    }
    
    // Get sensor reading (distance + noise)
    function getSensorReading() {
        const trueDistance = Math.sqrt(
            Math.pow(gameState.playerPos.x - gameState.targetPos.x, 2) + 
            Math.pow(gameState.playerPos.y - gameState.targetPos.y, 2)
        );
        
        // Add noise to the sensor reading
        const noise = (Math.random() * 2 - 1) * gameState.sensorNoise;
        const observedDistance = Math.max(0, trueDistance + noise);
        
        return {
            position: { ...gameState.playerPos },
            distance: observedDistance
        };
    }
    
    // Update particles based on observation
    function updateParticles(observation) {
        // Copy particles
        let updatedParticles = [...gameState.particles];
        
        // Calculate weights based on likelihood
        updatedParticles.forEach((particle, i) => {
            const particleDistance = Math.sqrt(
                Math.pow(observation.position.x - particle.x, 2) + 
                Math.pow(observation.position.y - particle.y, 2)
            );
            
            // Likelihood: how likely is this observation if the target is at particle's position
            // Using Gaussian likelihood
            const likelihood = Math.exp(
                -Math.pow(particleDistance - observation.distance, 2) / 
                (2 * Math.pow(gameState.sensorNoise, 2))
            );
            
            updatedParticles[i].weight = likelihood;
        });
        
        // Normalize weights
        const totalWeight = updatedParticles.reduce((sum, p) => sum + p.weight, 0);
        if (totalWeight > 0) {
            updatedParticles.forEach((p, i) => {
                updatedParticles[i].weight = p.weight / totalWeight;
            });
        } else {
            // If all particles have zero weight, reset to uniform
            updatedParticles.forEach((p, i) => {
                updatedParticles[i].weight = 1 / gameState.particleCount;
            });
        }
        
        // Resample particles
        const newParticles = [];
        for (let i = 0; i < gameState.particleCount; i++) {
            // Select a particle based on weight
            let index = 0;
            let r = Math.random();
            let sum = updatedParticles[0].weight;
            
            while (sum < r && index < updatedParticles.length - 1) {
                index++;
                sum += updatedParticles[index].weight;
            }
            
            // Add some random jitter to avoid particle depletion
            const newX = Math.min(Math.max(
                updatedParticles[index].x + (Math.random() * 2 - 1) * 0.5,
                0
            ), gameState.gameSize - 1);
            
            const newY = Math.min(Math.max(
                updatedParticles[index].y + (Math.random() * 2 - 1) * 0.5,
                0
            ), gameState.gameSize - 1);
            
            newParticles.push({
                x: newX,
                y: newY,
                weight: 1 / gameState.particleCount
            });
        }
        
        // Calculate belief certainty
        const highestWeight = Math.max(...updatedParticles.map(p => p.weight));
        const certainty = highestWeight * gameState.particleCount; // Scale to 0-1 range
        
        gameState.particles = newParticles;
        gameState.beliefCertainty = Math.min(certainty, 1);
        
        // Update UI
        beliefCounter.textContent = Math.round(gameState.beliefCertainty * 100);
        
        // Enable check button if certainty is high enough
        checkLocationButton.disabled = gameState.beliefCertainty < 0.5;
    }
    
    // Take sensor reading
    function takeSensorReading() {
        if (gameState.gameOver) return;
        
        const reading = getSensorReading();
        gameState.observations.push(reading);
        updateParticles(reading);
        gameState.moves++;
        gameState.score = Math.max(0, gameState.score - 1); // Each reading costs 1 point
        
        // Update UI
        movesCounter.textContent = gameState.moves;
        scoreCounter.textContent = gameState.score;
        
        drawGame();
    }
    
    // Move player
    function movePlayer(dx, dy) {
        if (gameState.gameOver) return;
        
        const newX = Math.min(Math.max(gameState.playerPos.x + dx, 0), gameState.gameSize - 1);
        const newY = Math.min(Math.max(gameState.playerPos.y + dy, 0), gameState.gameSize - 1);
        
        gameState.playerPos = { x: newX, y: newY };
        gameState.moves++;
        gameState.score = Math.max(0, gameState.score - 2); // Moving costs 2 points
        
        // Update UI
        movesCounter.textContent = gameState.moves;
        scoreCounter.textContent = gameState.score;
        
        // Check if found target
        if (newX === gameState.targetPos.x && newY === gameState.targetPos.y) {
            endGame();
        }
        
        drawGame();
    }
    
    // Check for most likely target location
    function checkLocation() {
        if (gameState.gameOver) return;
        
        // Calculate most likely position from particles
        const gridCounts = Array(gameState.gameSize).fill().map(() => Array(gameState.gameSize).fill(0));
        
        gameState.particles.forEach(p => {
            const gridX = Math.floor(p.x);
            const gridY = Math.floor(p.y);
            if (gridX >= 0 && gridX < gameState.gameSize && gridY >= 0 && gridY < gameState.gameSize) {
                gridCounts[gridY][gridX] += p.weight;
            }
        });
        
        let maxVal = 0;
        let maxPos = { x: 0, y: 0 };
        
        for (let y = 0; y < gameState.gameSize; y++) {
            for (let x = 0; x < gameState.gameSize; x++) {
                if (gridCounts[y][x] > maxVal) {
                    maxVal = gridCounts[y][x];
                    maxPos = { x, y };
                }
            }
        }
        
        // Check if guess is correct
        if (maxPos.x === gameState.targetPos.x && maxPos.y === gameState.targetPos.y) {
            // Found by belief!
            gameState.score += 20; // Bonus for finding by belief
            scoreCounter.textContent = gameState.score;
            endGame();
        } else {
            // Wrong guess
            gameState.score = Math.max(0, gameState.score - 10); // Wrong guess costs 10 points
            scoreCounter.textContent = gameState.score;
        }
    }
    
    // End game
    function endGame() {
        gameState.gameOver = true;
        gamePlay.classList.add('hidden');
        gameOver.classList.remove('hidden');
        finalScore.textContent = gameState.score;
        drawGame(); // Draw final state with target
    }
    
    // Draw game board
    function drawGame() {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / gameState.gameSize;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gameState.gameSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
        
        // Draw belief state (particles)
        const heatmap = Array(gameState.gameSize).fill().map(() => Array(gameState.gameSize).fill(0));
        
        gameState.particles.forEach(p => {
            const gridX = Math.floor(p.x);
            const gridY = Math.floor(p.y);
            if (gridX >= 0 && gridX < gameState.gameSize && gridY >= 0 && gridY < gameState.gameSize) {
                heatmap[gridY][gridX] += p.weight;
            }
        });
        
        // Normalize heatmap for visualization
        let maxDensity = 0;
        for (let y = 0; y < gameState.gameSize; y++) {
            for (let x = 0; x < gameState.gameSize; x++) {
                maxDensity = Math.max(maxDensity, heatmap[y][x]);
            }
        }
        
        // Draw heatmap
        for (let y = 0; y < gameState.gameSize; y++) {
            for (let x = 0; x < gameState.gameSize; x++) {
                const density = maxDensity > 0 ? heatmap[y][x] / maxDensity : 0;
                if (density > 0) {
                    ctx.fillStyle = `rgba(255, 0, 0, ${density * 0.7})`;
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // Draw player
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(
            (gameState.playerPos.x + 0.5) * cellSize,
            (gameState.playerPos.y + 0.5) * cellSize,
            cellSize * 0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw target (only if game is over)
        if (gameState.gameOver) {
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.arc(
                (gameState.targetPos.x + 0.5) * cellSize,
                (gameState.targetPos.y + 0.5) * cellSize,
                cellSize * 0.4,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Draw observations (sensor readings)
        gameState.observations.forEach(obs => {
            ctx.strokeStyle = 'rgba(241, 196, 15, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                (obs.position.x + 0.5) * cellSize,
                (obs.position.y + 0.5) * cellSize,
                obs.distance * cellSize,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        });
    }
    
    // Event listeners
    if (startButton) {
        startButton.addEventListener('click', initGame);
    }
    
    if (playAgainButton) {
        playAgainButton.addEventListener('click', initGame);
    }
    
    if (sensorButton) {
        sensorButton.addEventListener('click', takeSensorReading);
    }
    
    if (checkLocationButton) {
        checkLocationButton.addEventListener('click', checkLocation);
    }
    
    moveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dx = parseInt(this.getAttribute('data-dx'));
            const dy = parseInt(this.getAttribute('data-dy'));
            movePlayer(dx, dy);
        });
    });
}
