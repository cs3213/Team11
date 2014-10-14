VisualIDE
.service('actionService', ['commandProcessor', function(commandProcessor) {
	/// this service parses the action and calls the commandProcessor
	console.log('actionService initialized from app-services.js');
	this.process = function(elem, attr, command) {
		commandProcessor.execute(elem, attr, command);
	};
}])
.service('backgroundService', function() {
	/// this service provides the background image
	console.log('backgroundService initialized from app-services.js');
	this.backgrounds = [
		'binding_dark',
		'congruent_outline',
		'halftone',
		'hoffman',
		'ps_neutral',
		'seamless_paper_texture',
		'small_steps',
		'squared_metal',
		'stardust',
		'tree_bark',
		'triangular'
	];
	this.config = {
		'scale' 	: 10,					// default background scale
		'console' 	: false,					// if TRUE, console is visible
		'source' 	: this.backgrounds[1],	// default background source
	};
	this.changeImage = function($backgroundId) {
		console.log('backgroundService.changeImage() called');
		this.config.source = this.backgrounds[$backgroundId];
	};
	this.changeScale = function($scale) {
		console.log('backgroundService.changeScale() called');
		this.config.scale = $scale;
	};
})
.service('characterService', function() {
	/// this service provides the character
	console.log('characterService initialized from app-services.js');
	var nextTickTime = 0;
	var timePerTick = 500;
	var xMoved = 0;
	var yMoved = 0;

	this.costumes = [
		'pikachu',
	];
	this.config = {
		'id'		: 0,
		'name'		: 'default',
		'scale'		: 50,
		'source'	: this.costumes[0],
	};
	this.changeCostume = function($elem,$costumeId) {
		console.log('characterService.changeCostume() called');
		// change the templateUrl of the elem to the dataCostume[costumeId]
		this.config.source = this.costumes[$costumeId];
	};
	this.create = function($id,$name,$scale,$costumeId) {
		console.log('characterService.create() called');
		return {
			'id' 		: $id,
			'name'		: $name,
			'scale'		: $scale,
			'source'	: this.costumes[$costumeId],
		};
	};

	this.reposition = function ($xCoord, $yCoord){
		console.log("characterService.repositon() called");
		this.config.source.style.left = xCoord;
		this.config.source.style.top = yCoord;
	};

	this.setX = function($xCoord){
		console.log("characterService.setX() called");
		this.config.source.style.left = xCoord;
	};

	this.setY = function($yCoord){
		console.log("characterService.setY() called");
		this.config.source.style.top = yCoord;
	};

	this.hide = function(){
		this.config.source.style.visibility = "hidden";	
	};

	this.show = function(){
		this.config.source.style.visibility = "visible";
	};
	//speed : pixels per second?
	this.move = function($speed, $x, $y, $newMovement = true){
		console.log("characterService.move function called");

		if(newMovement){
			xMoved = 0;
			yMoved = 0;
		}
		var startTime = Date.getTime();
		var currentTime = startTime;
		//convert to milisecs to standardize
		var unitX = ((x/speed) / 1000) * timePerTick;
		var unitY = ((y/speed) / 1000) * timePerTick;

		/*
		while(xMoved != x || yMoved != y){

			if(tick()){
				xMoved += unitX;
				yMoved =+ unitY;
				this.source.style.left += unitX;
				this.source.style.top += unitY;
			}

		}
		*/

		xMoved += unitX;
		yMoved += unitY;
		this.source.style.left += unitX;
		this.source.style.top += unitY;
		//if haven't reached destination
		if(xMoved != x || yMoved != y)
			setTimeout(move(speed,x,y, false),timePerTick);

	};

	this.tick = function(){
		var currentTime = Date.getTime();
		if(currentTime < nextTickTime){
			return false;
		}
		else{
			nextTickTime = currentTime + timePerTick;
			return true;
		}
	};
})
.service('commandProcessor', ['backgroundService', 'characterService', function(backgroundService, characterService) {
	/// this service contains the functions for the actions to call
	console.log('commandProcessor initialized from app-services.js');
	this.execute = function($elem, $attr, $command) {
		$commandSplit = split(trim($command), " ");
		$commandLength = $commandSplit.length;
		if($commandLength < 1 || $commandLength > 3) {
			return false;
		}
		switch($commandSplit[0]) {
			case 'background': // background 1
				this.changeBackground($commandSplit[1]);
				break;
			case 'costume': // costume 3
				this.changeCostume($commandSplit[1]);
				return true;
				break;
			case 'endrepeat':
				// TODO
				return true;
				break;
			case 'hide': // hide
				this.hide($elem);
				return true;
				break;
			case 'move': // move up 3, move left 8
				switch($commandSplit[1]) {
					case 'down':
						this.move($elem, 0, -$commandSplit[2]);
						break;
					case 'left':
						this.move($elem, -$commandSplit[2], 0);
						break;
					case 'right':
						this.move($elem, $commandSplit[2], 0);
						break;
					case 'up':
						this.move($elem, 0, $commandSplit[2]);
						break;
				}
				return true;
				break;
			case 'repeat':
				// TODO
				return true;
				break;
			case 'set': // set x 312, set y 794
				if($commandSplit[1] == 'x') {
					this.setX($commandSplit[2]);
				} else if($commandSplit[1] == 'y') {
					this.setY($commandSplit[2]);
				}
				break;
			case 'show': // show
				this.show();
				return true;
				break;
		}
		
	};
	this.setX = function($elem, $xCoord) {
		console.log('setX was called from service.commandProcessor');
		// set the x coordinate of $elem to $xCoord
		
	};
	this.setY = function($elem, $yCoord) {
		console.log('setY was called from service.commandProcessor');
		// set the y coordinate of $elem to $yCoord
		
	};
	this.show = function($elem) {
		console.log('show was called from service.commandProcessor');
		// make the $elem visible
	};
	this.hide = function($elem) {
		console.log('hide was called from service.commandProcessor');
		// make the $elem invisible
	};
	this.move = function($elem, $xSteps, $ySteps) {
		console.log('move was called from service.commandProcessor');
		// smooth scroll the $elem by $xSteps steps on the x-axis
		// and $ySteps steps on the y-axis
		
	};
	this.changeCostume = function($elem, $costumeId) {
		console.log('changeCostume was called from service.commandProcessor');
		characterService.changeCostume($elem, $costumeId);
	};
	this.changeBackground = function($backgroundId) {
		console.log('changeBackground was called from service.commandProcessor');
		backgroundService.changeImage($backgroundId);
	};
	this.repeat = function($elem, $nTimes) {
		console.log('repeat was called from service.commandProcessor');
		// get the children of the elems and repeat it $nTimes times
		
	};
}])
.service('pageService', function() {
	/// this service provides the page meta data
	console.log('pageService initialized from app-services.js');
	this.title = 'Default Page Title';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});