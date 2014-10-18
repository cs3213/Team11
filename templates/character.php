<a ng-click="click()">
	<img id="{{ current.id }}" name="{{ current.name }}"
		src="/assets/images/costumes/{{ current.source }}.png"
		style="visibility:{{current.visibility}};top:{{current.top}};left:{{current.left}};bottom:0;position:absolute;z-index:1;width:{{ current.scale*4 }}px;">
</a>
