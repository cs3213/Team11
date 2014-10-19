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
.service('characterService', function($interval, $timeout, $rootScope) {
	/// this service provides the character
	console.log('characterService initialized from app-services.js');
	var nextTickTime = 0;
	var timePerTick = 50;
	var xMoved = 0;
	var yMoved = 0;
	var currentX = 0;
	var currentY = 0;
	var delay = 0;

	this.costumes = [
		'pikachu',
	];
	this.config = {
		'id'		: 0,
		'name'		: 'default',
		'scale'		: 50,
		'source'	: this.costumes[0],
	};
	this.changeCostume = function($elem,$costumeId, next) {
		console.log('characterService.changeCostume() called');
		// change the templateUrl of the elem to the dataCostume[costumeId]
		this.config.source = this.costumes[$costumeId];
		next();
	};
	this.create = function($id,$name,$scale,$costumeId, next) {
		console.log('characterService.create() called');
		return {
			'id' 		: $id,
			'name'		: $name,
			'scale'		: $scale,
			'source'	: this.costumes[$costumeId],
		};
	};

	this.reposition = function ($xCoord, $yCoord, next){
		console.log("characterService.repositon() called");
		this.config.left = xCoord;
		this.config.top = yCoord;
		currentX = xCoord;
		currentY = yCoord;
		next();
	};

	this.setX = function(xCoord, next){
		console.log("characterService.setX() called: " + xCoord);
		this.config.left = xCoord;
		currentX = xCoord;
		next();
	};

	this.setY = function(yCoord, next){
		console.log("characterService.setY() called:" + yCoord);
		this.config.top = yCoord;
		currentY = yCoord;
		next();
	};

	this.hide = function(next){
		console.log("characterService.hide() called");
		this.config.visibility = "hidden";	
		next();
	};

	this.show = function(next){
		console.log("characterService.show() called");
		this.config.visibility = "visible";
		next();
	};
	//speed : pixels per second?
	this.move = function(speed, x, y, next){
		console.log("characterService.move() called");

		// Currently only movement in x direction implemented!

		var timeInterval = 20; // 20 milliseconds
		var fps = 1000/timeInterval;

		var pixelsPerFrame = speed/fps;
		var numFrames = Math.round(Math.abs(x/pixelsPerFrame));

		this.moveHelper(pixelsPerFrame, y, numFrames, timeInterval, next)

		
	};

	this.moveHelper = function(x, y, framesRemaining, timeInterval, next) {
		console.log("movehelper is called", x, y, framesRemaining, timeInterval, next);
		this.setX (currentX += x, function(){});
		framesRemaining--;
		if (framesRemaining > 0) {
			var that = this;
			$timeout(function(){
				that.moveHelper(x, y, framesRemaining, timeInterval, next);
			}, timeInterval);
		}else{
			next();
		}
	}

})
.service('commandProcessor', ['$interval', '$timeout','backgroundService', 'characterService', function($interval, $timeout, backgroundService, characterService) {
	/// this service contains the functions for the actions to call
	console.log('commandProcessor initialized from app-services.js');
	
	var commandsInterval = 1000;

	this.parseCommands = function(commands){
		console.log(commands);

		this.parseCommandAndExecute(commands.slice(0), function(){
			console.log("animation complete!");
		});
		
	};
	
	this.parseCommandAndExecute = function(commands, afterCommandsFunction){
		//var pixelsPerStep = 5;
		var that = this;

		console.log(commands);

		if (commands.length == 0){
			// No more commands!
			// Run afterCommandsFunction
			afterCommandsFunction();
			return;
		}

		var cmd = commands.shift();
		var nextCommandProcessor = function(){
			$timeout(function(){
				that.parseCommandAndExecute(commands, afterCommandsFunction);
			}, 1000);
		}

		var pass = true;

		if (typeof cmd !== 'undefined' && typeof cmd.title !== 'undefined') {

			switch(cmd.title){
				case 'setX':
					console.log("setX: " + cmd.x);
					pass = characterService.setX(cmd.x, nextCommandProcessor);
					break;
				case 'setY':
					console.log("setY: " + cmd.y);
					pass = characterService.setY(cmd.y, nextCommandProcessor);
					break;
				case 'show':
					console.log("show");
					pass = characterService.show(nextCommandProcessor);
					break;
				case 'hide':
					console.log("hide");
					pass = characterService.hide(nextCommandProcessor);
					break;
				case 'move':
					console.log("move:" + cmd.count);
					pass = characterService.move(50,cmd.count,0,nextCommandProcessor);
					break;
				case 'changeBackground': // background 1
					pass = this.changeBackground(cmd.costume, nextCommandProcessor);
					break;
				case 'changeCostume': // costume 3
					pass = this.changeCostume(cmd.costume, nextCommandProcessor);
					return true;
					break;
				case 'repeat':
					//pass = this.parseRepeat(cmd.commands, cmd.count, nextCommandProcessor);
					
					/*
					var that = this;

					if (cmd.count > 0) {
						this.parseCommandAndExecute(cmd.commands, function(){							
							console.log(cmd.commands, cmd.count);
							that.parseCommandAndExecute([{
								title: 'repeat',
								count: cmd.count-1,
								commands: cmd.commands.slice(0) // we must clone the array
							}]);
						});
					}*/
					for (var i=0; i<cmd.count; i++){
						commands = cmd.commands.concat(commands);
					}
					this.parseCommandAndExecute(commands, afterCommandsFunction);

					/*
					if (typeof extra !== 'undefined')

					this.parseCommandAndExecute(cmd.commands, function(){
						this.parseCommandAndExecute(cmd.commands
						nextCommandProcessor();
					});
					*/
					break;
			}

		}
		return pass;
	};

	this.changeCostume = function($elem, $costumeId, next) {
		console.log('changeCostume was called from service.commandProcessor');
		characterService.changeCostume($elem, $costumeId);
		next();
	};
	this.changeBackground = function($backgroundId, next) {
		console.log('changeBackground was called from service.commandProcessor');
		backgroundService.changeImage($backgroundId);
		next();
	};
	
	/*
	this.parseRepeat = function(commands, count, next) {
		var cmd = commands.shift();
		this.parseCommandAndExecute(cmd, commands);
	}
	*/

}])
.service('pageService', function() {
	/// this service provides the page meta data
	console.log('pageService initialized from app-services.js');
	this.title = 'VisualIDE';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});