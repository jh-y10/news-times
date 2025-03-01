let newsList = [];
const $inputArea = document.getElementById("input-area");
const $sideMenu = document.querySelector(".side-menu");
const $menus = document.querySelectorAll(".menus button");
const $sideMenuButtonArea = document.querySelectorAll(
  ".side-menu-button-area button"
);
const $searchInput = document.getElementById("search-input");
$menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
$sideMenuButtonArea.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
let searchSwitch = false;
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No Result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  await getNews();
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  const lastPage =
    pageGroup * groupSize > totalPages ? totalPages : pageGroup * groupSize;
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let paginationHTML = ``;
  if (page === firstPage) {
    paginationHTML = `<li class="page-item disabled">
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
  } else {
    paginationHTML = `<li class="page-item" onclick="moveToPage(${page - 1})">
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})">
        <a class="page-link">
          ${i}
        </a>
      </li>`;
    if (i === lastPage) {
      if (page === lastPage) {
        paginationHTML += `<li class="page-item disabled">
      <a class="page-link" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
      } else {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${
          page + 1
        })">
        <a class="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
      }
    }
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;

  // <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Previous">
  //         <span aria-hidden="true">&laquo;</span>
  //       </a>
  //     </li>
  //     <li class="page-item">
  //       <a class="page-link" href="#">
  //         1
  //       </a>
  //     </li>
  //     <li class="page-item">
  //       <a class="page-link" href="#">
  //         2
  //       </a>
  //     </li>
  //     <li class="page-item">
  //       <a class="page-link" href="#">
  //         3
  //       </a>
  //     </li>
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Next">
  //         <span aria-hidden="true">&raquo;</span>
  //       </a>
  //     </li>
  //   </ul>
  // </nav>;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  page = 1;
  await getNews();
};

const getNewsByKeyword = async () => {
  const keyword = $searchInput.value;
  $searchInput.value = "";
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );
  page = 1;
  await getNews();
};

$searchInput.addEventListener("keydown", (event) => {
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
  $sideMenu.style.width = "0";
};

getLatestNews();
