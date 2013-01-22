/*
	This is an example of a simple HUD, displaying health, stamina, and XP.

	If you want to test it out:
		1) make sure you've included jQuery and Bootstrap in index.html, or whatever your main page is
		2) make sure you've included lib/impact/overlay.js in the project structure
		3) save this file as lib/game/overlays/hud.js (you'll need to create the lib/game/overlays folder)
		4) add this inside your player character's init() function:
				this.hud = new HUD();
		5) add this at the end of your player character's update() function:
				// Update the hud (it won't automatically get updated by Impact)
				this.hud.update({
					healthPct:     45,
					healthLabel:  '90 / 200',
					staminaPct:    25,
					staminaLabel: '20 / 80'
					xpPct:         22,
					xpLabel:      'Level 3'
				});
		6) hit the tab key in your game to toggle it

	In case you're wondering, you're totally free to use this in whatever project you want, I don't care -
	but if you've got any good feedback or you do something really cool with it, definitely let me know!
*/

ig.module(
	'game.overlays.hud'
)
.requires(
	'impact.overlay'
)
.defines(function() {

HUD = ig.Overlay.extend({
	className: 'player-hud',
	//toggleKey: ig.KEY.SHIFT,
	startVisible:  true,
	refreshTime: 0.1,
	cursorTextFinished: false,
	cursorTime: 0.1,
	
	init: function() {
		this.parent();
		console.log('initialized HUD');

		//Health bar container
		this.$healthBarContainer = $('<div>').css({
			position: 'absolute',
			left:        '10px',
			top:        '10px',
			width:       '200px'
		});	
		
		this.$overlay.append(this.$healthBarContainer);
		
		// Health bar section
		this.$healthBarSection = $('<div>')
			.addClass('progress progress-striped')
			.css({marginBottom: '10px'})			
			.append(
				$('<div>')
					.addClass('bar bar-info'))
			.append(
				$('<span>')
					.addClass('bar-label')
					.css({
						color: 'black',
						position: 'absolute',
						width: '100px',
						textAlign: 'center',
						left: '0px'
					}));		
		
		// Ammo Section
		this.$magazineContainer = $('<div>').css({
			position: 'absolute',
			left:        '10px',
			bottom:        '10px',
			width:       '200px'
		});

		this.$overlay.append(this.$magazineContainer);			

		// Action Section
		this.$actionContainer = $('<div>').css({
			position: 'absolute',
			left:        '350px',
			bottom:        '10px',
			width:       '500px'
		});
				
		this.$overlay.append(this.$actionContainer);				
		
		this.$actionSection = $('<div>')
			.addClass('progress progress-striped')
			.css({marginBottom: '10px'})			
			.append(
				$('<div>')
					.addClass('bar bar-info'))
			.append(
				$('<span>')
					.addClass('bar-label')
					.css({
						color: 'black',
						position: 'absolute',
						width: '150px',
						textAlign: 'center',
						left: '0px'
					}));			
		
		// Add the individual bars to the status bar container
		this.$waveSection = this.$healthBarSection.clone();		
		this.$waveSection.addClass('progress-success');
		this.$healthBarContainer.append($('<div>MISSION OBJ</div>'))		
		this.$healthBarContainer.append(this.$waveSection );
		
		this.$healthBarContainer.append($('<div>HEALTH</div>'))
		this.$healthBarContainer.append(this.$healthBarSection );
		
		// Create the stamina and XP bar sections by cloning the health bar and changing the color classes
		this.$magazineSection = this.$healthBarSection.clone();
		
		this.$magazineContainer.append($('<div>AMMO</div>'))
		this.$magazineContainer.append(this.$magazineSection);
		this.$actionContainer.append(this.$actionSection);
		this.$actionSection.hide();
		
		this.refreshTimer = new ig.Timer(0.0)
		this.cursorTimer = new ig.Timer(0.0)
		
		//Danger Alert Section
		this.$dangerContainer = $('<div>').css({
			position: 'absolute',
			left:        '300px',
			top:        '10px',
			width:       '500px'
		});
		
		this.$overlay.append(this.$dangerContainer);	

		
		//Tip Section
		this.$tipContainer = $('<div>').css({
			position: 'absolute',
			left:        '10px',
			bottom:        '100px',
			width:       '100px'
		});
		
		this.$overlay.append(this.$tipContainer);
		
		//Headline section
		this.$headLineContainer = $('<div>').css({
			position: 'absolute',			
			left: '10px',
			top: '200px',
			width: '900px',
			color: '#6dcff6'
		});		
		this.$headLineContainer.addClass('hero-unit')			
		
		this.$overlay.append(this.$headLineContainer);
		
		this.$headLine = $('<h1>')
		
		this.$headLineContainer.append(this.$headLine);
	},

	addAlert: function(alertText)
	{				
		//Danger Alerts
		this.$lastAlert = $('<div>')
										.addClass('alert alert-error')
										.append(alertText);
										
		this.$dangerContainer.append(this.$lastAlert);
												
		this.$lastAlert.fadeOut(750, function(){
												if (this.$lastAlert)
													this.$lastAlert.remove()
												});
	},
	
	addTip: function(tipText)
	{
		//Useage tips
		this.$lastTip = $('<div>')
										.addClass('label label-info')
										.append(tipText);
										
		this.$tipContainer.append(this.$lastTip);

		this.$lastTip.fadeOut(2000, function(){
												if (this.$lastTip)
													this.$lastTip.remove()
												});
	},
	
	addHeadLine: function (headlineText, nextMethod, delay, bFadeIn, bFadeOut)
	{								
		this.textBuffer = [];
		
		for (var i = 0; i < headlineText.length; i++)
		{
			this.textBuffer.push(headlineText[i]);
		}
		
		this.textBuffer.reverse();
		this.cursorTextFinished = false;
		
		//Fire a method after text has been written
		if (nextMethod)
		{
			this.nextMethod = nextMethod;
		}
		else
		{
			this.nextMethod = null;
		}
		
		if (delay)
			this.headLineTextDelay = delay;
		else
			this.headLineTextDelay = 1000;
		
		if (bFadeIn)
			this.headLineFadeIn = bFadeIn
		else
			this.headLineFadeIn = false;
			
		if (bFadeOut)
			this.headLineFadeOut = bFadeOut
		else
			this.headLineFadeOut = false;			
	},
	
	update: function(config) {
		$('.bar', this.$waveSection ).width(config.wavePct+'%');
		$('.bar-label', this.$waveSection ).text( config.waveLabel  );
		
		// Update the width of the bar under the health bar section, and then update the text of the label
		$('.bar',       this.$healthBarSection ).width(config.healthPct+'%');
		$('.bar-label', this.$healthBarSection ).text( config.healthLabel  );		
		
		// Likewise for stamina and XP
		$('.bar',       this.$magazineSection).width(config.magazinePct+'%');
		$('.bar-label', this.$magazineSection).text( config.magazineLabel  );
		
		if (config.actionPct)
		{
			this.$actionSection.show();
		}
		else
		{
			this.$actionSection.hide();
		}
		
		//Add extra timer here, because we need more time to refresh
		if (this.refreshTimer.delta() > this.refreshTime)
		{
			if (config.actionPct)
			{				
				$('.bar', this.$actionSection).width(config.actionPct+'%');
				$('.bar-label', this.$actionSection).text( config.actionLabel);
				
				this.lastActionPct = config.actionPct
			}
			else
			{					
				$('.bar', this.$actionSection).width('0%');
			}
			
			this.refreshTimer.reset();
		}
		
		//Cursor text
		if (this.cursorTimer.delta() > this.cursorTime && !this.cursorTextFinished)
		{
			if (this.textBuffer.length > 0)
			{			
				this.$headLine.append(this.textBuffer[this.textBuffer.length - 1]);	
				this.textBuffer.pop();
			}
			else
			{
				var clearElement = this.$headLine
				var nextMethod = this.nextMethod
				
				if (this.headLineFadeIn || this.headLineFadeOut)
				{
					var opacity = 0.0
					
					if (this.headLineFadeOut)
						opacity = 1.0
					
					this.fadeBlack(this.headLineTextDelay, opacity);
				}
				
				window.setTimeout(function(){
												clearElement.empty()
												if (nextMethod)
													nextMethod();
											}, this.headLineTextDelay)
											
				this.cursorTextFinished = true;
			}
			
			this.cursorTimer.reset();
		}
	},
	
	toggle: function(visible)
	{
		this.$overlay.toggle(visible);
	},
	
	fadeBlack: function(time, opacity)
	{
		this.$fadeOverlay.fadeTo(time, opacity);
	}
});

});