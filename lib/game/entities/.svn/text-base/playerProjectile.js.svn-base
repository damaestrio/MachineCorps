ig.module(
	'game.entities.playerProjectile'
)
.requires(
	'impact.entity'	
)
.defines(function(){

EntityPlayerProjectile = ig.Entity.extend({
	size: {x: 16, y: 16},
	offset: {x: 0, y: 0},
	maxVel: {x: 500, y: 500},
		
	gravityFactor: 0.0,
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.0, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/pistolBullet.png', 16, 16),
	
	bounceCounter: 0,
	
	lifeSpan: 0.25,	
	damage: 25,	
	impactTime: 0.15,
	bImpact: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		
		this.vel.y = Math.sin(this.angle) * this.maxVel.x; 
		this.vel.x =  Math.cos(this.angle) * this.maxVel.x;		
		
		this.addAnim( 'idle', 1.0, [0,0] );
		this.addAnim( 'impact', 0.05, [1,2,3,4], true);
		
		this.anims.idle.angle = this.angle;
		
		this.lifeTimer = new ig.Timer(0.0);
		this.killTimer = new ig.Timer(0.0);			
	},
	
	update: function() 
	{
		var bearing = Math.atan2(-this.vel.x, this.vel.y);
		
		this.anims.idle.angle = bearing + 1.57
		
		this.parent();
		
		if (this.lifeTimer.delta() > this.lifeSpan)
		{
			this.kill();
		}
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		if( res.collision.x || res.collision.y ) {			
			if (!this.bImpact)			
				this.impact();
		}
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {							
		if (other.bNonTarget)
			return;
		
		other.receiveDamage(this.damage, this);
		this.kill();	
	},
	
	impact: function()
	{			
		this.vel.x = 0;
		this.bImpact = true;
		this.lifeSpan += this.impactTime				
		
		var impactAngle = this.currentAnim.angle
		
		this.currentAnim = this.anims.impact;
		this.currentAnim.rewind();
		this.currentAnim.angle = impactAngle;
	}
});

});