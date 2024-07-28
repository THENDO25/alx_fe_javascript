let quotes = [
    { text: "Do hard things.", category: "Motivation", id: 1 },
    { text: "You are never too old to set another goal or to dream a new dream.", category: "Motivation", id: 2 },
    { text: "You don't have to be great to start, but you have to start to be great.", category: "Motivation", id: 3 },
    { text: "The only way to do great work is to love what you do.", category: "Inspiration", id: 4 },
    { text: "Life is 10% what happens to you and 90% how you react to it.", category: "Inspiration", id: 5 },
    { text: "What is the computer's favorite snack to eat?... Microchips.", category: "Funny", id: 6 }
];

const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const quoteApp = (() => {
  async function syncQuotes(serverQuotes) {
    // function implementation
  }
  return { syncQuotes };
})();

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const data = await response.json();
        return data.map(item => ({ id: item.id, text: item.title, category: "Motivation" })); 
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

async function syncLocalQuotes(serverQuotes) {
    const localQuotes = quotes;
    const serverQuotesMap = new Map(serverQuotes.map(q => [q.id, q]));

    localQuotes.forEach(quote => {
        if (serverQuotesMap.has(quote.id)) {
            const serverQuote = serverQuotesMap.get(quote.id);
            Object.assign(quote, serverQuote);
        } else {
            quotes.push(quote);
        }
    });

    saveQuotes();
    showNotification("Quotes synced with server.");
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = Saved;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000); 
}
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


async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory, id: Date.now() };

       
        quotes.push(newQuote);
        await postQuoteToServer(newQuote);
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
    fileReader.onload = async function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = [...quotes, ...importedQuotes];
        saveQuotes();
        updateCategoryFilter();
        showNotification('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All</option>';

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


function startPeriodicSync() {
    setInterval(async () => {
        const serverQuotes = await fetchQuotesFromServer();
        if (serverQuotes.length > 0) {
            syncLocalQuotes(serverQuotes);
        }
    }, 60000); 
}


document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    loadFilter();
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
    startPeriodicSync();

    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("exportJson").addEventListener("click", exportToJson);
    document.getElementById("importJson").addEventListener("change", importFromJsonFile);
    document.getElementById("importButton").addEventListener("click", () => document.getElementById("importJson").click());
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
});
