/*----------------------------
 * 
 *--------------------------*/

 /* on load     *//*
$(document).ready(function(){
	polygonEvent();
	dotEvent();
	checkEvent();
	c_selector_btn_event();
	c_close_btn_event();
	c_locat_btn_Event();
	c_search_add_to_criteria_event();
	floor_left_nav_event();
	loadMap(1);
	load_book_shelf();
	$('.dot').eq(1).addClass('active');
});*/
/*----------------------------
 * map related
 *--------------------------*/
/* polygon area event */
var svg_view_obj = null;
function polygonEvent(){
	$('.floor_sections').on({
		mouseover: function () {
			$('p.floor_parts_detail').text("Circulation Collection "+$(this).attr('alt'));
			$('p.floor_parts_detail').stop(true,false).animate({width: "toggle", opacity: "toggle"},"fast");
		}, 
		mouseout: function () {
			$('p.floor_parts_detail').stop(true,true).animate({width: "toggle", opacity: "toggle"},"fast");
		}
	}, "svg polygon");
}
function checkEvent(){
	$('.floor_sections').on({
		"dblclick click": function(){
			var items = $('p.floor_check_detail');
			if(items.css("display")!="none"&&items.css("opacity")!="0"){
				items.css({"display":"none"});	
			}
			var text_to_show = "";
			var locat = $(this).attr('id');
			var pos = exist_component_locat(locat); // arr of locat
			
			//console.log(pos,pos.length,locat,items);
			if(pos != -1){
				for(i=0; i<pos.length; i++){
					if(i!=0) text_to_show += "<br />";
					text_to_show += criteria_arr[pos[i]].title;
					//console.log(i,text_to_show,criteria_arr[pos[i]].title);
				}
				items.html(text_to_show);
				items.stop(true,false).animate({width: "toggle", opacity: "toggle"},"fast",function(){
					items.stop(true,true).animate({width: "toggle", opacity: "toggle"},10000);
				});
			}
		}
	}, "svg g.svg-pan-zoom_viewport rect");
	// test tap event
	/*var chammer = new Hammer($("svg g.svg-pan-zoom_viewport rect"), {
					inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
				});
	chammer.get('tap').set({enable: true});
	chammer.on('tap', function(ev){
		$('p.floor_check_detail').text(""+$(this).attr('id'));
		$('p.floor_check_detail').stop(true,false).animate({width: "toggle", opacity: "toggle"},"fast",function(){
			$('p.floor_check_detail').stop(true,true).animate({width: "toggle", opacity: "toggle"},10000);
		});
	});*/
	
}
function c_locat_btn_Event(){
	$('#criteria').on({
		click: function(){
			var pos = exist_component($(this).parent().siblings().eq(0).text());
			var x = parseFloat($('#'+criteria_arr[pos].locat[0]).attr('x'));
			var y = parseFloat($('#'+criteria_arr[pos].locat[0]).attr('y'));
			panZoom_to_locat(x, y);
			//criteria_arr[k].locat.length
			show_map_not_detail();
			$('html, body').animate({
				scrollTop: $('#floor_contents_center').offset().top
			}, 800, function(){
				//window.location.hash = '#floor_contents_center';
			});
		}
	}, '.btn_locat');
	$('#criteria').on({
		click: function(){
			console.log('criteria search:', $(this).text());
			c_query_book_detail($(this).text(), 'title');
			show_detail_not_map();
		}
	}, 'td:nth-child(2)');
}
function panZoom_to_locat(x, y){
	//console.log(svg_view_obj.getSizes().height/2, - parseFloat($(this).attr('y')), svg_view_obj.getSizes().realZoom);
	svg_view_obj.zoom(2);
	svg_view_obj.pan({
		x: (svg_view_obj.getSizes().width/2 - x * svg_view_obj.getSizes().realZoom),
		y: (svg_view_obj.getSizes().height/2 - y * svg_view_obj.getSizes().realZoom)
	});	
}
function dotEvent(){
	$('.dot').on({click: function(){
		loadMap($(this).attr('alt'));
		var items = $('p.floor_number_detail');
		if(items.css("display")!="none"&&items.css("opacity")!="0"){
			items.css({"display":"none"});	
		}
		items.text($(this).attr('alt')+"/F");
		items.stop(true,false).animate({width: "toggle", opacity: "toggle"},"fast",function(){
			items.stop(true,true).fadeOut(3000);
		});
		$('.dot').removeClass('active');
		$(this).addClass("active");
	}});
}
/* create svg pan zoom */
function createSvgPanZoom(number){
	return svgPanZoom('#floor_number'+number+'_svg', {
		controlIconsEnabled: true,
		maxZoom: 3,
		minZoom: 0.7,
		dblClickZoomEnabled: false,
		beforePan: function(oldPan, newPan){
          var stopHorizontal = false
            , stopVertical = false
            , gutterWidth = 250
            , gutterHeight = 150
              // Computed variables
            , sizes = this.getSizes()
            , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
            , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
            , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
            , bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
          customPan = {}
          customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
          customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))

          return customPan
        },
		customEventsHandler: {
				haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
			, init: function(options) {
				var instance = options.instance
				, initialScale = 1
				, pannedX = 0
				, pannedY = 0

				// Init Hammer
				// Listen only for pointer and touch events
				this.hammer = Hammer(options.svgElement, {
					inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
				})

				// Enable pinch
				this.hammer.get('pinch').set({enable: true})
/*
				// Handle double tap
				this.hammer.on('doubletap', function(ev){
					instance.zoomIn()
				})*/

				// Handle pan
				this.hammer.on('panstart panmove', function(ev){
				// On pan start reset panned variables
				if (ev.type === 'panstart') {
					pannedX = 0
					pannedY = 0
				}

				// Pan only the difference
				instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
					pannedX = ev.deltaX
					pannedY = ev.deltaY
				})

				// Handle pinch
				this.hammer.on('pinchstart pinchmove', function(ev){
				// On pinch start remember initial zoom
					if (ev.type === 'pinchstart') {
						initialScale = instance.getZoom()
						instance.zoom(initialScale * ev.scale)
					}

					instance.zoom(initialScale * ev.scale)

				})

				// Prevent moving the page on some devices when panning over SVG
				options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
			}

			, destroy: function(){
				this.hammer.destroy()
			}
				
		}
	});
}
/* ajax load map */
function loadMap(number){
	$("#floor_section").load("./images/floor_number"+number+"_plain_path.svg", function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success"){
            //alert("External content loaded successfully!");
			svg_view_obj = createSvgPanZoom(number);
			$('svg').addClass('w3-animate-opacity');
			reload_all_locat_in_arr();
			//blink_id('LC1');
			//blink_start($('#QA1, #MA1'));
		} else if(statusTxt == "error"){
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		}
	});	
}
/* blink a checker */
function blink_id(id) {
	$('#'+id).stop().animate({opacity:"toggle"},"slow",function(){blink_id(id);});
}
function blink() {
	$('.blink').stop().animate({opacity:"toggle"},"slow",function(){blink();});
}
function blink_start(items){
	blink_stop(items);
    items.addClass("blink");
	blink();
}
function blink_stop(items){
	items.stop(false,false).removeClass("blink");
	if(items.css("display")=="none"||items.css("opacity")!="1")
		items.css({"display":"", "opacity":"1"});
}
/*----------------------------
 * right panel related
 *--------------------------*/
/* criteria searcher */
var criteria_arr = [];
function component(title, color, locat, cat) {
    this.title = title;
	this.color = color; //"rgb(255, 255, 255)"
	this.locat = locat;
	this.cat = cat;
	//this.horiChange = function(c){this.hori = c;}
}
function create_component(title, color, locat, cat){
	//if(exist_component(title) == -1){
		criteria_arr.push(new component(title,color,locat,cat));
		console.log(title,"created,\nlength:",criteria_arr.length,"\ncolor:",color,"\nlocat:",locat,"\ncategory:",cat);
	//}
}
function delete_component(title){
	console.log("length before delete:" + criteria_arr.length);
	var pos = exist_component(title);
	if(pos != -1){
		for(i=0; i<criteria_arr[pos].locat.length; i++){
			blink_stop($('#'+criteria_arr[pos].locat[i])); // locat may be array
			$('#'+criteria_arr[pos].locat[i]).css("fill","aqua");
		}
		// set back css background-color to aqua
		console.log(title+" at pos: "+criteria_arr[pos].locat[0]+"\n"+criteria_arr[pos].color);
		criteria_arr.splice(pos, 1);
		console.log("length after delete:" + criteria_arr.length);
		reload_all_locat_in_arr();
		return;
	}
	console.log("Nothing deleted");
}
function reload_all_locat_in_arr(){
	for(k=0; k<criteria_arr.length; k++){
		for(i=0; i<criteria_arr[k].locat.length; i++){
			blink_start($('#'+criteria_arr[k].locat[i])); // locat may be array
			$('#'+criteria_arr[k].locat[i]).css("fill",criteria_arr[k].color);
			console.log("Reload:"+criteria_arr[k].locat[i]+"  "+criteria_arr[k].color);
		}
	}		
}

function exist_component(title){
	console.log("exist_component", title);
	for(i=0; i<criteria_arr.length; i++){
		if(criteria_arr[i].title==title){
			console.log(title+" exist at:" + i);
			return i;
		}
	}
	console.log(title+" not exist");
	return -1;
}
function exist_component_locat(locat){
	var arr = [];
	var exist = false;
	for(i=0; i<criteria_arr.length; i++){
		for(k=0; k<criteria_arr[i].locat.length; k++){
			if(criteria_arr[i].locat[k]==locat){ // locat may be array
				console.log(locat+" exist with pos:" + i);
				arr.push(i);
				exist = true;
				//return i;
			}
		}
	}
	if(exist){
		return arr;
	} else {
		console.log(locat+" not exist book");
		return -1;
	}
}
function c_close_btn_event(){
	$('#criteria').on({
		click: function(){
			delete_component($(this).parent().siblings().eq(1).text());
			//alert($(this).parent().siblings().eq(1).text());
			$(this).parentsUntil('tbody').eq(1).remove();
		}
	}, '.close');
}
function c_search() {
    var input, filter, tr, td;
    input = $("#c_searcher input");
    filter = input.val().toUpperCase();
    tr = $("#c_searcher tr");
    for (i = 0; i < tr.length; i++) {
		td = tr.eq(i).children("td");
		if(td){
			if (td.html().toUpperCase().indexOf(filter) > -1) {
				tr.eq(i).css({"display":""});
			} else {
				tr.eq(i).css({"display":"none"});
			}
		}
    }
}
function c_selector_btn_event(){
	$('#c_selector button').on({
		click: function(){
			// on selected item query to php to sql
			//$('#c_selector button').css({"background-color":""});
			//$(this).css({"background-color":"red"});
			$('#c_selector button').removeClass('active');
			$(this).addClass("active");
			c_searcher_get_data_list($(this).val());
			$('html, body').animate({
				scrollTop: $('#c_searcher').offset().top
			}, 800, function(){
				//window.location.hash = '#c_search';
			});
		}
	});
}
function c_searcher_get_data_list(input){
	var t;
	if($('#book_detail tbody tr').length){
		t = $('#book_detail tbody tr:nth-child(3) td:nth-child(2)').text();
		console.log("with book detail: ", t);
	} else {
		t = "0";
		console.log("no book selected", t);
	}
	$.post('./php/floor_c_searcher.php', {
		keyword:  input,
		title: t
	}, function(data, status){
		if(data){
			//console.log(data);
			$('#c_searcher tbody').empty().append(data);
		} else {
			$('#c_searcher tbody').empty();
		}
	});
}
function c_search_add_to_criteria_event(){
	$('#c_searcher_table').on({
		click: function(){
			var the_text = $(this).siblings(0).text();
			if(exist_component(the_text)==-1){
				c_search_add_to_criteria(the_text, $('#c_selector button.active').val());
			}
			// location in the array return blink 
		}
	},'td:last-child');
	$('#c_searcher_table').on({
		click: function(){
			var input = $(this).text(); // category need to add 372
			//console.log($('#c_selector button.active').val(), $(this).text());
			if ($('#c_selector button.active').val()=="tag" || $('#c_selector button.active').val()=="subj"){
			console.log($('#c_selector button.active').val());
				$.post('./php/floor_c_searcher.php', {
					keyword:  "tagToTitle",
					title: input
				}, function(data, status){
					if(data){
						//console.log(data);
						$('#c_searcher tbody').empty().append(data);
					} else {
						$('#c_searcher tbody').empty();
					}
					$('#c_selector button').removeClass('active');
					$('#c_selector #title_btn').addClass("active");
				});
			} else if ($('#c_selector button.active').val()=="author"){
			//console.log($('#c_selector button.active').val());
				$.post('./php/floor_c_searcher.php', {
					keyword:  "authorToTitle",
					title: input
				}, function(data, status){
					if(data){
						//console.log(data);
						$('#c_searcher tbody').empty().append(data);
					} else {
						$('#c_searcher tbody').empty();
					}
					$('#c_selector button').removeClass('active');
					$('#c_selector #title_btn').addClass("active");
				});
			} else{
			c_query_book_detail(input, 'title');
			show_detail_not_map();
			$('html, body').animate({
				scrollTop: $('#book_detail').offset().top
			}, 800, function(){
				//window.location.hash = '#book_detail';
			});
			//c_query_book_tag(input);
			}
		}
	},'td:first-child');
}//
function c_search_add_to_criteria(t, cat){
	console.log("add_to_criteria", t, cat);
	var n_tr = "<tr></tr>";
	var n_td_btn = "<button type='button' class='btn btn-default btn-block btn_locat'></button>";
	var n_td_x = "<span class='close glyphicon glyphicon-trash'></span>";
	$('#criteria table tbody').append("<tr><td>"+n_td_btn+"</td><td>"+t+"</td><td>"+n_td_x+"</td></tr>");
	var r = Math.floor((Math.random() * 255) + 0);
	var g = Math.floor((Math.random() * 255) + 0);
	var b = Math.floor((Math.random() * 255) + 0);
	$('#criteria table tbody tr:last-child button').css({"background-color":"rgb("+r+","+g+","+b+")"});	
	// location id check rgb(r,g,b);
	c_search_get_data_location(t,cat,r,g,b);
}
function c_search_get_data_location(input, cat, r, g, b){
	// return a array of location
	console.log("c_search_get_data_location", input);
	$.post('./php/floor_criteria_add.php', {
		keyword:  input,
		category: cat
	}, function(data, status){
		if(data!=0){
			var arr = JSON.parse(data);
			
			if(arr != 0){
				// fill color at all location
				for(i=0; i<arr.length; i++){
					console.log(arr[i]);
					blink_start($('#'+arr[i]));
					$('#'+arr[i]).css({"fill":"rgb("+r+","+g+","+b+")"});
				}
				create_component(input, "rgb("+r+", "+g+", "+b+")", arr, cat);
			//component define here
			//alert(criteria_arr[0].title+" "+criteria_arr[0].color+" "+criteria_arr[0].locat[0].Location+" "+criteria_arr[0].locat[1].Location);
			}
		}
	});
}
function add_to_criteria_with_locat(arr){
	var n_tr = "<tr></tr>";
	var n_td_btn = "<button type='button' class='btn btn-default btn-block btn_locat'></button>";
	var n_td_x = "<span class='close glyphicon glyphicon-trash'></span>";
	var r, g, b;
	for(i=0; i<arr.length; i++){
		t = arr[i].Title;
		l = arr[i].Location;
		if(exist_component(t)==-1){
			$('#criteria table tbody').append("<tr><td>"+n_td_btn+"</td><td>"+t+"</td><td>"+n_td_x+"</td></tr>");
			r = Math.floor((Math.random() * 255) + 0);
			g = Math.floor((Math.random() * 255) + 0);
			b = Math.floor((Math.random() * 255) + 0);
			$('#criteria table tbody tr:last-child button').css({"background-color":"rgb("+r+","+g+","+b+")"});	
			
			//console.log(arr[i].Location);
			blink_start($('#'+l));
			$('#'+l).css({"fill":"rgb("+r+","+g+","+b+")"});
			var temp = [];
			temp.push(l);
			create_component(t, "rgb("+r+", "+g+", "+b+")", temp, 'title');
		}
	}
	//console.log("add_to_criteria_with_locat ends");
	
}
function reload_add_to_criteria_with_locat(){
	var n_tr = "<tr></tr>";
	var n_td_btn = "<button type='button' class='btn btn-default btn-block btn_locat'></button>";
	var n_td_x = "<span class='close'>X</span>";
	var arr = criteria_arr;
	for(i=0; i<arr.length; i++){
		t = arr[i].title;
		l = arr[i].locat;
		c = arr[i].color;
		$('#criteria table tbody').append("<tr><td>"+n_td_btn+"</td><td>"+t+"</td><td>"+n_td_x+"</td></tr>");
		$('#criteria table tbody tr:last-child button').css({"background-color":c});		
	}
}
/*----------------------------
 * book detail
 *--------------------------*/
function c_query_book_detail(input, cat){
	$.post('./php/book_query.php', {
		keyword:  input,
		category: cat
	}, function(data, status){
		if(data){
			//var arr = JSON.parse(data);
			//if(arr != 0){
			$('#book_detail tbody').empty().append(data);
			loadTag($('#book_detail tbody tr:nth-child(2) td:nth-child(2)').text());
			//loadComment();
			//}
		}
	});	
}
function loadTag(number){
	$("#book_tag").load("./tagindex.html", function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success"){
            //alert("External content loaded successfully!");

		} else if(statusTxt == "error"){
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		}
	});	
}
function book_tag_event(){
$(document).on("click",".fb",function(){
            $.ajax({
				
                type: "POST",
                url: "./php/gitag.php",
                dataType:"json",
                data: { bookid: $('#book_detail tbody tr:nth-child(2) td:nth-child(2)').text(), tag:this.value},
                success: function(data) {
                        console.log(data);
                        $("#hiiamjoe").html(data.msg);
                },
                error: function(jqXHR) {
                alert("error: " + jqXHR.status);
            }

            });

        });
        $(document).on("click",".sb",function(){
            $value=this.value;
            $ID=this.id;
            if(this.id!="plus"){ 
                $('#book_tag :button').attr("disabled", true);
            }            
            //$("#"+$ID).prop("disabled",true);
            $.ajax({
                type: "POST",
                url: "./php/gitag.php",
                dataType:"json",
                data: { bookid: $('#book_detail tbody tr:nth-child(2) td:nth-child(2)').text(), tag:this.value},
                success: function(data) {
                    
                        $('#book_tag :button').attr("disabled", false);
                        if(data.action=="replace") {
                            $("#"+$ID).replaceWith(data.msg);
                        } else if(data.action=="append"){
                            $("#hiiamjoe").append(data.msg);
                        }
            }
            });
        });
         $(document).on("click","#AddANewTag",function(){
            
             if($("#newTag").val()!=""){
                 $('#book_tag :button').attr("disabled", true);
                 //$("#"+this.id).prop("disabled",true);
                 $newTag=$("#newTag").val();
                $.ajax({
                    type: "POST",
                    url: "./php/gitag.php",
                    dataType:"json",
                    data: { bookid: $('#book_detail tbody tr:nth-child(2) td:nth-child(2)').text(), tag:$newTag, plus:''},
                    success: function(data) {
                        $('#book_tag :button').attr("disabled", false);
                        alert("New Tag Is Added!!!");
                        $("#addInput").remove();
                        if(data.action=="replace") {
                            $("#"+data.id).replaceWith(data.msg);
                        } else if(data.action=="append"){
                            $("#plus").replaceWith(data.msg);
                        }

                    },error: function(jqXHR) {
                alert("error: " + jqXHR.status);
            }
                    
                });
            }
        });
}
function loadComment(){
	t = $('#book_detail tbody tr:nth-child(2) td:nth-child(2)').text();
/*	$.get('./php/bookinfo.php?bookid='+t+"&pagex=1", function(data, status){
		if(data){
			$('#book_comment').empty().append(data);
		}
	});	*/
	window.open('./comment/bookinfo.php?bookid='+t+'&pagex=1');
}

/*----------------------------
 * nav 
 *--------------------------*/
function w3_open(){
	$('#mySidenav').css('display','block');
}
function w3_close(){
	$('#mySidenav').css('display','none');
}
function floor_left_nav_event(){
	$('.floor_left').on({
		click: function(){
			
			//console.log($(this).attr('id'));
			switch($(this).attr('id')){
				case "tab_book_detail":
					show_detail_not_map();
					break;
				case "tab_map":
					show_map_not_detail();
					break;
				case "tab_save":
					save_to_book_shelf();
					break;
				case "tab_load":
					load_book_shelf();
					break;
				case "tap_logout":
					break;
			}
			w3_close();
		}
	},'a:not(":first-Child")');	 
}
function show_map_not_detail(){
	$('.floor_center').css({'display':'none'});
	$('#floor_contents_center').css("display","");	 
}
function show_detail_not_map(){
	$('.floor_center').css({'display':'none'});
	$('#floor_contents_center_book_detail').css('display','');
}
function save_to_book_shelf(){
	var arr = [];
	for(i=0; i<criteria_arr.length;i++){
		if(criteria_arr[i].cat=="title"||criteria_arr[i].cat=="rank"||criteria_arr[i].cat=="pop"||
			criteria_arr[i].cat=="related_bb"||criteria_arr[i].cat=="related_bs")
			arr.push(criteria_arr[i].title);
	}
	$.post('./php/book_shelf.php', {
		keyword:  arr,
		category: 'save'
	}, function(data, status){
		if(data!=0){
			snacktime("success to save<br/>Please note that tag will not be saved");
			console.log("book added:", data);
		}
	});	
}
function load_book_shelf(){ //also on load
	//console.log("flag: A");
	$.post('./php/book_shelf.php', {
		keyword:  "",
		category: 'load'
	}, function(data, status){
		if(data!=0){
			//console.log("flag: C");
			arr = JSON.parse(data);
			if(arr != 0){
				add_to_criteria_with_locat(arr);
			}
		}
		snacktime("success to load");
		//console.log("flag: D");
	});		
//console.log("flag: B");

}
/* snackbar */
function snacktime(t){
	s = $('#snackbar');
	s.html(t);
	s.addClass('show');
	setTimeout(function(){
		s.removeClass('show');
	}, 3000);
}
