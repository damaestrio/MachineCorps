ig.module(
	'game.entities.spawner'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySpawner = ig.Entity.extend({
	size: {x: 32, y: 32},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.NONE, //Does not collide at all
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.NONE,
	
	gravityFactor: 0.0,
	
	health: 100,
		
	speed: 0,
	flip: false,
	targetArea: null,
	target: null,
	
	animSheet: new ig.AnimationSheet( 'media/spawnerIcon.png', 32, 32 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.08, [0] );
		
		this.zIndex += 10;
		
		//Spawn timer
		this.spawnTimer = new ig.Timer(0.0);
	},
	
	
	update: function() {
		// near an edge? return!
		if( !ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y+1
			)
		) {
			this.flip = !this.flip;
		}
		
		var xdir = this.flip ? -1 : 1;
		this.vel.x = this.speed * xdir;
		
		if (this.vel.x > 0)
		{
			if (this.flip)
				this.anims.idle.flip.x = false;
			else
				this.anims.idle.flip.x = true;
		}
		
		this.parent();			
		
		if (this.spawnTimer.delta() > 5.0)
		{
			ig.game.spawnEntity( EntitySpike, this.pos.x, this.pos.y, {} );
			
			this.spawnTimer.reset();
		}
	},
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
		}
	},	
	
	check: function( other ) {
		//other.receiveDamage( 10, this );
	},
	
	kill: function()
	{	
		this.parent();
	}
});

});