let quotes = [
    //motivation
    { text: "Do hard things.", category: "Motivation" },
    {text:"You are never too old to set another goal or to dream a new dream.", category:"Motivation"},
    { text:"You don't have to be great to start, but you have to start to be great.", category:"Motivation" },
    //inspirational
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", category: "Inspiration" },
    //funny
    { text: "What is the computer's favorite snack to eat?... Microchips.", category: "Funny" },
  ];
  
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = `
      <p> "${randomQuote.text}" </p>
      <p> Category: ${randomQuote.category} </p>
    `;
  }
  
  function createAddQuoteForm() {
    const addQuoteForm = document.createElement("div");
    addQuoteForm.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(addQuoteForm);
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    showRandomQuote();
    document.getElementById("newQuoteText").value = ""; 
    document.getElementById("newQuoteCategory").value = "";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote();
    createAddQuoteForm();
  });