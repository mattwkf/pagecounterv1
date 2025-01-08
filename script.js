const progressBarFill = document.getElementById('progressBarFill');
const rankContainer = document.getElementById('rankContainer');
const rankImage = document.getElementById('rankImage');
const rankLevel = document.getElementById('rankLevel');
const rankSetSelector = document.getElementById('rankSetSelector');
const rankToggle = document.getElementById('rankToggle');

// Different sets of rank names
const rankSets = {
    elemental: [
        "Stone",
        "Brass",
        "Tin",
        "Bronze",
        "Silver",
        "Gold",
        "Sapphire",
        "Emerald"
    ],
    trophys: [
        "Wood",
        "Stone",
        "Glass",
        "Bronze",
        "Silver",
        "Gold",
        "Gold Ruby",
        "Gold Diamond"
    ]
};

// Map for rank images
const elementalRankImages = [
    "rankset1/rank1.png",
    "rankset1/rank2.png",
    "rankset1/rank3.png",
    "rankset1/rank4.png",
    "rankset1/rank5.png",
    "rankset1/rank6.png",
    "rankset1/rank7.png",
    "rankset1/rank8.png"
];

const trophyRankImages = [
    "rankset2/lvl1_wood.png",
    "rankset2/lvl2_stone.png",
    "rankset2/lvl3_glass.png",
    "rankset2/lvl4_bronze.png",
    "rankset2/lvl5_silver.png",
    "rankset2/lvl6_gold.png",
    "rankset2/lvl7_goldruby.png",
    "rankset2/lvl8_golddiamond.png"
];

// Load rank toggle and selected set from local storage
const storedRankToggle = localStorage.getItem('rankToggle');
const storedRankSet = localStorage.getItem('rankSet') || 'elemental';

// Set the initial state of the rank toggle and selector
if (storedRankToggle === null) {
    rankToggle.checked = false;
    rankSetSelector.parentElement.style.display = 'none';
    rankContainer.style.display = 'none';
} else {
    rankToggle.checked = storedRankToggle === 'on';
    if (rankToggle.checked) {
        rankSetSelector.parentElement.style.display = 'block';
    } else {
        rankSetSelector.parentElement.style.display = 'none';
        rankContainer.style.display = 'none';
    }
}
rankSetSelector.value = storedRankSet;

function getCurrentRankSet() {
    const selectedRankSet = rankSets[rankSetSelector.value];
    return selectedRankSet || rankSets.elemental;
}

function getRankImagePath(rankLevelNum) {
    if (rankSetSelector.value === 'elemental' && rankLevelNum <= elementalRankImages.length) {
        return elementalRankImages[rankLevelNum - 1];
    } else if (rankSetSelector.value === 'trophys' && rankLevelNum <= trophyRankImages.length) {
        return trophyRankImages[rankLevelNum - 1];
    }
    return `rank${rankLevelNum}.png`; // Fallback
}

function updateProgressBar(startingPage, currentPage, totalPages) {
    const progress = Math.min(((currentPage - startingPage) / (totalPages - startingPage)) * 100, 100);
    let currentProgress = parseFloat(progressBarFill.style.width) || 0;

    return new Promise((resolve) => {
        const step = (progress - currentProgress) / 50;
        const interval = setInterval(() => {
            if ((step > 0 && currentProgress >= progress) || (step < 0 && currentProgress <= progress)) {
                clearInterval(interval);
                progressBarFill.style.width = `${progress.toFixed(1)}%`;
                progressBarFill.innerText = `${progress.toFixed(1)}%`;
                resolve(progress);
            } else {
                currentProgress += step;
                progressBarFill.style.width = `${currentProgress.toFixed(1)}%`;
                progressBarFill.innerText = `${currentProgress.toFixed(1)}%`;
            }
        }, 20);
    });
}

function updateRank(progress) {
    const currentRankSet = getCurrentRankSet();
    const totalRanks = currentRankSet.length; // totalRanks = 8
    const rankLevelNum = Math.min(Math.ceil(progress / (100 / totalRanks)), totalRanks); // Limit rankLevelNum to max 8
    const ranksLeft = totalRanks - rankLevelNum;

    console.log(`Progress: ${progress}%`);
    console.log(`Rank Level Number: ${rankLevelNum}`);

    if (rankToggle.checked && rankLevelNum > 0 && rankLevelNum <= totalRanks) {
        const rankImagePath = getRankImagePath(rankLevelNum);
        rankImage.src = rankImagePath;
        rankLevel.innerText = `${currentRankSet[rankLevelNum - 1]} - ${rankLevelNum}/${totalRanks} ranks unlocked, ${ranksLeft} rank(s) to go!`;
        rankContainer.style.display = "block";
    } else {
        rankContainer.style.display = "none";
    }

    // Update the rank level bar
    updateRankLevelBar(rankLevelNum);
}

function updateRankLevelBar(rankLevelNum) {
    const segments = document.querySelectorAll('#rankLevelBar .rank-level-segment');

    segments.forEach((segment, index) => {
        // Activate only segments up to rankLevelNum
        if (index < rankLevelNum) {
            segment.classList.add('active');
        } else {
            segment.classList.remove('active');
        }
    });
}

  

async function calculatePagesLeft() {
    const startingPage = parseInt(document.getElementById('startingPage').value);
    const currentPage = parseInt(document.getElementById('currentPage').value);
    const totalPages = parseInt(document.getElementById('totalPages').value);

    if (
        isNaN(startingPage) || startingPage < 0 ||
        isNaN(currentPage) || currentPage < startingPage ||
        isNaN(totalPages) || totalPages < currentPage
    ) {
        document.getElementById('result').innerText = "Please enter valid page numbers.";
        return;
    }

    localStorage.setItem('startingPage', startingPage);
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('totalPages', totalPages);

    const pagesLeft = totalPages - currentPage;
    const pagesRead = currentPage - startingPage;

    document.getElementById('result').innerHTML = 
    `<span style="color: white;">You have read ${pagesRead} page(s)</span> 
     and 
     <span style="color: yellow;">have ${pagesLeft} page(s) left to read.</span>`;

    const progress = await updateProgressBar(startingPage, currentPage, totalPages);
    updateRank(progress);
}

rankToggle.addEventListener('change', () => {
    localStorage.setItem('rankToggle', rankToggle.checked ? 'on' : 'off');
    if (rankToggle.checked) {
        rankSetSelector.parentElement.style.display = 'block';
        const startingPage = parseInt(document.getElementById('startingPage').value);
        const currentPage = parseInt(document.getElementById('currentPage').value);
        const totalPages = parseInt(document.getElementById('totalPages').value);
        const progress = ((currentPage - startingPage) / (totalPages - startingPage)) * 100;
        updateRank(progress);
    } else {
        rankSetSelector.parentElement.style.display = 'none';
        rankContainer.style.display = 'none';
    }
});

rankSetSelector.addEventListener('change', () => {
    localStorage.setItem('rankSet', rankSetSelector.value);
    const startingPage = parseInt(document.getElementById('startingPage').value);
    const currentPage = parseInt(document.getElementById('currentPage').value);
    const totalPages = parseInt(document.getElementById('totalPages').value);
    const progress = ((currentPage - startingPage) / (totalPages - startingPage)) * 100;
    updateRank(progress);
});

const storedStartingPage = parseInt(localStorage.getItem('startingPage'));
const storedCurrentPage = parseInt(localStorage.getItem('currentPage'));
const storedTotalPages = parseInt(localStorage.getItem('totalPages'));

if (!isNaN(storedStartingPage) && !isNaN(storedCurrentPage) && !isNaN(storedTotalPages)) {
    updateProgressBar(storedStartingPage, storedCurrentPage, storedTotalPages).then(updateRank);
}

if (!isNaN(storedStartingPage)) {
    document.getElementById('startingPage').value = storedStartingPage;
}
if (!isNaN(storedTotalPages)) {
    document.getElementById('totalPages').value = storedTotalPages;
}
if (!isNaN(storedCurrentPage)) {
    document.getElementById('currentPage').value = storedCurrentPage;
}

document.getElementById('loadGameButton').addEventListener('click', () => {
    const gamePopup = document.getElementById('gamePopup');
    const gameFrame = document.getElementById('gameFrame');
    const reminderOverlay = document.getElementById('reminderOverlay');

    // Set the game URL
    gameFrame.src = "game.html";

    // Show the popup
    gamePopup.style.display = "flex";

    // Variables to track timeout and interval
    let reminderTimeout;
    let reminderInterval;

    // Function to show the reminder overlay
    const showReminder = () => {
        reminderOverlay.style.display = "flex"; // Show the overlay
        setTimeout(() => {
            reminderOverlay.style.display = "none"; // Hide after 10 seconds
        }, 10000);
    };

    // Add event listener to the iframe for when it has fully loaded
    gameFrame.onload = () => {
        console.log("Game frame loaded!");

        // Start reminder logic after 1 minute of the iframe being loaded
        reminderTimeout = setTimeout(() => {
            console.log("Reminder timeout triggered!");
            showReminder();
            reminderInterval = setInterval(() => {
                console.log("Reminder interval triggered!");
                showReminder();
            }, 60000);
        }, 60000);
    };

    // Stop reminders when exiting
    document.getElementById('exitGameButton').addEventListener('click', () => {
        // Clear timeout and interval
        clearTimeout(reminderTimeout);
        clearInterval(reminderInterval);

        // Hide game popup
        gamePopup.style.display = "none";

        // Clear the iframe source
        gameFrame.src = "about:blank";

        // Ensure the overlay is hidden
        reminderOverlay.style.display = "none";

        console.log("Game exited and reminders stopped.");
    });
});




