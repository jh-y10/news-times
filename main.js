// const API_KEY = `51eb5f8f74ae4a6589f668b8e2aed355`;
let news = [];
 const getLatestNews = async () => {
  const url = new URL(`https://jhy-news-times.netlify.app/top-headlines`);
  console.log("uuu", url);
  const response = await fetch(url);
  console.log("rrr", response);
  const data = await response.json();
  news = data.articles;
  console.log("ddd",data); 
};

getLatestNews();