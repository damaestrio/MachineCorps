ig.module(
	'game.entities.dropZone'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDropZone = ig.Entity.extend({
	size: {x: 128, y: 128},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, 
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER,	

	speed: 0,
	flip: false,
	waveActivated: 0,
	drawBox: false,
	bNonTarget: true,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );		

		//Add to the list of potential drop locations
		if (ig.game.dropZoneList)
		{
			ig.game.dropZoneList.push(this);
		}	
	},
	
	//Specifies a list of troops to drop, spawns dropship
	dropTroops: function()
	{
		var dropShip = ig.game.spawnEntity(EntityDropship, this.pos.x, this.pos.y - 256, {});
		dropShip.dropTarget = this;
		
		var dropTroops = []
		
		var numTroops = Math.min((2 + ig.game.currentWave), 6)
		
		for (var i = 0; i < numTroops; i++)
		{
			dropTroops.push(EntitySpike)
		}
				
		dropShip.populate(dropTroops);
	},
	
	//Invicible
	receiveDamage: function(){
		return;
	}
});

});