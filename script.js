// Game state variables
let pegs = [[], [], []]; // Arrays to store discs on each peg (A, B, C)
let numDiscs; // Number of discs (user input)
let selectedPeg = null; // Currently selected peg (null if none)
let selectedDisc = null; // Currently selected disc element (for highlighting)
let stepCount = 0; // Track number of moves
const colors = ['#ffaa44', '#ff7700', '#ff5500', '#cc4400', '#992200', '#661100', '#330000']; // Warm orange-glow colors

// Starfield particle system variables
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 100;

// Initialize starfield
function initStarfield() {
    if (!canvas || !ctx) {
        console.error('Canvas or context not found!');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    stars = [];
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
    if (!ctx) return;
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
    stepCount = 0;
    document.getElementById('peg1').innerHTML = '';
    document.getElementById('peg2').innerHTML = '';
    document.getElementById('peg3').innerHTML = '';
    document.getElementById('status').textContent = "Game Started!";
    document.getElementById('step-counter').textContent = `Steps: ${stepCount}`;
    document.getElementById('win-animation').innerHTML = '';

    // Initialize discs on peg A (peg1)
    for (let i = numDiscs; i > 0; i--) {
        pegs[0].push(i);
        const disc = document.createElement('div');
        disc.className = 'disc';
        disc.style.width = `${40 + (i - 1) * 20}px`;
        disc.style.height = '20px';
        disc.style.bottom = `${50 + (numDiscs - i) * 22}px`;
        disc.style.borderColor = colors[numDiscs - i];
        disc.dataset.size = i;
        document.getElementById('peg1').appendChild(disc);
    }

    // Add click handlers to pegs
    document.querySelectorAll('.peg').forEach((peg, index) => {
        peg.onclick = () => moveDisc(index);
    });

    // Play background music (Cornfield Chase)
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.2;
    backgroundMusic.play().catch(error => {
        console.error('Failed to play background music:', error);
        document.addEventListener('click', () => backgroundMusic.play(), { once: true });
    });

    // Initialize starfield
    initStarfield();
}

// Handle disc movement
function moveDisc(targetPeg) {
    const status = document.getElementById('status');
    const stepCounter = document.getElementById('step-counter');

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
            pegs[targetPeg].push(pegs[selectedPeg].pop());
            const disc = document.getElementById(`peg${selectedPeg + 1}`).lastChild;
            disc.style.bottom = `${50 + (pegs[targetPeg].length - 1) * 22}px`;

            disc.classList.add('bounce');
            setTimeout(() => {
                disc.classList.remove('bounce');
            }, 500);

            document.getElementById(`peg${targetPeg + 1}`).appendChild(disc);
            stepCount++;
            stepCounter.textContent = `Steps: ${stepCount}`;
            status.textContent = `Moved disc from peg ${selectedPeg + 1} to peg ${targetPeg + 1}.`;

            // Check win condition
            if (pegs[2].length === numDiscs) {
                const minSteps = Math.pow(2, numDiscs) - 1;
                const message = stepCount === minSteps
                    ? "You’ve Conquered the Cosmos! Completed in the minimum steps!"
                    : `You’ve Conquered the Cosmos! Completed in ${stepCount} steps (Minimum: ${minSteps}).`;
                status.textContent = message;
                triggerWormhole();
            }
        } else {
            status.textContent = "Invalid move! A larger disc cannot be placed on a smaller one.";
        }

        document.getElementById(`peg${selectedPeg + 1}`).classList.remove('selected');
        if (selectedDisc) {
            selectedDisc.classList.remove('selected-disc');
            selectedDisc = null;
        }
        selectedPeg = null;
    }
}

// Trigger the wormhole effect when the game is won
function triggerWormhole() {
    const winAnimation = document.getElementById('win-animation');
    const wormhole = document.createElement('div');
    wormhole.className = 'wormhole';
    winAnimation.appendChild(wormhole);
}

// Handle window resize for starfield
window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
