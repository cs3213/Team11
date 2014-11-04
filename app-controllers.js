VisualIDE
.controller('actionController', ['$rootScope','$scope', '$http', 'commandProcessor','$modal',
	function($rootScope,$scope, $http, commandProcessor,$modal) {
	console.log('actionController initialized from app-controllers.js');
	$scope.actions = [
		'set x 24',
		'set y 50',
		'show',
		'hide',
		'move up 3',
		'costume 2',
		'background 1',
		'repeat 3',
		'move down 2',
		'move left 2',
		'move right 2',
		'move up 2',
		'endrepeat'
	];
	$scope.play = function() {
		//alert("todo!");
		console.log("attempting to play");
		//commandProcessor.parseCommands($rootScope.commandData);
		commandProcessor.play($rootScope.commandData);
	};
	$scope.save = function() {
		//alert("todo!");
		$http.get('/api/get').then(function(res){
			if(res.data == -2) {
				alert("You need to log in first before saving any data.");
			} else {
				var progName = window.prompt("Name to save as", "My First Game");
				$http({url:'/api/save', data:JSON.stringify({name: progName, content: JSON.stringify($rootScope.commandData)}),method:'POST'})
				.success(function(data, status, headers, config) {
				    // this callback will be called asynchronously
				    // when the response is available
				    var resultCode = JSON.parse(data);
				    switch (resultCode) {
				    	case 2:
				    		alert("Save successful");
				    		break;
				    	case 1:
				    		alert("Save updated");
				    		break;
				    	case -1:
				    		alert("Save error. Please try again later");
				    		break;
				    	case -2:
				    		alert("Save file already exists. Please try to save again with another name");
				    		break;
				    	default:
				    		alert("Save failed. Please try again later");
				    }
				}).
				error(function(data, status, headers, config) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    alert("Save failed. Please try again later");
				});
			}
		});
	};
	$scope.commandsInclude = "templates/commands.htm";
	$scope.items = [];

	$scope.open = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			$http.post('/api/load', {name:selectedItem.program_name}).then(function(res){
				console.log(res.data);
				$rootScope.commandData = JSON.parse(res.data.saved_data);                
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
}])
.controller('authController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	$scope.login = function() {
		alert("todo!");
	};
}])
.controller('backgroundController', ['$scope', function($scope) {
	console.log('backgroundController initialized from app-controllers.js');
	
}])
.controller('characterController', ['$scope', function($scope) {
	console.log('characterController initialized from app-controllers.js');
	$scope.click = function() {
		alert("Pikaaaaaaa!!!");
	};
}])
.controller('menuSidebarLeft', ['$scope', function($scope) {
	console.log('menuSidebarLeft initialized from app-controllers.js');
	
}])
.controller('menuSidebarRight', ['$scope', function($scope) {
	console.log('menuSidebarRight initialized from app-controllers.js');
	
}])
.controller('pageController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	
}])
.controller('pageMetaData', ['$scope','pageService', function($scope, pageService) {
	console.log('pageMetaData initialized from app-controllers.js');
	$scope.page = pageService;
}])
.controller('sidepanelAbout', function($scope) {
	console.log('sidepanelAbout initialized from app-controllers.js');
})
.controller('sidepanelHelp', function($scope) {
	console.log('sidepanelHelp initialized from app-controllers.js');
})
.controller('sidepanelMain', function($scope) {
	console.log('sidepanelMain initialized from app-controllers.js');
})
.controller('sidepanelObjectives', function($scope) {
	console.log('sidepanelObjectives initialized from app-controllers.js');
})
.controller('commandControl', function($scope, $element, $rootScope, $timeout) {
	console.log("controller element", $element);

	$scope.initInputElements = function(){
		$($element).find("input, select").change(function(){
			$scope.updateCommandData($scope);
		});
	}
	$scope.initInputElements();

	$scope.commandData = [];

	$scope.commandDraggableParams = {
        helper: "clone",
		revert: "invalid",
		connectToSortable: "#workspace, .command-inner-sortable",
		opacity: 0.7,
	};

	$scope.expressionDraggableParams = {
        helper: "clone",
		revert: "invalid",
		/*stack: ".command-element, .expr-element, .math-element, .cmp-element, .var-element"*/
		zIndex: 1000,
		opacity: 0.7,
	};

	$scope.workspaceSortableParams = {
		connectWith: "#workspace, .command-inner-sortable, #trash",
	    deactivate: function(event, ui){
	    	$scope = angular.element(event.target).scope();
	    	console.log($scope);
	        // We run this to apply the sortable to all the newly created sortables (created when you drag out the repeat)
	        $scope.initInnerSortables();
	        $scope.updateCommandData($scope);
	    }
	};

	$scope.trashSortableParams = {
		connectWith: "#workspace, .command-inner-sortable, #trash",
	    deactivate: function(event, ui){
	    	$(event.target).html('');
	    }
	};

	$scope.initInnerSortables = function(){
		$( "#workspace .command-inner-sortable" ).sortable({
    		connectWith: "#workspace, .command-inner-sortable, #trash",
		    deactivate: function(event, ui){
		    	$scope = angular.element(event.target).scope();
		        // We run this to apply the sortable to all the newly created sortables (created when you drag out the repeat)
		        $scope.initInnerSortables();
		        $scope.updateCommandData($scope);
		    }
		});

		$( "#workspace .expr-droppable" ).droppable({
			accept: ".expr-element, .cmp-element",
			greedy: true,
			activeClass: "droppable-active",
			hoverClass: "droppable-hover",
			tolerance: "pointer",
			drop: function( event, ui ) {
				var dropped = ui.draggable;
				dropped = dropped.clone();
				dropped.zIndex(0);
				//dropped.remove();
        		var droppedOn = $(this);
        		droppedOn.html("");
        		dropped.css({opacity: 1});  // hack to revert opacity which for some reason gets stuck
        		//droppedOn.append(dropped);        		
        		$(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
        		$scope.initInnerSortables();
        		//alert(dropped);
        		$scope.updateCommandData($scope);
        	},
		});

		$( "#workspace .math-droppable" ).droppable({
			accept: ".math-element, .var-element",
			greedy: true,
			activeClass: "droppable-active",
			hoverClass: "droppable-hover",
			tolerance: "pointer",
			drop: function( event, ui ) {
				var dropped = ui.draggable;
				dropped = dropped.clone();
				dropped.zIndex(0);
				//dropped.remove();
        		var droppedOn = $(this);
        		droppedOn.html("");
        		//droppedOn.append(dropped);   
        		dropped.css({opacity: 1});  // hack to revert opacity which for some reason gets stuck   		
        		$(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
        		$scope.initInnerSortables();
        		//alert(dropped);
        		$scope.updateCommandData($scope);
        	},
		});

		$("#workspace .expr-element, #workspace .math-element, #workspace .cmp-element, #workspace .var-element" ).draggable({
			revert: "invalid",
			zIndex: 1000,
			connectToSortable: "#trash",
			opacity: 0.7,
			stop: function( event, ui ) {
				ui.helper.remove(); // hack to remove helper, which for some reason remains stuck
			},
		});

		$scope.initInputElements();
	}

	// Code below is for serialization/deserialization
	$scope.updateCommandData = function($scope){
		var workspaceItems = $( "#workspace" ).children();

		var workspaceElement = $( "#workspace" );
		/*$scope.commandData = [];
		for (var i=0; i < workspaceItems.length; i++){
			$scope.$apply(function () {
				$scope.commandData[i] = $(workspaceItems[i]).html();
			});
		}*/
		$scope.$apply(function () {
			$scope.commandData = $scope.processCommandElements(workspaceElement);
			$rootScope.commandData = $scope.commandData;
		});

	}
	
	$scope.processCommandElements = function(element){

		var items = element.children();

		var commandData = [];
		for (var i=0; i < items.length; i++){
			var item = $(items[i]);

			var children = item.children();
			commandData[i] = {
				//title: item.text(),
				title: item.data("command"),
			}
			for (var j=0; j<children.length; j++){
				if ( $(children[j]).prop("tagName") == "INPUT" || $(children[j]).prop("tagName") == "SELECT" ) {
					var name = $(children[j]).attr("name");
					var value = $(children[j]).val();
					commandData[i][name] = value;
				}
				if ( typeof($(children[j]).data("exp-name")) !== "undefined"){
					var expName = $(children[j]).data("exp-name");
					commandData[i][expName] = $scope.processExpressionElements($(children[j]));
				}
			}

			if (item.hasClass("sub-commands-allowed")) {
				
				item.children(".command-inner-sortable").each( function(index, element) {
					commandData[i][$(element).data("name")] = $scope.processCommandElements($(element));
				});
				
			}
			
		}
		return commandData;
	}

	$scope.processExpressionElements = function(element){

		element = element.children(".expr-element, .cmp-element, .math-element, .var-element");
		console.log(element);

		if (typeof(element) === "undefined" || element.length == 0) {
			return {};
		}

		var returnVal = {
			expTitle: element.data("command"),
		}
		var children = element.children();
		for (var i=0; i<children.length; i++){
			if ( $(children[i]).prop("tagName") == "INPUT" || $(children[i]).prop("tagName") == "SELECT" ) {
				var name = $(children[i]).attr("name");
				var value = $(children[i]).val();
				returnVal[name] = value;
			}

			var expName = $(element).data('exp-name');
			if ( typeof($(children[i]).data("exp-name")) !== "undefined"){
				var expName = $(children[i]).data("exp-name");
				returnVal[expName] = $scope.processExpressionElements($(children[i]));
			}
		}
		return returnVal;
	}

	$scope.populateCommandElements = function(commandData, rootElement){
		console.log(commandData, rootElement);

		// In case users save with empty command blocks (e.g. empty repeat block)
		if (typeof (commandData) === "undefined") {
			return;
		}

		for (var i=0; i<commandData.length; i++){
			var c = commandData[i];
			console.log("c", c);
			var toolboxItem = $(".command-toolbox, .expr-toolbox").find("li[data-command|='"+c.title+"']");
			var item = $(toolboxItem).clone();
			var children = item.children();
			for (var j=0; j<children.length; j++){
				var inputElement = children[j];
				if ( $(inputElement).prop("tagName") == "INPUT" || $(inputElement).prop("tagName") == "SELECT" ) {
					var attributeName = $(inputElement).attr("name");
					$(inputElement).val(commandData[i][attributeName]);
				}
				if ( typeof($(children[j]).data("exp-name")) !== "undefined"){
					var expName = $(children[j]).data("exp-name");
					$scope.populateExpressionElements(commandData[i][expName], $(children[j]));
				}
			}
			if (item.hasClass("sub-commands-allowed")) {

				item.children(".command-inner-sortable").each( function(index, element) {
					$(element).html("");
					$scope.populateCommandElements(commandData[i][$(element).data("name")], $(element));
				});				
				
			}
			$(rootElement).append(item);
		}
	}

	$scope.populateExpressionElements = function(commandData, rootElement){
		var c = commandData;
		var toolboxItem = $("#expr-toolbox").find("li[data-command|='"+c.expTitle+"']");
		var item = $(toolboxItem).clone();
		var children = item.children();
		for (var j=0; j<children.length; j++){
			var inputElement = children[j];
			if ( $(inputElement).prop("tagName") == "INPUT" || $(inputElement).prop("tagName") == "SELECT" ) {
				var attributeName = $(inputElement).attr("name");
				$(inputElement).val(commandData[attributeName]);
			}
			if ( typeof($(children[j]).data("exp-name")) !== "undefined"){
				var expName = $(children[j]).data("exp-name");
				$scope.populateExpressionElements(commandData[expName], $(children[j]));
			}
		}
		$(rootElement).append(item);
	}

	$scope.refresh = function(){
		//console.log($("#inputTextArea").val());
		console.log($scope.commandData);

		$("#workspace").html("");
		$scope.populateCommandElements($scope.commandData, $("#workspace"));

		$scope.initInnerSortables();
		$scope.initInputElements();

		// Hack to prevent two $apply from running simultaneously
		setTimeout(function(){
			$scope.updateCommandData($scope)
		}, 1);
	}

	$scope.$watch(function() {		
		if ($rootScope.commandData && ($scope.commandData !== $rootScope.commandData)){
			console.log($rootScope);
			$scope.commandData = $rootScope.commandData;
			$scope.refresh();
		}
	});

})

.controller('ModalDemoCtrl', function ($scope, $rootScope, $modal, $log, $http) {

	$scope.items = [];

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			$http.post('/api/load', {name:selectedItem.program_name}).then(function(res){
				console.log(res.data);
				$rootScope.commandData = JSON.parse(res.data.saved_data);                
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
})

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $http) {

	$scope.items = items;
	$http.get('/api/get').then(function(res){
		if(res.data == -2) {
			$scope.items = undefined;
		} else {
			$scope.items = res.data;
		}
	});

	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
})