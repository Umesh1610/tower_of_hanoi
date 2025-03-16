let pegs = [[], [], []];
let numDiscs;
let selectedPeg = null;
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];

function startGame() {
    numDiscs = parseInt(document.getElementById('discs').value);
    if (numDiscs < 3 || numDiscs > 8) {
        alert("Please enter a number between 3 and 8.");
        return;
    }

    // Reset game
    pegs = [[], [], []];
    document.getElementById('peg1').innerHTML = '';
    document.getElementById('peg2').innerHTML = '';
    document.getElementById('peg3').innerHTML = '';
    document.getElementById('status').textContent = "Game Started!";

    // Initialize discs on peg1
    for (let i = numDiscs; i > 0; i--) {
        pegs[0].push(i);
        const disc = document.createElement('div');
        disc.className = 'disc';
        disc.style.width = `${i * 20}px`;
        disc.style.bottom = `${(numDiscs - i) * 22}px`;
        disc.style.backgroundColor = colors[numDiscs - i];
        disc.dataset.size = i;
        document.getElementById('peg1').appendChild(disc);
    }

    // Add click handlers
    document.querySelectorAll('.peg').forEach((peg, index) => {
        peg.onclick = () => moveDisc(index);
    });
}

function moveDisc(targetPeg) {
    const status = document.getElementById('status');
    const moveSound = document.getElementById('moveSound');

    if (selectedPeg === null) {
        if (pegs[targetPeg].length > 0) {
            selectedPeg = targetPeg;
            document.getElementById(`peg${targetPeg + 1}`).classList.add('selected');
            status.textContent = `Selected peg ${targetPeg + 1}. Choose where to move the disc.`;
        }
    } else {
        const discSize = pegs[selectedPeg][pegs[selectedPeg].length - 1];
        const targetTop = pegs[targetPeg].length > 0 ? pegs[targetPeg][pegs[targetPeg].length - 1] : Infinity;

        if (discSize < targetTop) {
            // Move disc
            pegs[targetPeg].push(pegs[selectedPeg].pop());
            const disc = document.getElementById(`peg${selectedPeg + 1}`).lastChild;
            disc.style.bottom = `${pegs[targetPeg].length * 22 - 22}px`;
            document.getElementById(`peg${targetPeg + 1}`).appendChild(disc);
            
            // Add bounce animation
            disc.classList.add('bounce');
            setTimeout(() => disc.classList.remove('bounce'), 500); // Remove after animation

            // Play sound
            moveSound.currentTime = 0; // Reset sound to start
            moveSound.play();

            status.textContent = `Moved disc from peg ${selectedPeg + 1} to peg ${targetPeg + 1}.`;

            // Check win condition
            if (pegs[2].length === numDiscs) {
                status.textContent = "Hurray! You Won!";
                document.body.style.background = "#dff9fb";
            }
        } else {
            status.textContent = "Invalid move! A larger disc cannot be placed on a smaller one.";
        }
        document.getElementById(`peg${selectedPeg + 1}`).classList.remove('selected');
        selectedPeg = null;
    }
}
