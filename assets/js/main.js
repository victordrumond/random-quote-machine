// Global variables //
let currentQuote, currentColor, currentLink, storedQuotes, storedColors, storedLinks, quoteBank;
quoteBank = [];
storedQuotes = [];
storedColors = [];
storedLinks = [];

let colorBank = [
    "EE766D", "3A3335", "F093B2", "F8CD77", "86ACA1", "018FB7", "3C6E71", "707070", "0D5946", "1D4A5D", "6AA08C", "324376", "582E60", "F0A741", "8A050C", "586BA4", "732C2C", "011627"
];

let numberOfQuotes = 1;


// Main function: generates a random quote and a random color to fill the page //
const generateQuote = () => {

    // First we randomly select a quote and its author from the bank of quotes
    let randomQuoteIndex = Math.floor(Math.random() * quoteBank.length);
    $("#text").html("<i class='fas fa-quote-left'></i> " + quoteBank[randomQuoteIndex].text + " <i class='fas fa-quote-right'></i>");
    $("#author").html("- " + quoteBank[randomQuoteIndex].author);

    // Then we randomly select a color from the bank of colors to style the page
    let randomColorIndex = Math.floor(Math.random() * colorBank.length);
    $("#background").css("background-color", "#" + colorBank[randomColorIndex]);

    // We also generate the correct link so user can tweet the quote
    let tweetLink = "https://twitter.com/intent/tweet?hashtags=quotes&text=";
    tweetLink += "%22" + quoteBank[randomQuoteIndex].text.replace(/ /g, "%20");
    tweetLink += "%22%20" + quoteBank[randomQuoteIndex].author.replace(/ /g, "%20");
    $("#tweet-quote").attr("href", tweetLink);

    // And store all the information as the current values 
    currentQuote = {
        text: $("#text").html(),
        author: $("#author").html()
    };
    currentColor = $("#background").css("background-color");
    currentLink = $("#tweet-quote").attr("href")

    // Finally, we push the current information to the storage arrays
    storedQuotes.push(currentQuote);
    storedColors.push(currentColor);
    storedLinks.push(currentLink);
};


// New quote button (plus sign) //
const newQuoteBtn = () => {

    generateQuote();
    numberOfQuotes = storedQuotes.length;
};


// Last/next quote buttons (arrow left & arrow right) //
const lastAndNextQuoteBtns = (event) => {

    if (event.data.action === "last" && numberOfQuotes > 1) {
        numberOfQuotes --;
    };

    if (event.data.action === "next" && numberOfQuotes < storedQuotes.length) {
        numberOfQuotes ++;
    };

    $("#text").html(storedQuotes[numberOfQuotes - 1].text);
    $("#author").html(storedQuotes[numberOfQuotes - 1].author);
    $("#background").css("background-color", storedColors[numberOfQuotes - 1]);
    $("#tweet-quote").attr("href", storedLinks[numberOfQuotes - 1]);
};


// When document is ready //
$(document).ready(function () {
    
    function getQuotesFromAPI() {

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://type.fit/api/quotes",
            "method": "GET"
        };
    
        $.ajax(settings).done(function(response) {

            quoteBank = JSON.parse(response);

            quoteBank.forEach(quote => {
                if (quote.author === null) {
                    quote.author = "Unknown";
                };
            });

            generateQuote();
            $("#new-quote").on("click", newQuoteBtn);
            $("#last-quote").on("click", {action: "last"}, lastAndNextQuoteBtns);
            $("#next-quote").on("click", {action: "next"}, lastAndNextQuoteBtns);
        });
    };

    getQuotesFromAPI();
});