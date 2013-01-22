ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.overlays.hud',
		
	'game.entities.generator',	
	'game.entities.player',	
	'game.entities.dropship',
	'game.entities.spike',	
	'game.entities.weapon',
	'game.entities.pickup',
	'game.levels.test',
	
	'game.BoxOutline.BoxOutline',
	'plugins.notification-manager'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300, // All entities are affected by this
	
	currentWave: 1,
	maxWaves: 5,
	waveTime: 30,
	countDownTime: 10,
	generatorCount: 3,
	lastTerminal: null,
	enemyCount: 0,
	bWaveStarted: false,
	
	//UI
	playerDisplayOffset: 150,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),			
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'crouch' );
		ig.input.bind( ig.KEY.F, 'shoot' );
		ig.input.bind( ig.KEY.E, 'use' );
		ig.input.bind( ig.KEY.R, 'reload' );
		ig.input.bind( ig.KEY.TAB, 'weaponSwitch' );
		//ig.input.bind( ig.KEY.MOUSE1, 'shoot' );
		
		this.myNoteManager = new ig.NotificationManager();		
		
		this.generatorLocationList = [];
		this.terminalList = [];
		this.dropZoneList = [];
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );					

		//spawn gennies here
		this.createGenerators();
		
		this.activateTerminal();				
		
		this.dropTroops();

		ig.global.hud.addHeadLine("MISSION START!", null, 750, true);
	},
	
	pauseGame: function(bPaused)
	{
		if (bPaused)
			ig.system.stopRunLoop.call(ig.system);
		else
			ig.system.startRunLoop.call(ig.system);
	},
	
	dropTroops: function()
	{
		for (var i = 0; i < this.dropZoneList.length; i++)
		{
			this.dropZoneList[i].dropTroops();
		}
	},
	
	nextWave: function()
	{		
		ig.game.currentWave++;
		ig.game.dropTroops();				
	},
	
	activateTerminal: function()
	{
		//Select random terminal to activate		
		var terminalLocationNum = Math.floor((Math.random()*this.terminalList.length));		
		var thisTerminal = this.terminalList[terminalLocationNum]
		
		while (this.lastTerminal == thisTerminal)
		{
			terminalLocationNum = Math.floor((Math.random()*this.terminalList.length));		
			thisTerminal = this.terminalList[terminalLocationNum]
		}
		
		this.lastTerminal = thisTerminal;
		
		thisTerminal.populate();
	},
		
	createGenerators: function()
	{
		this.generatorList = [];			
		
		for (var i = 0; i < this.generatorCount; i++)
		{
			//Select random location for generator
			var genLocationNum = Math.floor((Math.random()*this.generatorLocationList.length));
			
			var genSpawn = this.generatorLocationList[genLocationNum]
		
			var newGenerator = ig.game.spawnEntity( EntityGenerator, genSpawn.pos.x, genSpawn.pos.y, {} );
								
			this.generatorList.push(newGenerator);
			
			this.generatorLocationList.splice(genLocationNum, 1);
		}
	},
	
	//see if all generators are dead
	checkGenerators: function()
	{
		var generatorsAlive = false;
		
		for (var i = 0; i < this.generatorList.length; i++)
		{
			if (this.generatorList[i] && this.generatorList[i].health > 0)
			{
				generatorsAlive = true;
			}
		}
		
		if (!generatorsAlive)
		{
			this.gameOver();
		}
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		
		this.myNoteManager.update()
		
		if (this.bWaveStarted && this.enemyCount <= 0)
		{		
			if (this.currentWave < this.maxWaves)
			{
				this.bWaveStarted = false;
				ig.global.hud.addHeadLine("WAVE " + (this.currentWave) + " COMPLETED!", this.nextWave);
			}
			else
			{
				this.bWaveStarted = false;		
				this.gameWin();
			}
		}
		
		if (ig.global.hero._killed)
		{
			ig.global.hud.update({
				wavePct: ig.game.currentWave/ig.game.maxWaves * 100,
				waveLabel: "WAVE " + ig.game.currentWave + "/" + ig.game.maxWaves,
				healthPct: 0,
				healthLabel: 0 + ' / 100',
				magazinePct: 0,			
				magazineLabel: '',
				actionPct: null,
				actionLabel: ''
			});	
		}
	},
	
	gameWin: function()
	{
		ig.global.hud.addHeadLine("MISSION ACCOMPLISHED!", ig.game.restartGame, 2500, false, true);
	},
	
	gameOver: function()
	{
		ig.global.hud.addHeadLine("GAME OVER", ig.game.restartGame, 2500, false, true);
	},
	
	restartGame: function(){
		ig.system.running = false;
		ig.system.setGame(MyGame);
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();		
		//this.font.draw( 'Arrow Keys, X, C', 2, 2 );
		//this.font.draw( 'ARROW KEYS TO MOVE, F TO FIRE', 2, 2 );
		//this.font.draw( 'WAVE: ' + this.currentWave, 2, 10 );
		
		var playerHealth = 0;
		var magazineAmmo = 0;
		var ammoCount = "UNLIM"
		
		if (ig.global.hero)
		{
			playerHealth = ig.global.hero.health
			magazineAmmo = ig.global.hero.weapon.magazineCount;
			
			if (!ig.global.hero.weapon.bUnlimitedAmmo)
				ammoCount = ig.global.hero.weapon.ammoCount
		}
		
		//this.font.draw( 'HEALTH: ' + playerHealth + ' AMMO: ' + magazineAmmo + ' | ' + ammoCount, 2, 312 );
		
		this.myNoteManager.draw()
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 510, 320, 2 );

});
