ig.module(
	'game.entities.elevator'
)
.requires(
	'game.entities.usable'
)
.defines(function(){
	
EntityElevator = EntityUsable.extend({
	size: {x: 96, y: 192},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	//drawBox: true,
	bFinishMovement: false,
	bMoveUp: true,
	bActivated: false,
	carSpeed: 120,	
	
	animSheet: new ig.AnimationSheet('media/elevatorShaft.png', 96, 192),
	
	user: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		
		this.addAnim( 'idle', 1.0, [0] );

		//this.hackTimer = new ig.Timer(0.0);
		this.zIndex -= 1;
		
		if (ig.game.spawnEntity)
		{		
			//Spawn platform
			this.platform = ig.game.spawnEntity(EntityElevatorPlatform, this.pos.x + 16, this.pos.y + this.size.y - 16, {} );		
			this.platform.elevator = this;
			this.platform.zIndex = this.zIndex + 2;						
			
			ig.game.sortEntitiesDeferred();
		}		
	},
	
	used: function()
	{
		this.bActivated = true;
	},
	
	update: function ()
	{
		this.parent();	
		
		/*if (this.user != null && !this.touches(this.user))
		{
			this.bActivated = false;
		}*/
		
		if (this.bActivated)
		{
			if (this.bMoveUp)
			{
				//Go up
				if (this.platform.pos.y > this.pos.y)
				{										
					//dampen speed near top
					if (this.platform.pos.y < this.pos.y + 32)
					{
						var dampSpeed = this.platform.vel.y * 0.95;
					
						this.platform.vel.y = Math.min(dampSpeed, -4)
					}
					else
					{
						this.platform.vel.y = this.carSpeed * -1
					}
				}	
				else
				{											
					this.bActivated = false;
					this.bMoveUp = false;
					this.platform.pos.y = this.pos.y
					this.platform.vel.y = 0
				}
			}
			else
			{
				//Go down
				if (this.platform.pos.y < this.pos.y + this.size.y - this.platform.size.y)
				{										
					if (this.platform.vel.y == 0)
						this.platform.vel.y = 24;
					
					this.platform.accel.y = this.carSpeed
					
					if (this.platform.vel.y > this.carSpeed)
						this.platform.vel.y = this.carSpeed
				}
				else
				{						
					this.bActivated = false;
					this.bMoveUp = true;
					this.platform.pos.y = this.pos.y + this.size.y - this.platform.size.y
					this.platform.accel.y = 0;
					this.platform.vel.y = 0
				}
			}
		}		
	}
});

EntityElevatorPlatform = ig.Entity.extend({
	size: {x: 64, y: 16},
	maxVel: {x: 100, y: 120},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,
	
	elevator: null,
	
	drawBox: false,
	
	gravityFactor: 0,
	
	animSheet: new ig.AnimationSheet('media/elevatorPlatform.png', 64, 16),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1.0, [0] );
		this.parent( x, y, settings );	
	},
	
	receiveDamage: function(){
		return;
	},
	
	//Must be clicked and within range
	bUsing: function() {
	},
	
	//Check if player can use this item
	bUsable: function() {
	},
	
	check: function(other)
	{
		//Lower the platform for bots
		if (other.type == ig.Entity.TYPE.B)
		{
			//console.log("Enemy on elevator");
			if (!this.elevator.bActivated && !this.elevator.bMoveUp)
			{
				this.elevator.bActivated = true;				
			}
		}
	}
});

});