var oneonetunnel = Mario.oneonetunnel = function() {
  level = new Mario.Level({
    playerPos: [40,16],
    loader: Mario.oneone,
    background: "#000000",
    scrolling: false,
    coinSprite: function() {
      return new Mario.Sprite('sprites/items.png', [0,96],[16,16], 6,[0,0,0,0,1,2,1]);
    },
    floorSprite:  new Mario.Sprite('sprites/tiles.png', [0,32],[16,16],0),
    wallSprite: new Mario.Sprite('sprites/tiles.png', [32, 32],[16,16],0),
    brickSprite: new Mario.Sprite('sprites/tiles.png', [16, 0], [16,16], 0),
    brickBounceSprite: new Mario.Sprite('sprites/tiles.png',[32,0],[16,16],0),
    ublockSprite: new Mario.Sprite('sprites/tiles.png', [48, 0], [16,16],0),
    pipeLMidSprite: new Mario.Sprite('sprites/tiles.png', [0, 144], [16,16], 0),
    pipeRMidSprite: new Mario.Sprite('sprites/tiles.png', [16, 144], [16,16], 0),
    pipeLEndSprite: new Mario.Sprite('sprites/tiles.png', [0, 128], [16,16], 0),
    pipeREndSprite: new Mario.Sprite('sprites/tiles.png', [16, 128], [16,16], 0),
    pipeUpMid: new Mario.Sprite('sprites/tiles.png', [0, 144], [32,16], 0),
    pipeSideMid: new Mario.Sprite('sprites/tiles.png', [48, 128], [16,32], 0),
    pipeLeft: new Mario.Sprite('sprites/tiles.png', [32, 128], [16,32], 0),
    pipeTop: new Mario.Sprite('sprites/tiles.png', [0, 128], [32,16], 0),

    LPipeSprites:[
      new Mario.Sprite('sprites/tiles.png', [32,128],[16,16],0),
      new Mario.Sprite('sprites/tiles.png', [32,144],[16,16],0),
      new Mario.Sprite('sprites/tiles.png', [48,128],[16,16],0),
      new Mario.Sprite('sprites/tiles.png', [48,144],[16,16],0),
      new Mario.Sprite('sprites/tiles.png', [64,128],[16,16],0),
      new Mario.Sprite('sprites/tiles.png', [64,144],[16,16],0),
    ]

  });

  player.pos[0] = level.playerPos[0];
  player.pos[1] = level.playerPos[1];
  vX = 0;
  
  // Floor with death pit in middle (blocks 7-8 removed)
  level.putFloor(0, 7);
  level.putFloor(9, 16);
  // Gap at blocks 7-8 for death pit
  
  // Ceiling to prevent going off top
  for (var i = 1; i < 15; i++) {
    level.statics[0][i] = new Mario.Floor([16*i, 0], level.wallSprite);
    level.statics[1][i] = new Mario.Floor([16*i, 16], level.wallSprite);
  }
  
  // Side walls
  level.putWall(0,13,11);
  level.putWall(15,13,11);
  
  // Grid platform layout - 3 levels of platforms for vertical movement
  // Bottom level platforms (y=10)
  level.statics[10][2] = new Mario.Floor([16*2, 16*10], level.floorSprite);
  level.statics[10][3] = new Mario.Floor([16*3, 16*10], level.floorSprite);
  level.statics[10][6] = new Mario.Floor([16*6, 16*10], level.floorSprite);
  level.statics[10][7] = new Mario.Floor([16*7, 16*10], level.floorSprite);
  level.statics[10][10] = new Mario.Floor([16*10, 16*10], level.floorSprite);
  level.statics[10][11] = new Mario.Floor([16*11, 16*10], level.floorSprite);
  
  // Middle level platforms (y=7)
  level.statics[7][3] = new Mario.Floor([16*3, 16*7], level.floorSprite);
  level.statics[7][4] = new Mario.Floor([16*4, 16*7], level.floorSprite);
  level.statics[7][7] = new Mario.Floor([16*7, 16*7], level.floorSprite);
  level.statics[7][8] = new Mario.Floor([16*8, 16*7], level.floorSprite);
  level.statics[7][11] = new Mario.Floor([16*11, 16*7], level.floorSprite);
  level.statics[7][12] = new Mario.Floor([16*12, 16*7], level.floorSprite);
  
  // Top level platforms (y=4)
  level.statics[4][2] = new Mario.Floor([16*2, 16*4], level.floorSprite);
  level.statics[4][3] = new Mario.Floor([16*3, 16*4], level.floorSprite);
  level.statics[4][6] = new Mario.Floor([16*6, 16*4], level.floorSprite);
  level.statics[4][7] = new Mario.Floor([16*7, 16*4], level.floorSprite);
  level.statics[4][10] = new Mario.Floor([16*10, 16*4], level.floorSprite);
  level.statics[4][11] = new Mario.Floor([16*11, 16*4], level.floorSprite);

  // Hidden miniboss - Bowser boss in top right
  var bossEnemy = new Mario.Boss([16*14, 16*2], new Mario.Sprite('sprites/enemy.png', [656, 0], [32,32], 0, [0]));
  level.enemies.push(bossEnemy);
  level.bossEnemy = bossEnemy; // Store reference for exit pipe check

  // Exit pipe - blocked until boss is defeated
  level.putRealPipe(13,11,3,"RIGHT", function() {
    // Check if boss is still alive
    if (level.bossEnemy && level.enemies.indexOf(level.bossEnemy) !== -1) {
      // Boss still alive - play error sound and don't allow exit
      if (sounds.bump) sounds.bump.play();
      return;
    }
    // Boss defeated - allow exit
    Mario.oneone.call();
    player.pos = [2616, 177]
    player.pipe("UP", function() {;});
  });

  music.overworld.pause();
  music.underground.currentTime = 0;
  music.underground.play();
};
