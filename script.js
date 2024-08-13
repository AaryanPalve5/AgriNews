const API_KEY = "18a87f17ef6645f69c5f4c5202f8fadb";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("farmers"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.articles) {
            bindData(data.articles);
        } else {
            console.error("No articles found in response", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");
    
    if (!cardsContainer || !newsCardTemplate) {
        console.error("Missing DOM elements for cards or template.");
        return;
    }
    
    cardsContainer.innerHTML = "";
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    if (newsImg) newsImg.src = article.urlToImage;
    if (newsTitle) newsTitle.textContent = article.title; // Use textContent instead of innerHTML for safety
    if (newsDesc) newsDesc.textContent = article.description; // Use textContent instead of innerHTML

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    if (newsSource) newsSource.textContent = `${article.source.name} · ${date}`; // Use textContent instead of innerHTML

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}
