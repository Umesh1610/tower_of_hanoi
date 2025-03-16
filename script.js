// Game state variables
let pegs = [[], [], []]; // Arrays to store discs on each peg (A, B, C)
let numDiscs; // Number of discs (user input)
let selectedPeg = null; // Currently selected peg (null if none)
let selectedDisc = null; // Currently selected disc element (for highlighting)
const colors = ['#ff6347', '#ffa500', '#ffd700', '#00ff00', '#1e90ff', '#ff00ff', '#ff4500', '#00ced1']; // Colors for disc edges (TARS/CASE glow)

// Starfield particle system variables
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 100;

// Initialize starfield
function initStarfield() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1
        });
    }

    animateStarfield();
}

// Animate starfield
function animateStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Move star
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animateStarfield);
}

// Start the game
function startGame() {
    // Get number of discs from user input
    numDiscs = parseInt(document.getElementById('discs').value);
    if (numDiscs < 3 || numDiscs > 8) {
        alert("Please enter a number between 3 and 8.");
        return;
    }

    // Reset game state
    pegs = [[], [], []];
    document.getElementById('peg1').innerHTML = '';
    document.getElementById('peg2').innerHTML = '';
    document.getElementById('peg3').innerHTML = '';
    document.getElementById('status').textContent = "Game Started!";
    document.getElementById('win-animation').innerHTML = '';

    // Initialize discs on peg A (peg1)
    for (let i = numDiscs; i > 0; i--) {
        pegs[0].push(i);
        const disc = document.createElement('div');
        disc.className = 'disc';
        disc.style.width = `${40 + (i - 1) * 20}px`; // Scale width with size
        disc.style.height = '20px';
        disc.style.bottom = `${50 + (numDiscs - i) * 22}px`; // Position above base
        disc.style.borderColor = colors[numDiscs - i]; // Glowing edge color
        disc.dataset.size = i;
        document.getElementById('peg1').appendChild(disc);
    }

    // Add click handlers to pegs
    document.querySelectorAll('.peg').forEach((peg, index) => {
        peg.onclick = () => moveDisc(index);
    });

    // Play background music (Cornfield Chase)
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.2; // Low volume to avoid overpowering
    backgroundMusic.play();

    // Initialize starfield
    initStarfield();

    // Trigger black hole effect
    document.getElementById('black-hole').style.opacity = '0'; // Reset for animation
}

// Handle disc movement
function moveDisc(targetPeg) {
    const status = document.getElementById('status');

    if (selectedPeg === null) {
        // Selecting a peg
        if (pegs[targetPeg].length > 0) {
            selectedPeg = targetPeg;
            const pegElement = document.getElementById(`peg${targetPeg + 1}`);
            pegElement.classList.add('selected');
            selectedDisc = pegElement.lastChild;
            selectedDisc.classList.add('selected-disc');
            status.textContent = `Selected peg ${targetPeg + 1}. Choose where to move the disc.`;
        } else {
            status.textContent = "No discs to select on this peg.";
        }
    } else {
        // Moving a disc
        const discSize = pegs[selectedPeg][pegs[selectedPeg].length - 1];
        const targetTop = pegs[targetPeg].length > 0 ? pegs[targetPeg][pegs[targetPeg].length - 1] : Infinity;

        if (discSize < targetTop) {
            // Valid move
            pegs[targetPeg].push(pegs[selectedPeg].pop());
            const disc = document.getElementById(`peg${selectedPeg 
