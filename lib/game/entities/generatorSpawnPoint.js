ig.module(
	'game.entities.generatorSpawnPoint'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityGeneratorSpawnPoint = ig.Entity.extend({
	size: {x: 128, y: 128},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.NONE, 
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,	

	speed: 0,
	flip: false,	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );			
		
		//Add to the list of potential generator locations
		if (ig.game.generatorLocationList)
		{
			ig.game.generatorLocationList.push(this);
		}
	},	
});

});