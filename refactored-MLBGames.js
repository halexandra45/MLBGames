function MlbGamesManager(gameWrapper, contentWrapper, gameName, gameHeadline) {
  this.gameWrapper = gameWrapper;
  this.contentWrapper = contentWrapper;
  this.gameName = gameName;
  this.gameHeadline = gameHeadline;
  this.gameElements = [];
  this.games = [];
  this.currentGame = 0;
}

MlbGamesManager.prototype.parseGames = function(games) {
  this.games = games.map((game) => {
    const { name } = game.venue || '';
    const { headline } = game.content.editorial.recap.mlb || ''
    const image = game.content.editorial.recap.mlb.image.cuts[17].src || ''
    return {
      name,
      headline,
      image
    };
  });
}

MlbGamesManager.prototype.generateElements = function() {
  this.gameElements = this.games.map((game, i) => {
    const element = document.createElement('div');
    if (i === this.currentGame) {
      element.classList.add('active');
      this.gameName.innerHTML = game.name;
      this.gameHeadline.innerHTML = game.headline;
    }
    element.onclick = this.onClick.bind(this, element, game);
    const img = document.createElement('img');
    img.src = game.image;
    img.alt = 'Baseball Game';
    element.appendChild(img);
    this.gameWrapper.appendChild(element);
    return element;
  });  
}

MlbGamesManager.prototype.onClick = function(div, game) {
  this.contentWrapper.style.opacity = 0;
  this.gameElements.forEach((element, i) => {    
    if (element === div) {
      element.classList.add('active');
      setTimeout(() => {
        this.gameName.innerHTML = game.name;
        this.gameHeadline.innerHTML = game.headline;
        this.contentWrapper.style.opacity = 1;
      }, 200);
      this.currentGame = i;
    }
    else element.classList.remove('active');
  });
}

MlbGamesManager.prototype.onArrowKeyPress = function(e) {
  e.preventDefault();
  let index = this.currentGame;
  switch (e.keyCode) {
    case 37:
      //left
      if (index == 0) index = this.games.length - 1;
      else index--;
      break;
    case 39:
      //right
      if (index == this.games.length - 1) index = 0;
      else index++;
      break;
    default:
      break;
  }
  this.onClick(this.gameElements[index], this.games[index]);
}

const date = "2019-06-24";
const BASE_URL = `http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap)))%2Cdecisions&date=${date}&sportId=1&fbclid=IwAR13zWLt0ZZxrQXy-6oQMnY847KQUyonpOtoJlxOx1MCMbYKVclqArawLi0`;

fetch(BASE_URL)
  .then(response => response.json())
  .then(data => {
    const { dates: [{ games }]} = data;
    const gameWrapper = document.getElementById('squares');
    const contentWrapper = document.getElementById('squarecontent');
    const gameName = document.createElement('h4');
    const gameHeadline = document.createElement('p');
    contentWrapper.appendChild(gameName);
    contentWrapper.appendChild(gameHeadline);
    const gamesManager = new MlbGamesManager(gameWrapper, contentWrapper, gameName, gameHeadline);
    gamesManager.parseGames(games);
    gamesManager.generateElements();
    document.onkeydown = gamesManager.onArrowKeyPress.bind(gamesManager);
  })
  .catch(e => {
    throw new Error(e.message)
  });