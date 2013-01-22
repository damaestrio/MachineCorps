ig.module(
	'game.entities.dropship'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDropship = ig.Entity.extend({
	size: {x: 128, y: 128},
	maxVel: {x: 100, y: 100},
	friction: {x: 0, y: 0},
	
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER,		

	health: 10000,	
	
	speed: 0,
	flip: false,			
	gravityFactor: 0.0,
	bInDropZone: false,
	bDropComplete: false,
	bDropFlip: false,
	
	animSheet: new ig.AnimationSheet( 'media/dropship.png', 128, 128 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.01, [0,1]);
		
		//Spawn timer
		this.spawnTimer = new ig.Timer(0.0);
		
		this.zIndex += 2;
		
		if (ig.game.sortEntitiesDeferred)		
			ig.game.sortEntitiesDeferred();		
		
		this.dropTroops = [];
		
		this.vel.y = 20;
	},
	
	populate: function(troops) {
		//Add troops to drop
		this.dropTroops = troops
	},
	
	update: function() {		
		this.parent();			
		
		if (this.spawnTimer.delta() > 2.5 && this.bInDropZone)
		{
			if (this.dropTroops[0])
			{			
				var newEnemy = ig.game.spawnEntity( this.dropTroops[this.dropTroops.length-1], this.pos.x + this.size.x/2, this.pos.y + 96, {} );
				newEnemy.flip = this.bDropFlip
				
				this.bDropFlip = !this.bDropFlip
				
				ig.game.enemyCount++;				
				
				this.dropTroops.pop()
				this.spawnTimer.reset();	
			}
			else
			{
				if (!this.bDropComplete)
				{
					this.accel.y = -30;
				
					if (!ig.game.bWaveStarted)
						ig.game.bWaveStarted = true;
				}
				
				this.bDropComplete = true;
			}
		}

		if (this.dropTarget)
		{
			if (this.distanceTo(this.dropTarget) > 512)
				this.kill();
		}		
	},
	
	check: function( other ) {
		if (!this.dropTarget)
			return;
		
		if (other == this.dropTarget)
		{
			this.bInDropZone = true;
			this.vel.y = 0;
		}		
	},
});

});