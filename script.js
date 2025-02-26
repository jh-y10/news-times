let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  console.log("uuu", url);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("ddd", newsList);
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      if (!news.description) {
        news.description = "내용없음";
      }
      if (news.description.length > 199) {
        news.description = news.description.substring(0, 199) + "...";
      }
      if (!news.source.name) {
        news.source.name = "No Source";
      }

      return `<div class="row news">
          <div class="col-lg-4">
            <img class="news-img" src="${news.urlToImage}" onerror=this.src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg">
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
            <div>${news.source.name} * ${moment(news.publishedAt).fromNow()}</div>
          </div>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
