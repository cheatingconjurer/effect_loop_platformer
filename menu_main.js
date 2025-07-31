window.onload = function() {
	co=c.getContext("2d")
	menu=createMenu()
	title_screen_button_list=[
		createMenuButton(760,100,80,50,function(){alert("works")},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("play",x,y,80)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("play",x,y,80)}),
	]
	menu.changeButtonList(title_screen_button_list)
	onmousemove=function(e){menu.onMouseMoveSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	onmousedown=function(e){menu.onClickSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	function menu_draw(){menu.draw();requestAnimationFrame(menu_draw);}
	menu_draw();
	
}