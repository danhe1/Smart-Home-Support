$(function() {
	//(HeDan)
	//Set the object socket global.
	window.socket;
	window.socket = null;

	//(HeDan)
	//The variable panel represents the current panel displayed by the browser.
	//0: Initial. No panel is specified.
	//1: the Now panel.
	//2: the Before panel
	window.panel;
	window.panel=0;

	var now_timer;
	var time_timer;
    var weather_timer;

    var tb; //token for buzzer
    var tg; //token for gas
    var tc; //token for car
    var tm; //token for motion

    $.sh = {};

	window.onbeforeunload = function() {
		console.log("Leaving the page...")
		if(window.socket !=null)window.socket.close();
    }


	$.sh.now = {
		register_actions: function(){
			console.log('sh-now: register_actions');
			$("a:contains('DISMISS')").on("click", function(){
				//find parent div
				dismiss(this);
			});

			$("label.mdl-icon-toggle").on('click', function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var unit = $(this).children("span:first").html();
				var temp = $(this).parent().prev().find("h1").html();
                if(temp.length == 0) return;
				if (unit == "C") {
					unit = "F";
					temp = convertToF(temp);
				}
				else if (unit == "F") {
					unit = "C";
					temp = convertToC(temp);
				}
				console.log('unit: ' + unit + ' temp: '+ temp);
				$(this).children("span:first").html(unit);
				$(this).parent().prev().find("h1").html(temp + '°');
			});

		},
		clear_data: function() {
			$("#status-container").html('');
			$("#data-container").html('');
		},
		update_car_alert: function(time) {
			if($(".mdl-card__title h6:contains('ELECTRIC CAR')").length > 0){
				//find car card and update time
				var txt = $(".section__circle-container > h4:contains('Charge')");
				txt.text("Charge car in time for tomorrow " + time);
			}
			else {
					$("#alert-container").append(String.format('<div class="demo-card-event mdl-card mdl-cell mdl-cell--3-col mdl-shadow--2dp">\
				  <div class="mdl-card__title mdl-card--expand">\
					<h6>ELECTRIC CAR</h6>\
				  </div>\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
					<div class="section__circle-container mdl-cell mdl-cell--8-col">\
						<h4>Charge car in time for tomorrow {0}</h4>\
					</div>\
					<div class="section__text mdl-cell mdl-cell--4-col" style="text-align:center;">\
						<img src="image/car-icon.png" style="width: 75%; height:75%;">\
					</div>\
				  </div>\
				  <div class="mdl-card__actions mdl-card--border">\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" style="color: #000" onclick="dismiss(this);">\
					  DISMISS\
					</a>\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" style="color: #000">SET TIMER</a>\
				  </div>\
				</div>', time))
			}

		},
		update_motion_alert: function(time){
			if($(".mdl-card__title h6:contains('MOTION SENSOR')").length > 0){
				//find motion card and update time
				var txt = $(".section__circle-container > h4:contains('Someone')");
				txt.text("Someone is at the front door " + time);
			}
			else {
					$("#alert-container").append(String.format('<div class="demo-card-event mdl-card mdl-cell mdl-cell--3-col mdl-shadow--2dp">\
				  <div class="mdl-card__title mdl-card--expand">\
					<h6>MOTION SENSOR</h6>\
				  </div>\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
					<div class="section__circle-container mdl-cell mdl-cell--8-col">\
						<h4>Someone is at the front door {0}</h4>\
					</div>\
					<div class="section__text mdl-cell mdl-cell--4-col" style="text-align:center;">\
						<img src="image/motion-icon.png">\
					</div>\
				  </div>\
				  <div class="mdl-card__actions mdl-card--border">\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="dismiss(this);">\
					  DISMISS\
					</a>\
				  </div>\
				</div>', time))
			}
		},
		update_gas_alert: function(time){
			if($(".mdl-card__title h6:contains('CO2 SENSOR')").length > 0)
			{
				//find gas card and update time
				var txt = $(".section__circle-container > h4:contains('Gas')");
				if(!txt) console.log("not find gas card" + txt.length);
				txt.text("Gas detected in kitchen area " + time);
			}
			else {
				$("#alert-container").append(String.format('<div class="demo-card-event mdl-card mdl-cell mdl-cell--3-col mdl-shadow--2dp" style="background: #ed0042;">\
				  <div class="mdl-card__title mdl-card--expand">\
					<h6 style="color: #fff;">CO2 SENSOR</h6>\
				  </div>\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
					<div class="section__circle-container mdl-cell mdl-cell--8-col">\
						<h4 style="color: #fff;">Gas detected in kitchen area {0}</h4>\
					</div>\
					<div class="section__text mdl-cell mdl-cell--4-col" style="text-align:center;">\
						<img src="image/gas-icon.png">\
					</div>\
				  </div>\
				  <div class="mdl-card__actions mdl-card--border">\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="dismiss(this);"  style="color: #fff;">\
					  DISMISS\
					</a>\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"  style="color: #fff;">EMERGENCY</a>\
				  </div>\
				</div>', time));
			}
		},
		update_buzzer_alert: function(time) {
			if($(".mdl-card__title h6:contains('BUZZER')").length > 0)
			{
				//find gas card and update time
				var txt = $(".section__circle-container > h1");
				txt.text(time);
			}
			else {
				$("#alert-container").append(String.format('<div class="demo-card-event mdl-card mdl-cell mdl-cell--3-col mdl-shadow--2dp">\
				  <div class="mdl-card__title mdl-card--expand">\
					<h6>BUZZER</h6>\
				  </div>\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
					<div class="section__circle-container mdl-cell mdl-cell--8-col">\
						<h1>{0}</h1>\
					</div>\
					<div class="section__text mdl-cell mdl-cell--4-col" style="text-align:center;">\
						<img src="image/buzzer-icon.png">\
					</div>\
				  </div>\
				  <div class="mdl-card__actions mdl-card--border">\
					<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="return dismiss(this);">\
					  DISMISS\
					</a>\
				  </div>\
				</div>', time))
			}
		},
		update_status: function(type, status) {
			var color = "gray"
			if (status)
				color = "green";

			$("#status-container").append(String.format('<div class="status-card mdl-card mdl-cell mdl-shadow--2dp mdl-cell--12-col">\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
						<div class="mdl-cell mdl-cell--12-col" style="text-align: left">\
							<h6>{0}</h6>\
						</div>\
					  <div class="mdl-card__menu">\
						  <i class="material-icons {1}">done</i>\
					  </div>\
				  </div>\
				</div>', type, color))
		},
		update_fan_status: function(status) {
			var is_checked = "";
			if(status)
				is_checked = "checked";

			$("#status-container").append(String.format('<div class="status-card mdl-card mdl-cell mdl-shadow--2dp mdl-cell--12-col">\
				  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
						<div class="mdl-cell mdl-cell--12-col" style="text-align: left">\
							<h6>FAN</h6>\
						</div>\
					  <div class="mdl-card__menu">\
						  <label title="switch on/off" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-2">\
      						<input type="checkbox" id="switch-2" class="mdl-switch__input" {0} onclick="return toggle_status(\'fan\', this);">\
      						<span class="mdl-switch__label"></span>\
    					  </label>\
					  </div>\
				  </div>\
				</div>', is_checked));
            // Expand all new MDL elements
            componentHandler.upgradeDom();
		},
		update_rgb_status: function(status) {
			var bgcolor = "bg-blue";
			if(status)
				bgcolor = "bg-red";

			$("#status-container").append(String.format('<div class="status-card mdl-card mdl-cell mdl-shadow--2dp mdl-cell--12-col">\
			  <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
					<div class="mdl-cell mdl-cell--12-col" style="text-align: left">\
						<h6>RGB LED</h6>\
					</div>\
				  <div class="mdl-card__menu">\
					  <i class="material-icons {0}">lightbulb_outline</i>\
				  </div>\
			  </div>\
			</div>', bgcolor))

		},
		update_sensor_data: function(title, value) {
			var html = '';
			if(title == 'AMBIENT LIGHT')
				html = String.format('<div class="sensor-card mdl-card mdl-cell mdl-shadow--2dp mdl-cell--3-col">\
                    <div class="mdl-card__title mdl-card--expand">\
			  	        <h6>{0}</h6>\
                    </div>\
                    <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
                        <div class="mdl-cell" style="text-align:left;width: auto;">\
                            <h1>{1}</h1>\
                        </div>\
                        <div class="mdl-cell" style="display: flex; align-items: flex-end;">\
								<h6 style="padding: 5px;">lm</h6>\
                        </div>\
                    </div>\
                </div>',title, value);
			else
				html = String.format('<div class="sensor-card mdl-card mdl-cell mdl-shadow--2dp mdl-cell--3-col">\
                    <div class="mdl-card__title mdl-card--expand">\
			  	        <h6>{0}</h6>\
                    </div>\
                    <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">\
                        <div class="mdl-cell mdl-cell--10-col" style="text-align: left">\
                            <h1>{1}</h1>\
                        </div>\
                    </div>\
                </div>', title, value);

			$("#data-container").append(html);
		},
		update_portal: function() {
			if(window.panel != 1) return;
            $.ajax({
                type: "GET",
                url: "/get_sensor",
                dataType: 'json',
                headers: {
                    'buzzer-token': tb,
                    'motion-token': tm,
                    'button-token':tc,
                    'gas-token': tg,
                },
                success: function(data){
                    console.log(data);
                    var sensors = data.data;
                    $.sh.now.clear_data();
                    $.each(sensors['alert'], function (key, value) {
                        switch (key) {
                            case 'buzzer':
                                $.sh.now.update_buzzer_alert(getTime(value));
                                tb = value;
                                break;
                            case 'motion':
                                $.sh.now.update_motion_alert(getTime(value));
                                tm = value;
                                break;
                            case 'gas':
                                $.sh.now.update_gas_alert(getTime(value));
                                tg = value;
                                break;
							case 'button':
                                $.sh.now.update_car_alert(getTime(value));
                                tc = value;
                                break;
                            default:
                                console.error("Unknown alert sensor type: " + key);
                        }
                    });
                    $.each(sensors['status'], function (key, value) {
                        switch (key) {
                            case 'fan':
                                $.sh.now.update_fan_status(value);
                                break;
                            case 'led':
                                $.sh.now.update_status('LED', value);
                                break;
                            case 'rgbled':
                                $.sh.now.update_rgb_status(value);
                                break;
                            default:
                                console.error("Unknown status sensor type: " + key);
                        }
                    });
                    $.each(sensors['data'], function (key, value) {
                        switch (key) {
                            case 'temperature':
                                //$.sh.now.update_sensor_data('HOUSE TEMPERATURE', convertToF(parseFloat(value)).toFixed(1).toString() + '°F');
								$.sh.now.update_sensor_data('HOUSE TEMPERATURE', parseFloat(value).toFixed(1).toString() + '°C');
                                break;
                            case 'solar':
                                $.sh.now.update_sensor_data('SOLAR PANEL TILT', value + '%');
                                break;
                            case 'illuminance':
                                $.sh.now.update_sensor_data('AMBIENT LIGHT', value);
                                break;
                            default:
                                console.error("Unknown sensor data type: " + key);
                        }
                    });
                }
            }).done(function() {
			   //console.log( "second success" );
			}).fail(function() {
			  console.log( "getJson data error" );
			}).always(function() {
				//console.log("complete");
			})
		},
        update_billing: function() {
            Highcharts.setOptions({
             colors: ['#20e7fe', '#20e886', '#feb557']
            });
            draw_billing_pie_chart('#today_container', 'Today\'s usage', [{ name: "Grid Power", y:30, power:90},{ name:"Solar Power", y:70, power: 210}]);
            draw_billing_pie_chart('#current_container', 'Current bill', [{ name: "Grid Power", y:45, power:90},{ name:"Solar Power", y:55, power: 110}]);
            draw_billing_pie_chart('#items_container', 'Items', [{ name: "Heater", y:55, power:90},{ name:"Oven", y:22, power: 110}, { name:"Refrigerator", y:23, power: 110}]);
        },

		init: function() {
			console.log("init now page.");
			window.panel = 1;
			$.sh.now.update_portal();
			$.sh.now.register_actions();
            $.sh.now.update_billing();
            $(window).trigger('resize');
			// Expand all new MDL elements
      		//componentHandler.upgradeDom();
			now_timer = setInterval($.sh.now.update_portal, 3000);
            // update weather every 1 hour
            weather_timer = setInterval(updateWeather(), 3600*1000);

		}
	};

	$.sh.before = {
		register_actions: function(){
			console.log('sh-before: register_actions');
			$("a:contains('DISMISS')").on("click", function(){
				//find parent div
				dismiss(this);
			});

            // switch between the billing tabs
			$("a.mdl-tabs__tab").on("click", function(){
				var tid = $(this).attr( "href" );
				$("div"+tid).find("div[id*='container']").each(function () {
                    if(tid.indexOf('#tab') == 0)
                        $.sh.before.update_billing(tid);
                    else
					    $(this).highcharts().reflow();
				});
			});

            // switch between the other tabs
            //$("a.mdl-tabs__tab").on("click", function(){
				//var tid = $(this).attr( "href" );
            //    //$(this).parent().siblings("div.mdl-tabs__panel").hide();
            //    //$("div" + tid).show();
            //    $("div" + tid).find("div[id*='container']").each(function () {
            //        if(tid.indexOf('#static') == 0)
            //            $(this).highcharts().reflow();
            //    });
            //});
		},
        update_billing: function(tab) {
            //set up tab bar
            Highcharts.setOptions({
               colors: ['#20e7fe', '#20e886', '#feb557']
            });
            switch(tab) {
                case '#tab1':
                    draw_billing_pie_chart(tab + '_today_container', 'Today\'s usage', [{name: "Grid Power",y: 30,power: 90
                    }, {name: "Solar Power", y: 70, power: 210}]);
                    draw_billing_pie_chart(tab + '_current_container', 'Current bill', [{name: "Grid Power",y: 45,power: 90
                    }, {name: "Solar Power", y: 55, power: 110}]);
                    draw_billing_pie_chart(tab + '_items_container', 'Items', [{name: "Heater", y: 55, power: 90
                    }, {name: "Oven", y: 22, power: 110}, {name: "Refrigerator", y: 23, power: 110}]);
                    break;
                case '#tab2':
                case '#tab3':
                    draw_billing_pie_chart(tab + '_today_container', 'Past week', [{name: "Grid Power",y: 30,power: 90
                    }, {name: "Solar Power", y: 70, power: 210}]);
                    draw_billing_pie_chart(tab + '_current_container', 'Past month', [{name: "Grid Power",y: 45,power: 90
                    }, {name: "Solar Power", y: 55, power: 110}]);
                    draw_billing_pie_chart(tab + '_items_container', 'Items', [{name: "Heater", y: 55, power: 90
                    }, {name: "Oven", y: 22, power: 110}, {name: "Refrigerator", y: 23, power: 110}]);
                    break;
                case '#tab4':
                    draw_billing_pie_chart(tab + '_today_container', 'Past week', [{name: "Grid Power",y: 30,power: 90
                    }, {name: "Solar Power", y: 70, power: 210}]);
                    draw_billing_pie_chart(tab + '_current_container', 'Past month', [{name: "Grid Power",y: 45,power: 90
                    }, {name: "Solar Power", y: 55, power: 110}]);
                    draw_billing_pie_chart(tab + '_items_container', 'Past year', [{name: "Grid Power",y: 50,power: 90
                    }, {name: "Solar Power", y: 50, power: 110}]);
                    break;
            }
        },
        update_static_data: function() {
            var monthSolar = [1.67, 1.66, 1.67, 1.65, 1.61, 1.59, 1.58];
            var yearSolar = [50.96, 59.55, 83.12, 100.68, 117.62, 126.35, 126.64, 120.79, 106.03, 85.59, 62.14, 51.49];
            var weekGrid = [4.47, 4.82, 5.17, 5.10, 5.21, 5.07, 4.62];
            var monthGrid = [4.80, 4.88, 4.82, 4.87, 4.92, 5.02, 4.97];
            var yearGrid = [183.31, 203.80, 129.27, 95.66, 71.80, 42.18, 67.60, 94.03, 68.33, 48.08, 102.22, 156.58];
            var weekTemp = [70.448, 70.556, 70.268, 70.43, 70.646, 70.88, 70.826];
            var monthTemp = [70.826, 70.772, 70.664, 70.808, 71.096, 71.33, 71.42];
            var yearTemp = [70.844, 70.898, 70.97, 71.066, 71.114, 71.042, 71.096, 71.15, 71.276, 71.186, 70.916, 70.844];
            var weekSolar = [1.64, 1.68, 1.67, 1.69, 1.70, 1.67, 1.64];
            var weekbuzzer = [123,145,264,153,120,120,110];
            var monthbuzzer = [110,172,227,158,144,100,106];
            var yearbuzzer = [3000,3400,4300,2900,2400,3500,3200,2900,4000,4200,3800,3500];
            var weekgas = [120,110,123,153,120,145,264];
            var monthgas = [172,110,227,158,144,230,106];
            var yeargas = [3400,3000,4300,2900,4000,4200,2400,2900,3800,3200];
            var weeklight = [12.28,13.04,15.08,11.54,15.92,12.19,10.32];
            var monthlight = [12.43,13.04,12.08,11.26,15.92,15.92,12.32];
            var yearlight = [16.02,11.04,15.08,13.75,13.92,12.19,14.32];

            drawcontainer('#container', week, weekSolar, getWeek());
            drawcontainer('#container_a', month, monthSolar, getMonth());
            drawcontainer('#container_b', year, yearSolar, getYear());
            drawcontainer('#container1', week, weekGrid, getWeek());
            drawcontainer('#container1_a', month, monthGrid, getMonth());
            drawcontainer('#container1_b', year, yearGrid, getYear());
            drawcontainerchart('#container2_a',week,weekTemp,getWeek(),'Day',
            'Temperature(℉)','average temperature');
            drawcontainerchart('#container2_b',month,monthTemp,getMonth(),'Day',
            'Temperature(℉)','average temperature');
            drawcontainerchart('#container2_c',year,yearTemp,getYear(),'Month',
            'Temperature(℉)','average temperature');
            drawcontainerchart('#container3_a',week,weekbuzzer,getWeek(),'Day',
            'times','total times');
            drawcontainerchart('#container3_b',month,monthbuzzer,getMonth(),'Day',
            'times','total times');
            drawcontainerchart('#container3_c',year,yearbuzzer,getYear(),'Month',
            'times','total times');
            drawcontainerchart('#container4_a',week,weekgas,getWeek(),'Day',
            'times','total times');
            drawcontainerchart('#container4_b',month,monthgas,getMonth(),'Day',
            'times','total times');
            drawcontainerchart('#container4_c',year,yeargas,getYear(),'Month',
            'times','total times');
            drawcontainerchart('#container5_a',week,weeklight, getWeek(),'Day',
            'illuminance(Lumens)','average illuminance');
            drawcontainerchart('#container5_b',month,monthlight, getMonth(),'Day',
            'illuminance(Lumens)','average illuminance');
            drawcontainerchart('#container5_c',year,yearlight, getYear(),'Month',
            'illuminance(Lumens)','average illuminance');
        },
    	loading: function () {
			var newmsg="<div style = 'text-align:center'><img src='image/loading.gif'width='400px' height ='200px'/></div>";
			$("#container2").html(newmsg);
			$("#container3").html(newmsg);
			$("#container4").html(newmsg);
			$("#container5").html(newmsg);
    	},
    	sendrequest: function () {
			if(window.panel != 2) return;
			window.socket.emit('my data', {data: "temperature"});
			window.socket.emit('my data', {data: "gas"});
			window.socket.emit('my data', {data: "illuminance"});
			window.socket.emit('my data', {data: "buzzer"});
    	},
    	socketinit: function () {
			namespace = '/index'; // change to an empty string to use the global namespace
			var day = ['0', '1',
						'2', '3', '4',
						'5', '6','7',
						'8','9','10','11','12',
						'13','14',
						'15','16','17','18',
						'19','20','21','22','23'];
			// the socket.io documentation recommends sending an explicit package upon connection
			// this is specially important when using the global namespace
			if(window.socket != null)
			{
				$.sh.before.sendrequest();
				return;
			}

			window.socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

			setInterval($.sh.before.sendrequest,3600000);

			// event handler for server sent data
			// the data is displayed in the "Received" section of the page
			socket.on('my response', function (msg) {
				//alert(msg.data);
			});
			// event handler for new connections
			socket.on('connect', function () {
				console.log("i'm connected!");
			});
			socket.on( 'my temperature', function (msg ) {
				console.log( "temperature");
				var temp_data = msg.data;
				if(temp_data.length==0)
				{
					var content = "<div style='text-align:center'><label>There is no data today.</label></div>";
					$("#container2").html(content);
				}
				else
				{
					var average_temp = 0,count=0;
					for (var i =0;i<temp_data.length;i++)
					{
						if(temp_data[i]!=0)
						{
							temp_data[i] = parseFloat(temp_data[i].toFixed(2));
							count++;
						}
						average_temp += parseFloat(temp_data[i]);
					}
					average_temp = (average_temp/count).toFixed(2);
					console.log(average_temp);
					$("#averagetemp").text(average_temp.toString()+"℉");
					drawcontainerchart('#container2',day,temp_data,getDay(),'Time(hour)',
						'Temperature(℉)','average temperature');
				}
			});
			socket.on('my gas', function (msg) {
				console.log("gas");
				var num = msg.data;
				if(num.length==0)
				{
					var content = "<div style='text-align:center'><label>There is no data today.</label></div>";
					$("#container4").html(content);
				}
				else
				{
					drawcontainerchart('#container4',day,num, getDay(),'Time(hour)',
					'times','total times');
					if(num[num.length-1]>0)
						$("#safestate").text("Unsafe");
					else
					    $("#safestate").text("Safe");
				}

			});
			socket.on('my buzzer', function (msg) {
				console.log("buzzer");
				var num = msg.data;
				if(num.length==0)
				{
					var content = "<div style='text-align:center'><label>There is no data today.</label></div>";
					$("#container3").html(content);
				}
				else
					drawcontainerchart('#container3',day,num,getDay(),'Time(hour)',
					'times','total times');
			});

			socket.on('my illuminance', function (msg) {
				console.log("illuminance");
				var light_data = msg.data;
				if(light_data.length==0)
				{
					var content = "<div style='text-align:center'><label>There is no data today.</label></div>";
					$("#container5").html(content);
				}
				else
				{
					for (var i =0;i<light_data.length;i++)
					{
						if(light_data[i]!=0)
							light_data[i] = parseFloat(light_data[i].toFixed(2));
					}
					drawcontainerchart('#container5',day,light_data, getDay(),'Time(hour)',
						'illuminance(Lumens)','average illuminance');
				}
			});

			$.sh.before.sendrequest();
    	},
		init: function() {
			console.log("init before page.");
			window.panel = 2;
			//window.trigger("resize");
			$.sh.before.register_actions();
			$.sh.before.loading();
            $.sh.before.update_billing("#tab1");
			$.sh.before.socketinit();
            $.sh.before.update_static_data();
		}
	};

	$("a:contains('NOW')").on('click', function() {
		clearInterval(time_timer);
        clearInterval(now_timer);
        clearInterval(weather_timer);
		//clearInterval(chart_timer);
		$('#sh-before').hide();
		$('#sh-now').show();
		$.sh.now.init();
	});
	$("a:contains('BEFORE')").on('click', function() {
     	clearInterval(time_timer);
		clearInterval(now_timer);
        clearInterval(weather_timer);
		$('#sh-now').hide();
		$('#sh-before').show();
		$.sh.before.init();
	});

    $('#sh-before').hide();
	$('#sh-now').show();
	$.sh.now.init();
});
