ig.module(
	'game.entities.spike'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySpike = ig.Entity.extend({
	size: {x: 32, y: 64},
	offset: {x: 16, y: 0},
	maxVel: {x: 400, y: 1600},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 100,
		
	speed: 42,
	flip: false,
	targetArea: null,
	target: null,
	drawBox: false,
	bJumping: false,
	bPrepareToJump: false,
	bAttacking: false,
	bAttackFinished: false,
	jumpVelocity: -156,
	attackPrepTime: 1.0,
	attackTime: 0.5,
	
	animSheet: new ig.AnimationSheet( 'media/SmallEnemy.png', 64, 64 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1.0, [11] );
		this.addAnim( 'run', 0.12, [1,2,3,4,5,6,7,8,9,10]);
		this.addAnim( 'jump', 1.0, [0] );
		this.addAnim( 'attack', 1.0, [12] );		
		
		this.zIndex += 10;
		
		//Prep timer
		this.prepTimer = new ig.Timer(0.0);
		
		//Fire timer
		this.primaryAttackTimer = new ig.Timer(0.0);
		
		if (ig.game.spawnEntity)
		{
			this.targetArea = ig.game.spawnEntity( EntityTargetArea, this.pos.x, this.pos.y, {} );
			
			this.damageFX = ig.game.spawnEntity( EntityDamageEffect, this.pos.x, this.pos.y, {} );
			this.damageFX.zIndex = this.zIndex + 2;
			
			//Spawn weapon
			this.weapon = ig.game.spawnEntity( EntityPlasmaCannonEnemy, this.pos.x, this.pos.y, {} );
			this.weapon.zIndex = this.zIndex + 1;
			ig.game.sortEntitiesDeferred();						
		}
	},
	
	
	update: function() {				
		var xdir = this.flip ? -1 : 1;
		
		//Jumping calculations
		var xCheck = this.size.x + this.size.x/2
		
		if (this.flip)
		{
			xCheck = this.size.x/2 * -1
		}
		
		var collisionTileAbove = ig.game.collisionMap.getTile(this.pos.x + xCheck, this.pos.y + this.size.y - 1)		
		var collisionTileBlock = ig.game.collisionMap.getTile(this.pos.x + xCheck, this.pos.y + this.size.y - ig.game.collisionMap.tilesize * 2 - 8)
				
		//Jump!
		if (!this.bJumping && collisionTileAbove && !collisionTileBlock)
		{			
			this.bPrepareToJump = true;
			
			this.accel.x = 36 * xdir
			
			var self = this;
			
			setTimeout(function(){								
								//self.accel.x *= 1.40
								self.vel.y = self.jumpVelocity;
								self.bPrepareToJump = false;
								self.bJumping = true;
							}, 50);
		}
		
		if (this.vel.y == 0)
		{
			if (!this.bPrepareToJump)
				this.accel.x = 0;
			
			this.bJumping = false;			
		}				
				
		// set the current animation, based on the player's speed
		if( this.vel.y < 0 ) {
			this.currentAnim = this.anims.jump;
		}
		else if( this.vel.y > 0 ) {
			this.currentAnim = this.anims.jump;
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else if (this.bAttacking)
		{
			this.currentAnim = this.anims.attack;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		this.targetArea.pos.x = this.pos.x - this.targetArea.size.x/2 + this.size.x/2;
		this.targetArea.pos.y = this.pos.y - this.targetArea.size.y/2 + this.size.y/2;
		
		if (this.targetArea.bestTarget && !this.bAttacking)
		{
			if (!this.flip && this.targetArea.bestTarget.pos.x > this.pos.x)
			{
				this.prepAttack();					
			}
			else if (this.flip && this.targetArea.bestTarget.pos.x < this.pos.x)
			{
				this.prepAttack();
			}
			else
			{
				this.flip = !this.flip;
				xdir = this.flip ? -1 : 1;
			}
		}
		
		//Check if attack has been prepped - if so, fire
		if (this.prepTimer.delta() > this.attackPrepTime && this.bAttacking && !this.bAttackFinished)
		{			
			this.attack();
		}	
		
		if (Math.abs(this.vel.x) < this.speed && !this.bPrepareToJump && !this.bAttacking && !this.bAttackFinished)
		{
			this.vel.x = this.speed * xdir;
		}
		else
		{
			this.vel.x = 0;
		}
		
		//Wait to finish attack
		if (this.bAttackFinished && this.primaryAttackTimer.delta() > this.attackTime)
		{
			this.finishAttack();
		}		
		
		//Set walking anim
		if (this.vel.x > 0)
		{						
			this.flip = false
			this.currentAnim.flip.x = true;
		}
		else if (this.vel.x < 0)
		{			
			this.flip = true
			this.currentAnim.flip.x = false;
		}
		else
		{
			this.currentAnim.flip.x = !this.flip;
		}
				
		this.parent();		
		
		this.weapon.pos.y = this.pos.y + 12
		
		if (this.flip)
			this.weapon.pos.x = this.pos.x - 12
		else
			this.weapon.pos.x = this.pos.x + 12
		
		this.weapon.currentAnim.flip.x = this.currentAnim.flip.x;
		
		if (this.damageFX)
		{
			this.damageFX.pos.x = this.pos.x - this.size.x/2
			this.damageFX.pos.y = this.pos.y
			this.damageFX.currentAnim.flip.x = this.currentAnim.flip.x;
		}
	},
	
	//Set attack anim, stop movement
	prepAttack: function() {		
		this.prepTimer.reset();
		this.bAttacking = true;
		this.bAttackFinished = false;		
	},
	
	attack: function() {
		if (this.flip)
			r = 3.14;
		else
			r = 0
		
		var projOffset = 0;
		
		if (!this.flip)
			projOffset = this.size.x/2 + 12
		
		ig.game.spawnEntity( EntityEnemyBullet, this.weapon.pos.x + projOffset, this.weapon.pos.y + 12, {angle:r} );
		//console.log("FIRE PROJECTILE!!");
				
		this.bAttackFinished = true;
		
		//play weapon attack anim
		this.weapon.currentAnim = this.weapon.anims.attack;
		this.weapon.currentAnim.rewind();
		this.weapon.currentAnim.flip.x = this.currentAnim.flip.x;
		
		this.primaryAttackTimer.reset();
	},
	
	finishAttack: function() 
	{		
		this.bAttackFinished = false;
		this.bAttacking = false;
	},	
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			if (!this.bJumping)
				this.flip = !this.flip;
		}
	},	
	
	check: function( other ) {
		//other.receiveDamage( 10, this );
	},
	
	//damage FX
	receiveDamage: function(amount, from){
		this.parent(amount, from);
		
		if (this.damageFX)
		{
			this.damageFX.currentAnim = this.damageFX.anims.takeDamage;
			this.damageFX.currentAnim.rewind();
		}
	},	
	
	kill: function()
	{		
		if (this.damageFX)
			this.damageFX.kill();					
			
		this.targetArea.kill();
		this.weapon.kill();			
		
		this.deathFX = ig.game.spawnEntity( EntityDeathEffect, this.pos.x - this.size.x/2, this.pos.y, {} );		
		this.deathFX.currentAnim.flip.x = this.currentAnim.flip.x;		
		this.deathFX.vel.y = this.vel.y
		this.deathFX.zIndex = this.zIndex;
		ig.game.sortEntitiesDeferred();						
		
		ig.game.enemyCount--;
		this.parent();
	}
});

EntityTargetArea = ig.Entity.extend({
	size: {x: 196, y: 64},
	maxVel: {x: 0, y: 0},
	friction: {x: 0, y: 0},
	
	type: ig.Entity.TYPE.C, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	bestTarget: null,
	drawBox: false,
	
	update: function() {
		if (this.bestTarget && !this.touches(this.bestTarget))
		{
			this.bestTarget = null;
		}
		
		if (this.bestTarget && this.bestTarget.health <= 0)
		{
			this.bestTarget = null;
		}
	},
	
	check: function( other ) {		
		if (other && other.bIsTarget && other.health > 0)
			this.bestTarget = other;
	}	
});

EntityEnemyBullet = ig.Entity.extend({
	size: {x: 16, y: 16},
	offset: {x: 0, y: 0},
	maxVel: {x: 100, y: 100},
		
	gravityFactor: 0.0,
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A, // Check Against A - player friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/plasmaShot.png', 16, 16 ),
	
	lifeSpan: 1.5,
	damage: 25,
		
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		
		this.vel.y = Math.sin(this.angle) * this.maxVel.x; 
		this.vel.x =  Math.cos(this.angle) * this.maxVel.x;		
		
		this.addAnim( 'idle', 0.2, [0,0] );
		
		this.anims.idle.angle = this.angle;
		
		this.lifeTimer = new ig.Timer(0.0);
	},
	
	update: function() 
	{
		var bearing = Math.atan2(-this.vel.x, this.vel.y);
		
		this.anims.idle.angle = bearing + 1.57
		
		this.parent();
		
		if (this.lifeTimer.delta() > this.lifeSpan)
			this.kill();
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		if( res.collision.x || res.collision.y ) {			
				this.kill();
		}
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		if (other.bEnemyTarget)
		{
			other.receiveDamage( this.damage, this );
			this.kill();
		}
	}	
});

EntitySmallMiniGunEnemy = ig.Entity.extend({
	size: {x: 32, y: 32},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
		
	gravityFactor: 0.0,
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,	
	
	animSheet: new ig.AnimationSheet( 'media/SmallMinigun.png', 32, 32),
	
	bounceCounter: 0,	
	bPlayAttack: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [0] );
		this.addAnim( 'attack', 0.10, [1,2,3,4,0],true);
	},
});

EntityPlasmaCannonEnemy = ig.Entity.extend({
	size: {x: 32, y: 32},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
		
	gravityFactor: 0.0,
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,	
	
	animSheet: new ig.AnimationSheet( 'media/PlasmaCannon.png', 32, 32),
	
	bounceCounter: 0,	
	bPlayAttack: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [0] );
		this.addAnim( 'attack', 0.10, [1,2,3,4,0],true);
	},
});

EntityDamageEffect = ig.Entity.extend({
	size: {x: 64, y: 64},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
		
	gravityFactor: 0.0,
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,	
	drawBox: false,
	
	animSheet: new ig.AnimationSheet( 'media/SmallEnemyDamage.png', 64, 64),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [3] );	
		this.addAnim( 'takeDamage', 0.07, [0,2,1,3], true);	
	},	
});

EntityDeathEffect = ig.Entity.extend({
	size: {x: 64, y: 64},
	offset: {x: 0, y: 0},
	maxVel: {x: 400, y: 1600},
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,	
	drawBox: false,
		
	animSheet: new ig.AnimationSheet( 'media/SmallEnemyDeath.png', 64, 64),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		this.addAnim('idle', 0.10, [0,1,2,3],true);
		
		this.lifeTimer = new ig.Timer(0.0);
	},
	
	update: function()
	{
		this.parent();
		
		if (this.lifeTimer.delta() > 0.4)
		{
			this.kill();
		}
	}
});

});