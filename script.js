let newsList = [];
const $inputArea = document.getElementById("input-area");
const $sideMenu = document.querySelector(".side-menu");
const $menus = document.querySelectorAll(".menus button");
const $sideMenuButtonArea = document.querySelectorAll(".side-menu-button-area button");
const $searchInput = document.getElementById("search-input");
$menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByCategory(event)));
$sideMenuButtonArea.forEach((menu) => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let searchSwitch = false;

const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      if (!news.description) {
        news.description = "내용없음";
      }
      if (news.description.length > 199) {
        news.description = news.description.substring(0, 200) + "...";
      }
      if (!news.source.name) {
        news.source.name = "No Source";
      }

      return `<div class="row news">
          <div class="col-lg-4">
            <img class="news-img" src="${
              news.urlToImage
            }" onerror=this.src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg">
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${news.description}</p>
            <div>${news.source.name} * ${moment(
        news.publishedAt
      ).fromNow()}</div>
          </div>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const getNewsByKeyword = async () => {
  const keyword = $searchInput.value;
  $searchInput.value = "";
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

$searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

const openSearch = () => {
  if (!searchSwitch) {
    searchSwitch = true;
    $inputArea.style.display = "inline";
  } else {
    searchSwitch = false;
    $inputArea.style.display = "none";
  }
};

const openSide = () => {
  $sideMenu.style.width = "250px";
};
const closeSide = () => {
  $sideMenu.style.width= "0";
};

getLatestNews();
