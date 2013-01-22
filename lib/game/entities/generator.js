ig.module(
	'game.entities.generator'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityGenerator = ig.Entity.extend({
	size: {x: 128, y: 128},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.A, 
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	defaultHealth: 500,
	
	speed: 0,
	flip: false,
	bIsTarget: true,
	bEnemyTarget: true,
	
	gravityFactor: 0.0,
	
	animSheet: new ig.AnimationSheet( 'media/generator.png', 128, 128 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.5, [0,1] );
		this.addAnim( 'damaged', 0.5, [2,3] );
		
		this.zIndex -= 1;
		
		this.health = this.defaultHealth
		
		ig.game.sortEntitiesDeferred();
	},			
	
	receiveDamage: function(amount, from){
		this.parent(amount, from);
		
		if (this.health < (this.defaultHealth/4))
		{
			this.currentAnim = this.anims.damaged;
		}
		
		ig.global.hero.hud.addAlert('GENERATOR UNDER ATTACK!!!');
	},
		
	kill: function()
	{		
		this.deathFX = ig.game.spawnEntity( EntityGeneratorDeathAnim, this.pos.x, this.pos.y, {} );		
		this.parent();	
		//ig.game.checkGenerators();
	}
});

EntityGeneratorDeathAnim = ig.Entity.extend({
	size: {x: 128, y: 128},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.NONE, 
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,
	
	gravityFactor: 0.0,
	drawBox: false,
	
	animSheet: new ig.AnimationSheet( 'media/generatorDeath.png', 128, 128 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.2, [0,1,2,3], false);
		
		this.zIndex -= 1;
		
		ig.game.sortEntitiesDeferred();
		
		this.lifeTimer = new ig.Timer(0.0);
	},	

	update: function()
	{
		this.parent();
		
		if (this.lifeTimer.delta() > 0.8)
		{
			this.kill();
			ig.game.checkGenerators();
		}
	}	
})

});