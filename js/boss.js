(function() {
  if (typeof Mario === 'undefined')
  window.Mario = {};

  var Boss = Mario.Boss = function(pos, sprite) {
    this.dying = false;
    this.health = 20;
    this.maxHealth = 40;
    this.shootTimer = 5; // 5 second delay before first shot
    Mario.Entity.call(this, {
      pos: pos,
      sprite: sprite,
      hitbox: [0,0,32,32]
    });
    this.sprite.pos = [656, 0];
    this.sprite.size = [32, 32];
    this.vel[0] = -0.5;
    this.idx = level.enemies.length;
  };

  Boss.prototype.render = function(ctx, vX, vY) {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  };

  Boss.prototype.update = function(dt, vX) {
    if (this.pos[0] - vX > 336) { //if we're too far away, do nothing.
      return;
    } else if (this.pos[0] - vX < -32) {
      delete level.enemies[this.idx];
    }

    if (this.dying) {
      this.dying -= 1;
      if (!this.dying) {
        delete level.enemies[this.idx];
      }
    }
    
    // Fly towards player in both X and Y directions
    if (this.pos[0] > player.pos[0]) {
      this.vel[0] = -0.25; // Move left towards player
    } else {
      this.vel[0] = 0.25; // Move right towards player
    }
    
    if (this.pos[1] > player.pos[1]) {
      this.vel[1] = -0.25; // Move up towards player
    } else {
      this.vel[1] = 0.25; // Move down towards player
    }
    
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    
    // Shooting logic
    this.shootTimer -= dt;
    if (this.shootTimer <= 0 && Math.abs(this.pos[0] - player.pos[0]) < 200) {
      this.shoot();
      this.shootTimer = Math.random() * 3 + 2; // Reset timer: 2-5 seconds
    }
    
    this.sprite.update(dt);
  };

  Boss.prototype.updateSprite = function() {
    // Cycle through 4 Bowser costumes based on health (20 total)
    // Health 20-16: sprite at 656, 15-11: 688, 10-6: 720, 5-1: 752
    if (this.health >= 30) {
      this.sprite.pos = [656, 0];
    } else if (this.health >= 20) {
      this.sprite.pos = [688, 0];
    } else if (this.health >= 10) {
      this.sprite.pos = [720, 0];
    } else {
      this.sprite.pos = [752, 0];
    }
  };

  Boss.prototype.collideWall = function() {
    this.vel[0] = -this.vel[0];
  };

  Boss.prototype.checkCollisions = function() {
    if (this.flipping) {
      return;
    }

    var h = this.pos[1] % 16 === 0 ? 1 : 2;
    var w = this.pos[0] % 16 === 0 ? 1 : 2;

    var baseX = Math.floor(this.pos[0] / 16);
    var baseY = Math.floor(this.pos[1] / 16);

    if (baseY + h > 15) {
      delete level.enemies[this.idx];
      return;
    }

    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        if (level.statics[baseY + i][baseX + j]) {
          level.statics[baseY + i][baseX + j].isCollideWith(this);
        }
        if (level.blocks[baseY + i][baseX + j]) {
          level.blocks[baseY + i][baseX + j].isCollideWith(this);
        }
      }
    }
    var that = this;
    level.enemies.forEach(function(enemy){
      if (enemy === that) { //don't check collisions with ourselves.
        return;
      } else if (enemy.pos[0] - vX > 336){ //stop checking once we get to far away dudes.
        return;
      } else {
        that.isCollideWith(enemy);
      }
    });
    
    // Check collisions with fireballs
    fireballs.forEach(function(fireball) {
      that.isCollideWith(fireball);
    });
    
    this.isCollideWith(player);
  };

  Boss.prototype.isCollideWith = function(ent) {
    if (ent instanceof Mario.Player && (this.dying || ent.invincibility)) {
      return;
    }

    //the first two elements of the hitbox array are an offset, so let's do this now.
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [ent.pos[0] + ent.hitbox[0], ent.pos[1] + ent.hitbox[1]];

    //if the hitboxes actually overlap
    if (!(hpos1[0] > hpos2[0]+ent.hitbox[2] || (hpos1[0]+this.hitbox[2] < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1]+ent.hitbox[3] || (hpos1[1]+this.hitbox[3] < hpos2[1]))) {
        if (ent instanceof Mario.Fireball && ent.owner === 'player') {
          // Fireball collision handled by bump() method called from fireball.js
          // Don't handle damage here to avoid double damage
          return;
        } else if (ent instanceof Mario.Player) { //if we hit the player
          if (ent.vel[1] > 0) { //player stomps boss
            this.health -= 1;
            this.updateSprite();
            player.bounce = true;
            if (this.health <= 0) {
              this.stomp();
            }
          } else if (ent.starTime) {
            this.bump();
          } else { //or the player gets hit
            ent.damage();
          }
        } else {
          this.collideWall();
        }
      }
    }
  };

  Boss.prototype.stomp = function() {
    sounds.stomp.play();
    player.bounce = true;
    delete level.enemies[this.idx];
  };

  Boss.prototype.shoot = function() {
    var direction = this.pos[0] > player.pos[0]; // true = shoot left, false = shoot right
    var fb = new Mario.Fireball([this.pos[0] + 8, this.pos[1]], 'enemy');
    fb.spawn(direction);
  };

  Boss.prototype.bump = function() {
    // Boss takes damage from fireball
    this.health -= 1;
    this.updateSprite();
    if (this.health <= 0) {
      this.stomp();
    }
  };
})();
