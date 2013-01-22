ig.module(
	'game.entities.weapon'
)
.requires(
	'impact.entity',
	'game.entities.playerProjectile'
)
.defines(function(){

EntityWeapon = ig.Entity.extend({
	size: {x: 32, y: 32},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
		
	gravityFactor: 0.0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,
		
	holstered: false,
	
	animSheet: new ig.AnimationSheet( 'media/Pistol.png', 32, 32 ),	
		
	xOffset: 16,
	yOffset: -3,
	projOffsetY: 5,	
	magazineCount: 12,
	magazineSize: 12,
	reloadTime: 2.5,
	ammoCount: -1,
	ammoMax: -1,
	bUnlimitedAmmo: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [0] );
		this.addAnim( 'reload', 1.0, [1] );
		this.addAnim( 'fire', 0.05, [2,3,4,5,0], true);
	},
	
	draw: function()
	{
		if (!this.holstered)
			this.parent();
	},
	
	hasAmmo: function()
	{
		if (this.bUnlimitedAmmo)
		{
			return true;
		}
		else
		{
			if (this.magazineCount > 0)
				return true;
			if (this.ammoCount > 0)
				return true;
		}
		
		return false;
	}
});

EntityShellCasing = ig.Entity.extend({
	size: {x: 8, y: 8},
	offset: {x: 0, y: 0},
	maxVel: {x: 25, y: 400},
	
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.2, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/ShellCasing.png', 8, 8 ),
	
	bounceCounter: 0,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		this.vel.y = -20 - Math.floor((Math.random()*10));
		this.addAnim( 'idle', 0.05, [0,1,2,3], true);
	},
	
	update: function() 
	{
		var bearing = Math.atan2(-this.vel.x, this.vel.y);		
		this.anims.idle.angle = bearing + 1.57
		
		this.parent();
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 2 times
			this.bounceCounter++;
			if( this.bounceCounter > 2 ) {
				this.kill();
			}
		}
	}
});

EntityPistol = EntityWeapon.extend({
	size: {x: 32, y: 32},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
	
	animSheet: new ig.AnimationSheet( 'media/Pistol.png', 32, 32 ),
	
	magazineCount: 12,
	magazineSize: 12,
	reloadTime: 1.0,
	xOffset: 32,
	yOffset: -3,
	projOffsetY: 5,
	casingOffset: 20,
	fireRate: 0.20,	
	bUnlimitedAmmo: true,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [0] );
		this.addAnim( 'reload', 1.0, [1] );
		this.addAnim( 'fire', 0.05, [2,3,4,5,0], true);
		
		this.projectile = EntityBullet
	}
});

EntityAR = EntityWeapon.extend({
	size: {x: 64, y: 64},
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
	
	animSheet: new ig.AnimationSheet( 'media/AssaultRifle.png', 64, 64 ),
	
	magazineCount: 30,
	magazineSize: 30,
	reloadTime: 1.5,
	xOffset: 32,
	yOffset: -15,
	projOffsetY: 21,
	casingOffset: 42,
	fireRate: 0.15,	
	ammoCount: 30,
	ammoMax: 120,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.y = 0;
		this.vel.x =  0;
		
		this.addAnim( 'idle', 1.0, [0] );
		this.addAnim( 'reload', 1.0, [4] );
		this.addAnim( 'fire', 0.05, [1,2,3,0], true);
		
		this.projectile = EntityARBullet
	}
});

EntityBullet = EntityPlayerProjectile.extend({
	maxVel: {x: 400, y: 500},
	damage: 35
});

EntityARBullet = EntityPlayerProjectile.extend({
	maxVel: {x: 600, y: 500},
	lifeSpan: 0.30,	
	damage: 25
});

});