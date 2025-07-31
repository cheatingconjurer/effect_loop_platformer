window.onload = function() {
	selected_level=1
	MAX_LEVEL=5
	co=c.getContext("2d")
	menu=createMenu()
	title_screen_button_list=[
		createMenuButton(760,100,80,50,function(){menu.changeButtonList(level_select_button_list)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("play",x,y,80)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("play",x,y,80)}),
	]
	level_select_button_list=[
		createMenuButton(650,0,320,50,function(){menu.changeButtonList(title_screen_button_list)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("back to main menu",x,y,320)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("back to main menu",x,y,320)}),
		createMenuButton(700,100,80,50,function(){if(selected_level>1){selected_level--}},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("prev",x,y,80)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("prev",x,y,80)}),
		createMenuButton(820,100,80,50,function(){if(selected_level<MAX_LEVEL){selected_level++}},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("next",x,y,80)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("next",x,y,80)}),
		createMenuButton(700,200,220,50,function(){window.location.href="./canvas.html?lvl="+selected_level},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="black";co.fillText("play level "+selected_level,x,y,220)},
			function(x,y){co.textBaseline="top";co.font="50px Arial";co.fillStyle="blue";co.fillText("play level "+selected_level,x,y,220)}),
	]
	menu.changeButtonList(title_screen_button_list)
	onmousemove=function(e){menu.onMouseMoveSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	onmousedown=function(e){menu.onClickSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	function menu_draw(){menu.draw();requestAnimationFrame(menu_draw);}
	menu_draw();
	
}