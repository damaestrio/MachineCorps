ig.module(
	'game.entities.usable'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityUsable = ig.Entity.extend({
	
	//On player side
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NONE,
	useText: 'TAP E TO USE',
	
	bCanUse: true,

	//Invicible
	receiveDamage: function(){
		return;
	},
	
	//What happens when used
	used: function() {
	},
	
	//Conditions for use to continue
	bUsing: function() {
	},
	
	//Check if player can use this item
	bUsable: function() {
	}
})

});