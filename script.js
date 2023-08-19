const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const historyBtn = document.getElementById("historyBtn");
const wordCardsContainer = document.getElementById("wordCardsContainer");
const historyPage = document.getElementById("historyPage");
const historyCardsContainer = document.getElementById("historyCardsContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const backToSearchBtn = document.getElementById("backToSearchBtn");

let searches = JSON.parse(localStorage.getItem("searches")) || [];

searchBtn.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if (word !== "") {
        fetchMeaning(word);
    }
});

historyBtn.addEventListener("click", () => {
    showHistoryPage();
});

backToSearchBtn.addEventListener("click", () => {
    showSearchPage();
});

clearHistoryBtn.addEventListener("click", () => {
    clearSearchHistory();
    showHistoryPage();
});

function fetchMeaning(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "Definition not found";
      clearWordCards();
            displayWordCard(word, meaning);
            addToSearchHistory(word, meaning);
        })
        .catch(error => {
            console.error("Error fetching meaning:", error);
        });
}

function clearWordCards() {
    wordCardsContainer.innerHTML = "";
}

function displayWordCard(word, meaning) {
    const card = document.createElement("div");
    card.classList.add("word-card");
    card.innerHTML = `
        <h3>${word}</h3>
        <p>${meaning}</p>
    `;
    wordCardsContainer.appendChild(card);
}

function addToSearchHistory(word, meaning) {
    searches.push({ word, meaning });
    localStorage.setItem("searches", JSON.stringify(searches));
}

function clearSearchHistory() {
    searches = [];
    localStorage.removeItem("searches");
}

function showSearchPage() {
    mainContent.classList.remove("hidden");
    historyPage.classList.add("hidden");
}

function showHistoryPage() {
    mainContent.classList.add("hidden");
    historyPage.classList.remove("hidden");

    historyCardsContainer.innerHTML = "";
    searches.forEach((search, index) => {
        const historyCard = document.createElement("div");
        historyCard.classList.add("word-card");
        historyCard.innerHTML = `
            <h3>${search.word}</h3>
            <p>${search.meaning}</p>
            <button class="deleteBtn" data-index="${index}">Delete</button>
        `;
        historyCardsContainer.appendChild(historyCard);
    });

    const deleteBtns = document.querySelectorAll(".deleteBtn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", deleteHistoryItem);
    });
}

function deleteHistoryItem(event) {
    const index = event.target.getAttribute("data-index");
    searches.splice(index, 1);
    localStorage.setItem("searches", JSON.stringify(searches));
    showHistoryPage();
}