// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Clear existing games
    while (gamesContainer.firstChild) {
        gamesContainer.removeChild(gamesContainer.firstChild);
    }

    // Append new games with a delay to allow for CSS transition
    games.forEach((game, index) => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img" />
            <h3 class="has-text-weight-bold is-size-5">${game.name}</h3>
            <p class="is-italic">${game.description}</p>
            <p><strong>Pledged:</strong> ${game.pledged}</p>
            <p><strong>Backers:</strong> ${game.backers}</p>
        `;

        gamesContainer.appendChild(gameCard);

        // Set a timeout to change opacity for the fade-in effect
        setTimeout(() => {
            gameCard.style.opacity = 1;
            gameCard.style.transform = 'translateY(0)';
        }, 100 * index); // Delay each card slightly more than the previous one
    });
}
// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);


// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContribution = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML =  `${totalContribution.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalPledged = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalPledged.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acc, game) => {
    return acc + 1;
}, 0);

gamesCard.innerHTML =  `${totalGames.toLocaleString()}`;

showAllGames();

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// Function to filter and display games based on search
function searchGames() {
    // Get the search query
    const searchQuery = document.getElementById("game-search-bar").value.toLowerCase();

    // Filter games that include the search query in their name
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchQuery));

    // Clear the current games displayed
    deleteChildElements(gamesContainer);

    // Add the filtered games to the page
    addGamesToPage(filteredGames);

    // Scroll to the games section
    document.getElementById("games-container").scrollIntoView();
}

// Event listener for the "Enter" key in the search bar
document.getElementById("game-search-bar").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action (form submission)
        document.getElementById("search-btn").click(); // Trigger search button click
    }
});

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);
document.getElementById("search-btn").addEventListener("click", searchGames);


// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const unfundedGamesStatement = unfundedGamesCount === 1 ? '1 game remains' : `${unfundedGamesCount} games remain`;
const infoString = `A total of $${totalPledged.toLocaleString('en-US')} has been raised for ${totalGames} games. Currently, ${unfundedGamesStatement} unfunded. We need your help to fund these amazing games!`;


// create a new DOM element containing the template string and append it to the description container
const newParagraph = document.createElement('p');
newParagraph.innerHTML = infoString;

descriptionContainer.appendChild(newParagraph); 


const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement('p');
firstGameElement.innerText = `${firstGame.name}`;
firstGameContainer.appendChild(firstGameElement);

// do the same for the runner up item
const secondGameElement = document.createElement('p');
secondGameElement.innerText = `${secondGame.name}`;
secondGameContainer.appendChild(secondGameElement);