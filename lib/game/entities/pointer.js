ig.module(
	'game.entities.pointer'
)
.requires(
	'plugins.box2d.entity'
)
.defines(function(){

EntityPointer = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.A,
    size: {x:8, y:8},    
    drawBox: false,
	
	init: function() {
		this.parent();
		ig.game.playerPointer = this;		
		
		this.pos.x = 10
		this.pos.y = 10
	},		
	
    update: function() {     		
		this.parent();		
		
		// Update the position to follow the mouse cursor. You
        // may also have to account for ig.game.screen.x/y here 
        this.pos.x = ig.input.mouse.x + ig.game.screen.x;
        this.pos.y = ig.input.mouse.y + ig.game.screen.y;        
		
		document.body.style.cursor = "default";			
		
		if( ig.input.state('shoot'))
		{
			ig.global.hero.attack();
		}
    },
    
    check: function( other ) {		
		
		// User is clicking and the 'other' entity has 
        // a 'clicked' function?
        if( ig.input.pressed('use') && typeof(other.clicked) == 'function') 
		{            
			//console.log("Checking Click");
			other.clicked();	
        }	
		
		if (other.bPointer)
		{
			if (other.bUsable)
			{
				if (other.bUsable())
				{
					document.body.style.cursor = "pointer";			
				}				
			}			
		}	
    },
	
	getPosition: function()
	{
		var pointerPos = new Object();
		
		pointerPos.x = ig.game.screen.x - ig.input.mouse.x;
		pointerPos.y = ig.game.screen.y - ig.input.mouse.y;
		
		return pointerPos;
	}
});

});

