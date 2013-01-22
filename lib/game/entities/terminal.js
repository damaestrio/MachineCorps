ig.module(
	'game.entities.terminal'
)
.requires(
	'game.entities.usable',
	'impact.entity'
)
.defines(function(){
	
EntityTerminal = EntityUsable.extend({
	size: {x: 96, y: 64},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	health: 500,
	
	gravityFactor: 0.0,
	flip: false,	
	bPointer: true,
	useText: 'HOLD E TO HACK',
	
	hackStrengthDefault: 100,
	hackStrength: 0,
	hackStarted: false,
	bHacked: false,
	bCanUse: false,
	hackSpeed: 0.20,
	timeOut: 15,
	
	animSheet: new ig.AnimationSheet( 'media/TerminalSheet.png', 96, 64 ),	
	
	init: function( x, y, settings ) {		
		this.addAnim( 'idle', 1.0, [0]);
		this.addAnim( 'powerOn', 1.0, [1] );	
		this.addAnim( 'hacking', 0.1, [2,3]);
		this.addAnim( 'hacked', 1.0, [4] );	
		this.addAnim( 'warn', 1.0, [5] );	

		this.parent( x, y, settings);
		
		this.hackTimer = new ig.Timer(0.0);		

		if (ig.game.terminalList)
		{			
			ig.game.terminalList.push(this);
		}
				
		this.zIndex -= 1;		
		
		if (ig.game.sortEntitiesDeferred)
		{
			ig.game.sortEntitiesDeferred();		
		}
		
		this.terminalTimer = new ig.Timer(0.0);
		
		this.currentAnim = this.anims.idle;
	},
	
	//Creates the item to hack
	populate: function() {		
		//Remove old target
		if (this.hackTarget)
		{
			this.hackTarget.kill();
		}
		
		var itemToSpawn = this.getItem();
		
		this.hackTarget = ig.game.spawnEntity(itemToSpawn, this.pos.x + 64, this.pos.y + 16, {} );
		this.hackTarget.zIndex = this.zIndex - 1;
		ig.game.sortEntitiesDeferred();	
		this.bHacked = false;
		this.hackStarted = false;
		this.hackTimer.reset();
		this.hackStrength = 0;
		this.bCanUse = true;
		this.currentAnim = this.anims.powerOn
		
		//Start the access timer
		this.terminalTimer.reset();
	},	
	
	//logic to adjust which item to spawn
	getItem: function()
	{
		var itemNum = Math.floor((Math.random()*100));
		
		if (itemNum < 50)
		{
			return EntityHealthPack;
		}
		if (itemNum > 50)
		{
			return EntityAmmoPack;
		}
	},
	
	update: function() {
		if (this.hackStarted)
		{
			if (this.bUsing())
			{
				if (this.hackTimer.delta() > this.hackSpeed)
				{
					if (this.hackStrength < this.hackStrengthDefault)
					{											
						this.hackStrength += 10;
						this.hackTimer.reset();						
						var percentComplete = this.hackStrength/this.hackStrengthDefault * 100;
						
						//ig.game.myNoteManager.spawnNote(ig.game.font, percentComplete + "%", ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
						ig.global.hero.actionPct = percentComplete;
						ig.global.hero.actionLabel = 'HACKING';
					}
					else
					{						
						this.currentAnim = this.anims.hacked
						this.bHacked = true;
						this.hackTimer.reset();						
						this.hackStarted = false;
						this.bCanUse = false;
						ig.global.hero.bCanFire = true;
						ig.global.hero.holsterWeapon(false);
						ig.global.hero.actionPct = null;
						
						//ig.game.myNoteManager.spawnNote(ig.game.font, "HACK COMPLETE!", ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
						
						//Unlocks the hack target
						this.hackTarget.bLocked = false;
						
						//Activate next terminal
						ig.game.activateTerminal();
					}
				}
			}
			//Reset hack
			else
			{
				this.currentAnim = this.anims.powerOn
				
				this.hackTimer.reset();
				this.hackStarted = false;
				ig.global.hero.bCanFire = true;
				ig.global.hero.holsterWeapon(false);
				ig.global.hero.actionPct = null;
				this.hackStrength = 0;				
				
				//setTimeout(function(){ig.game.myNoteManager.spawnNote(ig.game.font, "HACK RESET!", ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, [])}, 300)
			}
		}
		else
		{
			var currentHackTarget = this.hackTarget
			
			if (this.bCanUse && (this.terminalTimer.delta() > this.timeOut - 5))
			{
				this.currentAnim = this.anims.warn
			}
			
			//Move to next terminal
			if (this.bCanUse && !this.bHacked && this.terminalTimer.delta() > this.timeOut)
			{
				currentHackTarget.kill();
				//ig.game.myNoteManager.spawnNote(ig.game.font, "TERMINAL ACCESS EXPIRED!", ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
				this.currentAnim = this.anims.idle			
				this.hackTimer.reset();
				this.hackStarted = false;
				this.bCanUse = false;		
				ig.game.activateTerminal();
			}
		}
		
		this.parent();
	},	
	
	//Start the hack
	used: function() {
		if (!this.bUsable() || !this.bCanUse)
		{
			return;
		}
		
		//pointerPos = ig.game.playerPointer.getPosition();
		
		//ig.game.myNoteManager.spawnNote(ig.game.font, 'HACKING...', ig.game.screen.x + 2, ig.game.screen.y + ig.game.playerDisplayOffset, []);
		
		this.currentAnim = this.anims.hacking
		this.currentAnim.rewind();
		
		this.hackStarted = true;
		ig.global.hero.bCanFire = false;
		ig.global.hero.holsterWeapon(true);
		this.hackTimer.reset();
	},
	
	//Must be clicked and within range
	bUsing: function() {
		
		if (ig.input.state('use') && this.distanceTo(ig.global.hero) < 50)
		{			
			return true;
		}
		
		return false;
	},
	
	//Check if player can use this item
	bUsable: function() {
		if (this.bHacked)
			return false;
		
		if (ig.global.hero)
		{
			if (this.distanceTo(ig.global.hero) < 50)
			{				
				return true;
			}
			
			return false;
		}
	}
});


});