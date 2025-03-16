let pegs = [[], [], []]; // Array of discs on each peg
let numDiscs;

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

    // Initialize discs on peg1
    for (let i = numDiscs; i > 0; i--) {
        pegs[0].push(i);
        const disc = document.createElement('div');
        disc.className = 'disc';
        disc.style.width = `${i * 20}px`;
        disc.style.bottom = `${(numDiscs - i) * 22}px`;
        disc.dataset.size = i;
        document.getElementById('peg1').appendChild(disc);
    }

    // Add click handlers
    document.querySelectorAll('.peg').forEach((peg, index) => {
        peg.onclick = () => moveDisc(index);
    });
}

let selectedPeg = null;

function moveDisc(targetPeg) {
    if (selectedPeg === null) {
        if (pegs[targetPeg].length > 0) {
            selectedPeg = targetPeg;
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
        } else {
            alert("Invalid move! A larger disc cannot be placed on a smaller one.");
        }
        selectedPeg = null;
    }
}