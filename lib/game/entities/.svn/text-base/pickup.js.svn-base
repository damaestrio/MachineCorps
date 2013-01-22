ig.module(
	'game.entities.pickup'	
)
.requires(
	'impact.entity',
	'game.entities.weapon'
)
.defines(function(){

EntityPickup = ig.Entity.extend({
	size: {x: 32, y: 32},
	maxVel: {x: 100, y: 100},
	friction: {x: 0, y: 0},
	
	type: ig.Entity.TYPE.A, 
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,		
		
	speed: 0,
	flip: false,
	bLocked: true,	
	
	gravityFactor: 0.0,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1.0, [0]);
		
		this.zIndex -= 1;
		
		if (ig.game.sortEntitiesDeferred)		
			ig.game.sortEntitiesDeferred();
	},
	
	check: function( other ) {							
		if (this.bLocked)
			return;
		
		if (other == ig.global.hero)
		{
			this.usePowerup(other);		
		}		
	},
	
	//Abstract, define in child
	usePowerup: function(user)
	{
	},
});

EntityHealthPack = EntityPickup.extend({	
	healthValue: 100,
	
	animSheet: new ig.AnimationSheet( 'media/HealthPack.png', 32, 32 ),
	
	usePowerup: function(user)
	{
		if (user.health < 100)
		{
			user.health = Math.min(user.health + this.healthValue, 100);				
			this.kill();
		}
	}	
});

EntityAmmoPack = EntityPickup.extend({		
	weaponType: EntityAR,
	ammoValue: 30,	
	
	animSheet: new ig.AnimationSheet( 'media/AmmoPack.png', 32, 32 ),
	
	usePowerup: function(user)
	{
		var weapon = user.getWeapon(this.weaponType);
		
		if (weapon)
		{
			weapon.ammoCount = Math.min(weapon.ammoCount + this.ammoValue, weapon.ammoMax);
			this.kill();
		}
	}	
});

});