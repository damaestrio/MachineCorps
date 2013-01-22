/*
	Save this file as lib/impact/overlays.js

	All it does it create a blank overlay and add a toggle key binding (useful for maps, HUDs, pause menus, etc).

	You'll need to extend this class with your own overlays. See hud.js for an example.
*/

ig.module(
	'impact.overlay'
)
.defines(function() {

ig.Overlay = ig.Class.extend({
	className:    'genericOverlay',
	toggleKey:     null,
	startVisible:  false,

	init: function() {
		var $canvas = $(ig.system.canvas);

		// Create the overlay object
		this.$overlay = $('<div>')
			.addClass('overlay')
			.addClass(this.className)
			.css({position: 'absolute', display: 'none'})
			.width($canvas.width())
			.height($canvas.height())
			.offset($canvas.offset());

		// Insert the overlay immediately after the canvas object
		$canvas.after(this.$overlay);

		this.$fadeOverlay = $('<div>')			
			.addClass('fadeBlack')
			.width($canvas.width()+2)
			.height($canvas.height()+2)
		
		this.$overlay.append(this.$fadeOverlay);
		
		// Bind a toggle key, if supplied
		if (this.toggleKey)
		{
			ig.input.bind(this.toggleKey, 'toggle-'+this.className);
		}

		// Show it if it starts visible
		this.$overlay.toggle(false);
	}
});

});
