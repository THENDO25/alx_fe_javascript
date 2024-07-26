let quotes = [
    // Motivation
    { text: "Do hard things.", category: "Motivation" },
    { text: "You are never too old to set another goal or to dream a new dream.", category: "Motivation" },
    { text: "You don't have to be great to start, but you have to start to be great.", category: "Motivation" },
    // Inspirational
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", category: "Inspiration" },
    // Funny
    { text: "What is the computer's favorite snack to eat?... Microchips.", category: "Funny" },
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p>Category: ${randomQuote.category}</p>
    `;
}

function createAddQuoteForm() {
    const addQuoteForm = document.getElementById("addQuoteForm");
    addQuoteForm.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
}

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        updateCategoryFilter();
        showRandomQuote();
    }

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

function exportToJson() {
    const json = JSON.stringify(quotes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = [...quotes, ...importedQuotes];
        saveQuotes();
        updateCategoryFilter();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All</option>'; // Add "All" option

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    showRandomQuote(filteredQuotes);
}

function saveFilter() {
    localStorage.setItem("categoryFilter", document.getElementById("categoryFilter").value);
}

function loadFilter() {
    const savedFilter = localStorage.getItem("categoryFilter");
    if (savedFilter) {
        document.getElementById("categoryFilter").value = savedFilter;
        filterQuotes();
    }
}

function updateCategoryFilter() {
    populateCategories();
    saveFilter();
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    loadFilter();
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();

    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("exportJson").addEventListener("click", exportToJson);
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
    document.getElementById("importJson").addEventListener("change", importFromJsonFile);
});