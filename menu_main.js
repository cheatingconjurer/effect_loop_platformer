window.onload = function() {
	selected_level=1
	MAX_LEVEL=5
	co=c.getContext("2d")
	menu=createMenu()
	playBtn=new Image();
	playBtn.src="sprites/menu/playBtn.png";
	playBtnHover=new Image();
	playBtnHover.src="sprites/menu/playBtnHover.png";
	backToMenu= new Image();
	backToMenu.src="sprites/menu/backToMenuBtn.png";
	backToMenuHover= new Image();
	backToMenuHover.src="sprites/menu/backToMenuHover.png";
	playLevel=new Image();
	playLevel.src="sprites/menu/playLevelBtn.png";
	playLevelHover=new Image();
	playLevelHover.src="sprites/menu/playLevelHover.png";
	prevBtn=new Image();
	prevBtn.src="sprites/menu/prevBtn.png";
	prevHover=new Image();
	prevHover.src="sprites/menu/prevHover.png";
	nextBtn=new Image();
	nextBtn.src="sprites/menu/nextBtn.png";
	nextHover=new Image();
	nextHover.src="sprites/menu/nextHover.png"; 
	
	title_screen_button_list=[
		createMenuButton(window.innerWidth/2-160,window.innerHeight/2-40,320,80,function(){menu.changeButtonList(level_select_button_list)},
			function(x,y){co.drawImage(playBtn,x,y,320,80)},
			function(x,y){co.drawImage(playBtnHover,x,y,320,80)},),
	]
	level_select_button_list=[
		createMenuButton(650,50,320,80,function(){menu.changeButtonList(title_screen_button_list)},
			function(x,y){co.drawImage(backToMenu,x,y,320,80)},
			function(x,y){co.drawImage(backToMenuHover,x,y,320,80)},),
		createMenuButton(650,150,160,80,function(){if(selected_level>1){selected_level--}},
			function(x,y){co.drawImage(prevBtn,x,y,160,80)},
			function(x,y){co.drawImage(prevHover,x,y,160,80)},),
		createMenuButton(850,150,160,80,function(){if(selected_level<MAX_LEVEL){selected_level++}},
			function(x,y){co.drawImage(nextBtn,x,y,160,80)},
			function(x,y){co.drawImage(nextHover,x,y,160,80)},),
		createMenuButton(650,250,320,80,function(){window.location.href="./canvas.html?lvl="+selected_level},
			function(x,y){co.drawImage(playLevel,x,y,320,80)},
			function(x,y){co.drawImage(playLevelHover,x,y,320,80)},),
	]
	menu.changeButtonList(title_screen_button_list)
	onmousemove=function(e){menu.onMouseMoveSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	onmousedown=function(e){menu.onClickSomewhere(e.pageX*c.width/window.innerWidth,e.pageY*c.height/window.innerHeight)}
	function menu_draw(){menu.draw();requestAnimationFrame(menu_draw);}
	menu_draw();
	
}
