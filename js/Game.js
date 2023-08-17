class Game {
  constructor() {
    this.resetTitle = createElement("h2"); // titulo
    this.resetButton = createButton("");// criação de botão

    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");// placar 1
    this.leader2 = createElement("h2");// placar 2
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }
//Crie handleResetButton() para reiniciar todos os campos do banco de dados e
//recarregar o jogo.
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
//// definindo a posição das ferramentas na tela .
    //C39
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements(); // chamando
    this.handleResetButton();// chamando

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();// chamando

     //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {// atualização do jogador nome e placar
    this.resetButton.mousePressed(() => {// O botão de reinicialização funcionará com o pressionamento do mouse


//Usaremos .set() para substituir os valores dos campos do
//banco de dados com 0 para carsatEnd, playerCount e
//gameState. Também vamos esvaziar as informações do
//jogador.

      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}// contem a informação do jogador criada no banco de dados, devido isso deve-se criar mais propriedades para a classe player
      });
      window.location.reload();//Por último, recarregue a janela usando a função
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      //A primeira condição é verificar se o seu primeiro jogador
//tem classificação 1. Vamos definir a classificação, o nome
//e a pontuação do jogador 1 para a variável leader1.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
//E o leader2 terá as informações do jogador 2. Aqui,
//&emsp é uma tag HTML que é usada para adicionar 4
//espaços antes do texto.
      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }
//Mas, se o jogador 2 tiver classificação um, precisamos
//definir o jogador 2 como líder 1.


    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;


      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }
//Por fim, passaremos as variáveis leader1 e leader2 em
//HTML para que possam ser exibidas na tela.
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

//Adicione esses controles no método
//handleplayerControls(), em game.js.
//Para mover para a esquerda, usaremos a função
//keyIsDown() e ela irá buscar a LEFT_ARROW (seta
//esquerda) pressionada pelo usuário

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();// atualizar a posição do jogador no banco de dados usando
      //o método player.update().
    }
//a condição usando o operador &&, e a
//posição x do jogador pode ser dada maior que width/3
//-50.

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }
}
