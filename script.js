const streakCountElement = document.getElementById('streakCount');
const lastUpdatedElement = document.getElementById('lastUpdated');
const tickButton = document.getElementById('tickButton');
const dateTimeDisplay = document.getElementById('dateTimeDisplay');

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateString(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('-');
    return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
}

function updateUI(streak, lastDate) {
    streakCountElement.textContent = streak;
    lastUpdatedElement.textContent = `Last updated: ${lastDate || 'Never'}`;
}

function updateDateTimeDisplay() {
    const now = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    dateTimeDisplay.textContent = now.toLocaleString('en-US', options);
}

function initializeStreak() {
    let streakCount = parseInt(localStorage.getItem('streakCount') || '0');
    let lastUpdatedDateString = localStorage.getItem('lastUpdatedDate');
    const todayDateString = getTodayDateString();

    const lastDate = parseDateString(lastUpdatedDateString);
    const today = parseDateString(todayDateString);

    if (lastUpdatedDateString) {
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            tickButton.disabled = true;
            tickButton.textContent = "Streak Updated!";
        } else if (diffDays === 1) {
            tickButton.disabled = false;
            tickButton.textContent = "Update Streak";
        } else {
            streakCount = 0;
            localStorage.setItem('streakCount', streakCount);
            tickButton.disabled = false;
            tickButton.textContent = "Update Streak";
        }
    } else {
        streakCount = 0;
        tickButton.disabled = false;
        tickButton.textContent = "Update Streak";
    }

    updateUI(streakCount, lastUpdatedDateString);
}

tickButton.addEventListener('click', () => {
    let streakCount = parseInt(localStorage.getItem('streakCount') || '0');
    let lastUpdatedDateString = localStorage.getItem('lastUpdatedDate');
    const todayDateString = getTodayDateString();

    const lastDate = parseDateString(lastUpdatedDateString);
    const today = parseDateString(todayDateString);

    if (lastUpdatedDateString && todayDateString === lastUpdatedDateString) return;

    if (lastUpdatedDateString) {
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streakCount++;
        } else {
            streakCount = 1;
        }
    } else {
        streakCount = 1;
    }

    localStorage.setItem('streakCount', streakCount);
    localStorage.setItem('lastUpdatedDate', todayDateString);

    updateUI(streakCount, todayDateString);
    tickButton.disabled = true;
    tickButton.textContent = "Streak Updated!";
});

document.addEventListener('DOMContentLoaded', () => {
    initializeStreak();
    updateDateTimeDisplay();
    setInterval(updateDateTimeDisplay, 1000);
});
