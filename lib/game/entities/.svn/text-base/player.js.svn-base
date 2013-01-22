ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 32, y: 64},
	offset: {x: 16, y: 0},
	
	maxVel: {x: 150, y: 1600},
	friction: {x: 800, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,	
	
	animSheet: new ig.AnimationSheet( 'media/playerSheet.png', 64, 64 ),
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 1600,
	accelAir: 2000,
	jump: 200,
	health: 100,
	flip: false,
	head: null,
	weapon: null,
	bCanFire: true,
	lastChecked: null,
	bIsTarget: true,
	bReloading: false,
	bEnemyTarget: true,
	bDied: false,
	
	//Used for HUD
	actionPct: null,
	actionLabel: '',	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'pistolIdle', 1, [0] );
		this.addAnim( 'pistolRun', 0.05, [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31] );
		this.addAnim( 'pistolJump', 1, [1] );
		this.addAnim( 'pistolFall', 1, [1] );

		this.addAnim( 'rifleIdle', 1, [2] );
		this.addAnim( 'rifleRun', 0.05, [32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47] );
		this.addAnim( 'rifleJump', 1, [3] );
		this.addAnim( 'rifleFall', 1, [3] );
				
		this.pistolAnims = []
		this.pistolAnims['idle'] = this.anims.pistolIdle
		this.pistolAnims['run'] = this.anims.pistolRun
		this.pistolAnims['jump'] = this.anims.pistolJump
		this.pistolAnims['fall'] = this.anims.pistolFall
		
		this.rifleAnims = []
		this.rifleAnims['idle'] = this.anims.rifleIdle
		this.rifleAnims['run'] = this.anims.rifleRun
		this.rifleAnims['jump'] = this.anims.rifleJump
		this.rifleAnims['fall'] = this.anims.rifleFall			
		
		//Fire timer
		this.fireTimer = new ig.Timer(0.0);
		this.reloadTimer = new ig.Timer(0.0);		
		this.switchTimer = new ig.Timer(0.0);
		this.UITimer = new ig.Timer(0.0);		
		
		this.zIndex += 10;
		
		if (ig.game.spawnEntity)
		{						
			this.damageFX = ig.game.spawnEntity( EntityPlayerDamageEffect, this.pos.x, this.pos.y, {} );
			this.damageFX.zIndex = this.zIndex + 2;
			
			this.weaponList = []						
			
			//Spawn weapons
			var newWeapon = ig.game.spawnEntity( EntityPistol, this.pos.x, this.pos.y, {flip:this.flip} );			
			newWeapon.playerAnim = this.pistolAnims
			newWeapon.holstered = true;
			this.weaponList.push(newWeapon);
			
			newWeapon = ig.game.spawnEntity( EntityAR, this.pos.x, this.pos.y, {flip:this.flip} );
			newWeapon.playerAnim = this.rifleAnims
			newWeapon.holstered = true;
			this.weaponList.push(newWeapon);
									
			this.weapon = newWeapon;
			this.currentAnimSet = newWeapon.playerAnim
			this.weapon.holstered = false;
			this.currentWeaponIndex = 1						
		}				
		
		ig.global.hero = this;				
		
		//Link to the HUD, turn it on
		if (ig.global.hud)
		{
			this.hud = ig.global.hud
			this.hud.toggle(true);
		}
	},
		
	update: function() {		
		var mx = (ig.input.mouse.x + ig.game.screen.x); //Figures out the x coord of the mof in the entire world
		var my = (ig.input.mouse.y - 10 + ig.game.screen.y); //Figures out the y coord of the mouse in the entire world
		
		var r = Math.atan2(my-this.pos.y, mx-this.pos.x); //Gives angle in radians from player's location to the mouse location, assuming directly right is 0

		var xOffset = Math.cos(r)
		var yOffset = Math.sin(r)

		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if( ig.input.state('left') ) {
			this.accel.x = -accel;
			//this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.accel.x = accel;
			//this.flip = false;
		}
		else {
			this.accel.x = 0;		
		}
		
		//Update flip based on mouse location
		/*if (mx > this.pos.x)
			this.flip = true;
		else
			this.flip = false;*/
		
		if (this.accel.x > 0)
			this.flip = true;
		if (this.accel.x < 0)
			this.flip = false;
		
		
		// jump
		if( this.standing && ig.input.pressed('jump') ) {
			this.vel.y = -this.jump;
		}
		
		// set the current animation, based on the player's speed
		if( this.vel.y < 0 ) {
			this.currentAnim = this.currentAnimSet['jump'];
		}
		else if( this.vel.y > 0 ) {
			this.currentAnim = this.currentAnimSet['fall'];
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.currentAnimSet['run'];
		}
		else {
			this.currentAnim = this.currentAnimSet['idle'];
		}
		
		this.currentAnim.flip.x = this.flip;		
		
		// move!
		this.parent();
		
		// shoot
		if( ig.input.state('shoot') && this.bCanFire)
		{						
			this.attack();
		}
		
		if (ig.input.state('reload') && ! this.bReloading)
		{
			this.reload();
		}
		
		//check for reload
		if (this.reloadTimer.delta() > this.weapon.reloadTime && this.bReloading)
		{
			this.finishReload();
		}
		
		//Weapon switch
		if (ig.input.pressed('weaponSwitch') && this.bCanFire && !this.bReloading && this.switchTimer.delta() > 0.1)
		{
			this.switchWeapon();
			this.switchTimer.reset();
		}
		
		//Update weapon
		var weaponRotation = 0;
		
		weaponRotation = this.getWeaponRotation(r);
		
		var weaponXOffset = Math.cos(r)
		var weaponYOffset = Math.sin(r)
		
		this.weapon.pos.y = this.pos.y + this.weapon.yOffset
		
		if (this.flip)			
			this.weapon.pos.x = this.pos.x + this.size.x/2 - this.weapon.size.x/2 + this.weapon.xOffset
		else			
			this.weapon.pos.x = this.pos.x - this.size.x/2 - this.weapon.size.x/2 
		
		this.weapon.currentAnim.flip.x = !this.getWeaponFlip(r);
		
		if (this.lastChecked != null && !this.touches(this.lastChecked))
		{
			this.lastChecked = null;
		}
		
		//Damage Effects
		if (this.damageFX)
		{
			this.damageFX.pos.x = this.pos.x - this.size.x/2
			this.damageFX.pos.y = this.pos.y
			this.damageFX.currentAnim.flip.x = this.currentAnim.flip.x;
		}						
		
		//Update HUD
		var ammoCount = "UNLIM"
			
		if (!this.weapon.bUnlimitedAmmo)
			ammoCount = this.weapon.ammoCount			
		
		if (this.bReloading)
		{
			this.actionPct = this.reloadTimer.delta()/this.weapon.reloadTime * 100
			this.actionLabel = 'RELOADING'
		}		
	
		this.hud.update({
			wavePct: ig.game.currentWave/ig.game.maxWaves * 100,
			waveLabel: "WAVE " + ig.game.currentWave + "/" + ig.game.maxWaves,
			healthPct: this.health,
			healthLabel: this.health + ' / 100',
			magazinePct: (this.weapon.magazineCount/this.weapon.magazineSize) * 100,			
			magazineLabel: this.weapon.magazineCount + ' / ' + ammoCount,
			actionPct: this.actionPct,
			actionLabel: this.actionLabel
		});				
	}, 
		
	attack: function()
	{		
		if (!this.bCanFire)
			return;		
		
		if (this.flip)
			r = 0
		else
			r = 3.14			
		
		if (this.fireTimer.delta() > this.weapon.fireRate)
		{
			this.weapon.magazineCount--;
		
			if (this.weapon.magazineCount <= 0)
			{
				this.reload();				
				return;
			}
			else
			{			
				//play weapon attack anim
				this.weapon.currentAnim = this.weapon.anims.fire;
				this.weapon.currentAnim.rewind();
				this.weapon.currentAnim.flip.x = !this.flip

				var projOffset = 0
				
				if (this.flip)
				{
					projOffset = this.weapon.size.x/2
				}
				
				ig.game.spawnEntity( this.weapon.projectile, this.weapon.pos.x + projOffset, this.weapon.pos.y + this.weapon.projOffsetY, {flip:this.flip, angle:r} );
				
				var casingOffset = this.weapon.casingOffset
				
				if (this.flip)
				{
					casingOffset = this.weapon.casingOffset - this.weapon.size.x/2
				}
					
				ig.game.spawnEntity( EntityShellCasing, this.weapon.pos.x + casingOffset, this.weapon.pos.y + this.weapon.projOffsetY, {flip:this.flip});
				this.fireTimer.reset();
			}
		}
	},
	
	//manual reload
	reload: function()
	{			
		if (!this.bCanFire)
			return;
		
		if (this.weapon.magazineCount == this.weapon.magazineSize)
			return;
		
		if (!this.weapon.bUnlimitedAmmo)
		{							
			if (this.weapon.ammoCount == 0)
			{
				if (this.weapon.magazineCount == 0)
					this.switchWeapon();
				
				return;
			}
		}
		
		//ig.game.myNoteManager.spawnNote(ig.game.font, 'RELOADING...', ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
		this.weapon.currentAnim = this.weapon.anims.reload;
		this.bCanFire = false;
		this.bReloading = true;
		this.reloadTimer.reset();
	},
	
	finishReload: function()
	{				
		//ig.game.myNoteManager.spawnNote(ig.game.font, 'WEAPON READY!', ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
		this.weapon.currentAnim = this.weapon.anims.idle;		
		
		if (!this.weapon.bUnlimitedAmmo)
		{
			//handle reload partially empty magazines
			var remainingRounds = this.weapon.magazineCount;	
			var roundsToLoad = this.weapon.magazineSize - remainingRounds;
			
			if (roundsToLoad <= this.weapon.ammoCount)
			{
				this.weapon.magazineCount += roundsToLoad;
				this.weapon.ammoCount -= roundsToLoad;
			}
			//We don't have enough ammo in reserve to fill the magazine, so just load it all
			else
			{
				this.weapon.magazineCount = this.weapon.ammoCount + remainingRounds;
				this.weapon.ammoCount = 0;
			}									
		}
		//for weapons with unlimited ammo
		else
		{
			this.weapon.magazineCount = this.weapon.magazineSize;
		}
		
		this.bReloading = false;
		this.bCanFire = true;
		this.reloadTimer.reset();
		this.actionPct = null;
	},
	
	switchWeapon: function()
	{
		this.holsterWeapon(true);	
		
		this.currentWeaponIndex++;
		
		if ((this.currentWeaponIndex + 1) > this.weaponList.length)
		{
			this.currentWeaponIndex = 0;
		}
		
		this.weapon = this.weaponList[this.currentWeaponIndex];
		
		//Cycle until we find a weapon with ammo
		while (!this.weapon.hasAmmo())
		{
			this.currentWeaponIndex++;
		
			if ((this.currentWeaponIndex + 1) > this.weaponList.length)
			{
				this.currentWeaponIndex = 0;
			}
			
			this.weapon = this.weaponList[this.currentWeaponIndex];
		}
		
		this.currentAnimSet = this.weapon.playerAnim
		this.weapon.holstered = false;
	},
	
	//Finds a specific weapon in the players weaponList
	getWeapon: function(weaponType)
	{
		if (this.weaponList)
		{
			for (var i = 0; i < this.weaponList.length; i++)
			{
				var weapon = this.weaponList[i];
				
				if (weapon instanceof(weaponType))
				{
					return weapon;
				}
			}
		}
		return null;
	},
	
	getWeaponFlip: function(rotation)
	{		
		return this.flip;
	},
	
	getWeaponRotation: function(rotation)
	{
		if (rotation < -0.3925 && rotation >= 0)
			return 0;
			
		if (rotation < -0.3925 && rotation > -1.1775)
			return -0.785;
			
		if (rotation < -1.1775 && rotation > -1.9625)
			return -1.57;
			
		if (rotation < -1.9625 && rotation > -2.7475)
			return -2.355;
		
		if (rotation <-2.7475)
			return -3.14;
		
		if (rotation > 0 && rotation < 0.3925)
			return 0;
		
		if (rotation > 0.3925 && rotation < 1.1775)
			return 0.785;
		
		if (rotation > 1.1775 && rotation < 1.9625)
			return 1.57;
			
		if (rotation > 1.9625 && rotation < 2.7475)
			return 2.355;
		
		if (rotation > 2.7475)
			return 3.14;		
		
		return 0;
	},
	
	holsterWeapon: function(bHolstered)
	{
		this.weapon.holstered = bHolstered;
	},
	
	//Use an item in the world
    check: function( other ) {					
		if (typeof(other.used) == 'function' && (other.bCanUse))
		{
			if (this.lastChecked != other)
			{
				//ig.game.myNoteManager.spawnNote(ig.game.font, "HOLD E TO USE", ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
				this.hud.addTip(other.useText);
				this.lastChecked = other;
			}
		}
		
		// User is clicking and the 'other' entity has 
        // a 'clicked' function?
        if( ig.input.pressed('use') && typeof(other.used) == 'function') 
		{            
			//console.log("Checking Click");
			other.used();
        }
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
	
	//Game over here
	kill: function()
	{
		if (this.damageFX)
			this.damageFX.kill();		
		
		this.weapon.kill();		
		
		this.deathFX = ig.game.spawnEntity( EntityPlayerDeathEffect, this.pos.x - this.size.x/2, this.pos.y, {} );		
		this.deathFX.currentAnim.flip.x = this.currentAnim.flip.x;		
		this.deathFX.vel.y = this.vel.y		
		
		ig.game.gameOver();
		
		this.parent();				
	}	
});

EntityPlayerDamageEffect = ig.Entity.extend({
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
	
	animSheet: new ig.AnimationSheet( 'media/PlayerDamageEffect.png', 64, 64),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.07, [3]);
		this.addAnim( 'takeDamage', 0.07, [0,1,2,3], true);	
	},	
});

EntityPlayerDeathEffect = ig.Entity.extend({
	size: {x: 64, y: 64},
	offset: {x: 0, y: 0},
	maxVel: {x: 400, y: 1600},
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,	
	drawBox: false,
		
	animSheet: new ig.AnimationSheet( 'media/PlayerDeath.png', 64, 64),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		this.addAnim('idle', 0.10, [0,1,2,3,4,5,6,7,8,9],true);
		
		this.lifeTimer = new ig.Timer(0.0);
	},
	
	update: function()
	{
		this.parent();
		
		if (this.lifeTimer.delta() > 1.0 && !this.bDied)
		{					
			this.bDied = true;
			//ig.game.gameOver();
		}
	}
});

});