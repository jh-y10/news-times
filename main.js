// const API_KEY = `51eb5f8f74ae4a6589f668b8e2aed355`;
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(`https://jhy-news-times.netlify.app/top-headlines`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("dddd", newsList);
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => `<div class="row news">
          <div class="col-lg-4">
            <img class="news-img-size" src=${news.urlToImage} alt="">
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
            <div>
              ${news.source.name} * ${news.publishedAt}
            </div>
          </div>
        </div>`
  ).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
