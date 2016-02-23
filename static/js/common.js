/**
 * Created by xshan1 on 2/4/2016.
 */
var week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
var month = ['4th', '8th', '12th', '16th', '20th', '24th', '28th'];
var year = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//string format function
String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
};

//dismiss remove mdl-card from page
dismiss = function(obj) {
	$(obj).closest('.mdl-cell').remove();
};

getTime = function(dt) {
    return $.format.date(dt, "HH:mm:ss");
}

function showDialog(options) {
    options = $.extend({
        id: 'orrsDiag',
        title: null,
        text: null,
        negative: false,
        positive: false,
        cancelable: true,
        contentStyle: null,
        onLoaded: false
    }, options);

    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");

    $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp"></div></div>').appendTo("body");
    var dialog = $('#orrsDiag');
    var content = dialog.find('.mdl-card');
    if (options.contentStyle != null) content.css(options.contentStyle);
    if (options.title != null) {
        $('<h5>' + options.title + '</h5>').appendTo(content);
    }
    if (options.text != null) {
        $('<p>' + options.text + '</p>').appendTo(content);
    }
    if (options.negative || options.positive) {
        var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
        if (options.negative) {
            options.negative = $.extend({
                id: 'negative',
                title: 'Cancel',
                onClick: function () {
                    return false;
                }
            }, options.negative);
            var negButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.negative.id + '">' + options.negative.title + '</button>');
            negButton.click(function (e) {
                e.preventDefault();
                if (!options.negative.onClick(e))
                    hideDialog(dialog)
            });
            negButton.appendTo(buttonBar);
        }
        if (options.positive) {
            options.positive = $.extend({
                id: 'positive',
                title: 'OK',
                onClick: function () {
                    return false;
                }
            }, options.positive);
            var posButton = $('<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="' + options.positive.id + '">' + options.positive.title + '</button>');
            posButton.click(function (e) {
                e.preventDefault();
                if (!options.positive.onClick(e)) {
                    hideDialog(dialog);
                }
            });
            posButton.appendTo(buttonBar);
        }
        buttonBar.appendTo(content);
    }
    componentHandler.upgradeDom();
    if (options.cancelable) {
        dialog.click(function () {
            hideDialog(dialog);
        });
        $(document).bind("keyup.dialog", function (e) {
            if (e.which == 27)
                hideDialog(dialog);
        });
        content.click(function (e) {
            e.stopPropagation();
        });
    }
    setTimeout(function () {
        dialog.css({opacity: 1});
        if (options.onLoaded)
            options.onLoaded();
    }, 1);
}

function hideDialog(dialog) {
    $(document).unbind("keyup.dialog");
    dialog.css({opacity: 0});
    setTimeout(function () {
        dialog.remove();
    }, 400);
}

createSnackbar = (function() {
  // Any snackbar that is already shown
  var previous = null;

/*
<div class="paper-snackbar">
  <button class="action">Dismiss</button>
  Messages
</div>
*/

  return function(message, actionText, action) {
    if (previous) {
      previous.dismiss();
    }
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    snackbar.dismiss = function() {
      this.style.opacity = 0;
    };
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    if (actionText) {
      if (!action) {
        action = snackbar.dismiss.bind(snackbar);
      }
      var actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.innerHTML = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    setTimeout(function() {
      if (previous === this) {
        previous.dismiss();
      }
    }.bind(snackbar), 5000);

    snackbar.addEventListener('transitionend', function(event, elapsed) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
        if (previous === this) {
          previous = null;
        }
      }
    }.bind(snackbar));

    previous = snackbar;
    document.body.appendChild(snackbar);
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
    snackbar.style.zIndex = 999;
  };
})();

toggle_status = function(type, obj) {
    //console.log("checked: " + obj.checked);
    var status = obj.checked;
    var status_str = status?'on':'off';
    showDialog({
        title: 'Are you sure?',
        text: 'The fan will turn ' + status_str + '.',
        negative: {
            title: 'No'
        },
        positive: {
            title: 'Yes',
            onClick: function () {
                console.log('The fan will turn ' + status_str + '.');
                $.ajax({
                type: "PUT",
                url: "/update_sensor",
                contentType: 'application/json',
                data: JSON.stringify({
                    "href": "/a/" + type,
                    "data": {
                        "value": status
                    }
                }),
                success: function(data) {
                    console.log(data);
                    var ret = data.status;
                    if(ret) {
                        console.log("Fan status is updated.");
                        createSnackbar('Fan status is updated.', 'Dismiss');
                    }
                    else {
                        console.error('failed');
                        createSnackbar("Server is unavailable for the moment. Try again later.", 'Dismiss');
                    }
                }
                }).done(function() {
			        //console.log( "second success" );
                }).fail(function(jqXHR, textStatus, errorThrown){
                    console.error("Failed to update status " + errorThrown);
                    createSnackbar("Server error: " + errorThrown, 'Dismiss');
                });
            }
        },
        cancelable: false
    });
    return false;
}

function convertToC(fTemp) {
	var fTempVal = parseFloat(fTemp);
	return Math.round((fTempVal - 32) * (5 / 9));
};

function convertToF(cTemp) {
	var cTempVal = parseFloat(cTemp);
	var fTempVal = (cTempVal * (9 / 5)) + 32;
	//console.log(fTempVal);
	return Math.round(fTempVal);
}

function getDay(){
      //var year = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var today = new Date();
      var month =year[today.getMonth()];
      var date = today.getDate()+ " "+ month;
      return date;
}

function getWeek(){
      //var year = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var dd = new Date();
      dd.setDate(dd.getDate()-7);
      var m = dd.getMonth();
      var d = dd.getDate();
      return d+" "+year[m]+"-"+getDay();
}

function getMonth(){
    //var year = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dd = new Date();
    dd.setMonth(dd.getMonth()-1);
    return year[dd.getMonth()]+" "+dd.getFullYear();
}

function getYear(){
    var dd = new Date();
    return (dd.getFullYear()-1);
}

function drawcontainer(div, xray, yray, descrption) {
    $(div).highcharts({
        title: {
            text: descrption,
            x: 120
        },
        exporting: {
            enabled: false
        },
        xAxis: {
            gridLineWidth : 0,
            tickWidth: 0,
            lineColor: '#fff',
            categories :xray
        },
        yAxis: {
            title: {
              text: null,
                enabled: null,
            },
            gridLineWidth: 0,
            labels: {
                enabled: false,
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'KWH'
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Energy',
            data: yray
        }]
    });
}

function drawcontainerchart(div,xray,yray,title,xtext,ytext,name) {
    $(div).highcharts({
        title: {
          text: title,
          x: 120
        },
        exporting: {
            enabled: false
        },
        xAxis: {
            gridLineWidth: 0,
            tickWidth: 0,
            lineColor: '#fff',
            categories:xray,
            title: {
              enabled: true,
              text: xtext
            },
        },
        yAxis: {
            title: {
              text: null,
              enabled: null,
            },
            gridLineWidth: 0,
            labels: {
                enabled: false,
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: name, //data: [46.0, 35.0, 50.5, 42.0, 32.5, 61.5, 59.0]
            data: yray
          }]
    });
}

draw_billing_pie_chart = function(container, title, data) {
    $(container).highcharts({
        chart: {
            type: 'pie',
            polar: true,
            backgroundColor: '#f5f5f5',
            margin: [8, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        subtitle: {
            text: title,
            style: {
                fontSize: '16px'
            }
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            pie: {
                shadow: false,
                states: {
                    hover: {
                        halo: {
                            size: 6,
                        }
                    }
                }
            },
        },
        tooltip: {
            useHTML: true,
            borderWidth: 0,
            backgroundColor: '#3f4445',
            formatter: function () {
                return '<div style="color: white; padding: 0px;"><b>' + this.point.name + '</b><br>' + this.point.power + ' KWH, ' + this.y + '% </div>';
            }
        },
        series: [{
            name: 'Usages',
            data: data, //[{ name: "Grid Power", y:30, power:90},{ name:"Solar Power", y:70, power: 210}],
            size: '80%',
            innerSize: '55%',
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
}