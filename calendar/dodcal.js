dodcal = (function () {
  var pub = {};
  var locations = {};
  var shifts = {};
  var dods = {};
  
  cbLoadShifts = function (response) {
    var r = JSON.parse(response);
    if (r.status == 'success') {
      shifts = JSON.parse(r.data);
    }    
  };
  
  cbLoadLocations = function (response) {
    var r = JSON.parse(response);
    if (r.status == 'success') {
      shifts = JSON.parse(r.data);
    }
  };
  
  cbLoadDODs = function (response) {
    var r = JSON.parse(response);
    if (r.status == 'success') {
      dods = JSON.parse(r.data);
    }
  };
  
  getWeek = function (today) {
    var mon = new Date(today);
    var week = [];

    if (today.getDay() == 0) { // go to next week
      mon.setDate(today.getDate() + 1);
    } else if (today.getDay() == 6) { // go to next week
      mon.setDate(today.getDate() + 2);
    } else {
      mon.setDate(today.getDate() - today.getDay() + 1);
    }
    
    for (var i = 0; i < 5; i++) {
      var tmp = new Date(mon);
      tmp.setDate(mon.getDate() + i);
      week.push(tmp);
    }
    return week;
  };
  
  /*
   * Function: uiEditWeekGetDate
   * 
   * Parameters
   *  day - day of week
   *    0 - Monday
   *    1 - Tuesda
   *    ...
   *    4 - Friday
   * 
   *  shift
   *    aa - AM
   *    pm - PM
   */
  uiEditWeekGetDate = function (day, shift) {
    var id = 'date-'+day+'-'+shift;
    var $e = $('#tb-edit-week').find('#'+id);
    var tmp = $e.text();
    return new Date(tmp);
  };
  
  /*
   * Function: uiEditWeekGetNextDOD
   * 
   * Parameters
   *    1 - BOMB
   *    2 - Piedmont
   */
  uiEditWeekGetNextDOD = function (day, shift, location) {
    var id = 'next-dod-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    return $e.prop('checked') ? 1 : 0;
  };
  uiEditWeekSetNextDOD = function (day, shift, location, dod_next) {
    var id = 'next-dod-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    if (dod_next == '0') {
      $e.prop('checked', false);
    } else {
      $e.prop('checked', true);
    }
  };  
  pub.uiEditWeekSetNextDOD = uiEditWeekSetNextDOD;
  
  uiEditWeekGetDOD = function(day, shift, location) {
    var id = 'dod-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    return $e.val();
  };
  
  uiEditWeekSetDOD = function(day, shift, location, dod) {
    var id = 'dod-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    $e.val(dod);
    $e.selectmenu('refresh', true);    
  };
  pub.uiEditWeekSetDOD = uiEditWeekSetDOD;
  
  uiEditWeekGetCoverage = function(day, shift, location) {
    var id = 'coverage-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    return $e.val();    
  };
  
  uiEditWeekSetCoverage = function(day, shift, location, coverage) {
    var id = 'coverage-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-edit-week').find('#'+id);
    $e.val(coverage);    
  };
  pub.uiEditWeekSetCoverage = uiEditWeekSetCoverage;

  uiGetWeek = function () {
    coverage = [];
    for (var i = 0; i < 5; i++) {
      var tmp = {'am': {'1': {}, '2': {}}, 'pm': {'1': {}, '2': {}}};
      tmp['am']['1']['date'] = uiEditWeekGetDate(i, 'am');
      tmp['am']['1']['dod_next'] = uiEditWeekGetNextDOD(i, 'am', 1);
      tmp['am']['1']['dod_id'] = uiEditWeekGetDOD(i, 'am', 1);
      tmp['am']['1']['coverage'] = uiEditWeekGetCoverage(i, 'am', 1);
      
      tmp['am']['2']['date'] = uiEditWeekGetDate(i, 'am');
      tmp['am']['2']['dod_next'] = uiEditWeekGetNextDOD(i, 'am', 2);
      tmp['am']['2']['dod_id'] = uiEditWeekGetDOD(i, 'am', 2);
      tmp['am']['2']['coverage'] = uiEditWeekGetCoverage(i, 'am', 2);

      tmp['pm']['1']['date'] = uiEditWeekGetDate(i, 'pm');
      tmp['pm']['1']['dod_next'] = uiEditWeekGetNextDOD(i, 'pm', 1);
      tmp['pm']['1']['dod_id'] = uiEditWeekGetDOD(i, 'pm', 1);
      tmp['pm']['1']['coverage'] = uiEditWeekGetCoverage(i, 'pm', 1);
      
      tmp['pm']['2']['date'] = uiEditWeekGetDate(i, 'pm');
      tmp['pm']['2']['dod_next'] = uiEditWeekGetNextDOD(i, 'pm', 2);
      tmp['pm']['2']['dod_id'] = uiEditWeekGetDOD(i, 'pm', 2);
      tmp['pm']['2']['coverage'] = uiEditWeekGetCoverage(i, 'pm', 2);

      coverage.push(tmp);
    }
    return coverage;
  };
  
  uiEditWeek = function(week) {
    $('#tb-edit-week > tbody').empty();
    for (var i = 0; i < week.length; i++) {
      var $tr = $('<tr></tr>');
      // AM, location 1
      var $td = $('<td id="date-'+i+'-am">'+week[i].toDateString()+'</td>');
      $tr.append($td);
      
      $td = $('<td>'+shifts[0].shift_name+'</td>');
      $tr.append($td);
      
      $td = $('<td></td>');
      var $input = $('<input type="checkbox" id="next-dod-'+i+'-am-1">');
      $td.append($input);
      $input.checkboxradio();
      $tr.append($td);           
            
      $td = $('<td></td');
      var $select = $('<select id="dod-'+i+'-am-1"></select>');
      for (var j = 0; j < dods.length; j++) {
        if (dods[j].dod_active == '1') {
          $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
        }
      }
      $td.append($select);
      $select.selectmenu();
      $tr.append($td);
      
      // AM, location 2
      $td = $('<td></td>');
      $input = $('<input id="coverage-'+i+'-am-1" value="" />');
      $td.append($input);
      $input.textinput();
      $tr.append($td);
      
      $td = $('<td></td>');
      var $input = $('<input type="checkbox" id="next-dod-'+i+'-am-2">');
      $td.append($input);
      $input.checkboxradio();
      $tr.append($td);          
            
      $td = $('<td></td');
      var $select = $('<select id="dod-'+i+'-am-2"></select>');
      for (var j = 0; j < dods.length; j++) {
        if (dods[j].dod_active == '1') {
          $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
        }
      }
      $td.append($select);
      $select.selectmenu();
      $tr.append($td);
      
      $td = $('<td></td>');
      $input = $('<input id="coverage-'+i+'-am-2" value="" />');
      // $input = $('<input value="" />'); 
      $td.append($input);
      $input.textinput();
      $tr.append($td);
            
      $('#tb-edit-week > tbody').append($tr);
      
      // PM, location 1
      var $tr = $('<tr></tr>');
      var $td = $('<td id="date-'+i+'-pm">'+week[i].toDateString()+'</td>');
      $tr.append($td);
      
      $td = $('<td>'+shifts[1].shift_name+'</td>');
      $tr.append($td);
      
      $td = $('<td></td>');
      var $input = $('<input type="checkbox" id="next-dod-'+i+'-pm-1">');
      $td.append($input);
      $input.checkboxradio();
      $tr.append($td);      
      
      $td = $('<td></td');
      var $select = $('<select id="dod-'+i+'-pm-1"></select>');
      for (var j = 0; j < dods.length; j++) {
        if (dods[j].dod_active == '1') {
          $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
        }
      }
      $td.append($select);
      $select.selectmenu();
      $tr.append($td);
      
      $td = $('<td></td>');
      $input = $('<input id="coverage-'+i+'-pm-1" value="" />');
      // $input = $('<input value="" />'); 
      $td.append($input);
      $input.textinput();
      $tr.append($td);
      
      // PM, location 2
      $td = $('<td></td>');
      var $input = $('<input type="checkbox" id="next-dod-'+i+'-pm-2">');
      $td.append($input);
      $input.checkboxradio();
      $tr.append($td);
            
      $td = $('<td></td');
      var $select = $('<select id="dod-'+i+'-pm-2"></select>');
      for (var j = 0; j < dods.length; j++) {
        if (dods[j].dod_active == '1') {
          $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
        }
      }
      $td.append($select);
      $select.selectmenu();
      $tr.append($td);

      $td = $('<td></td>');
      $input = $('<input id="coverage-'+i+'-pm-2" value="" />');
      // $input = $('<input value="" />'); 
      $td.append($input);
      $input.textinput();
      $tr.append($td);
            
      $('#tb-edit-week > tbody').append($tr);      
    }
    
    $('#tb-edit-week').table('refresh');
    $("#tb-edit-week > tbody tr:even").css("background-color", "#F0F0F0");
  };
  
  shift_name = function(shift) {
    if (shift == 1) {
      return 'am';
    }
    return 'pm';
  };

  /*
   * Function: uiViewWeekGetDate
   * 
   * Parameters
   *  day - day of week
   *    0 - Monday
   *    1 - Tuesda
   *    ...
   *    4 - Friday
   * 
   *  shift
   *    aa - AM
   *    pm - PM
   */
  uiViewWeekGetDate = function (day, shift) {
    var id = 'date-'+day+'-'+shift;
    var $e = $('#tb-view-week').find('#'+id);
    var tmp = $e.text();
    return new Date(tmp);
  };
  pub.uiViewWeekGetDate = uiViewWeekGetDate;
  
  uiViewWeekSetDOD = function(day, shift, location, dod) {
    var id = 'dod-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-view-week').find('#'+id);
    return $e.text(dod);
  };
  pub.uiViewWeekSetDOD = uiViewWeekSetDOD;
  
  uiViewWeekSetCoverage = function(day, shift, location, coverage) {
    var id = 'coverage-'+day+'-'+shift+'-'+location;
    var $e = $('#tb-view-week').find('#'+id);
    $e.text(coverage);    
  };
  pub.uiViewWeekSetCoverage = uiViewWeekSetCoverage;
  
  /*
   * Function: uiViewWeekGetDate
   * 
   * Parameters
   *  day - day of week
   *    0 - Monday
   *    1 - Tuesda
   *    ...
   *    4 - Friday
   * 
   *  shift
   *    aa - AM
   *    pm - PM
   */
  uiViewDayGetDate = function (shift) {
    var id = 'date-'+shift;
    var $e = $('#tb-view-day').find('#'+id);
    var tmp = $e.text();
    return new Date(tmp);
  };
  pub.uiViewDayGetDate = uiViewDayGetDate;
  
  uiViewDaySetDOD = function(shift, location, dod) {
    var id = 'dod-'+shift+'-'+location;
    var $e = $('#tb-view-day').find('#'+id);
    return $e.text(dod);
  };
  pub.uiViewDaySetDOD = uiViewDaySetDOD;
  
  uiViewDaySetCoverage = function(shift, location, coverage) {
    var id = 'coverage-'+shift+'-'+location;
    var $e = $('#tb-view-day').find('#'+id);
    $e.text(coverage);    
  };
  pub.uiViewDaySetCoverage = uiViewDaySetCoverage;
  
  uiGetDay = function () {
    var tmp = $('#dod-day').text();
    return new Date(tmp);    
  };
  
  uiSetDay = function (day) {
    $('#dod-day').text(day.toDateString());
  };
  
  
  uiViewWeek = function (week) {
    $('#tb-view-week > tbody').empty();
    for (var i = 0; i < week.length; i++) {
      var $tr = $('<tr></tr>');
      // AM, location 1
      var $td = $('<td></td>');
      var $span = $('<span id="date-'+i+'-am">'+week[i].toDateString()+'</span>');
      $td.append($span);
      $tr.append($td);
      
      $td = $('<td>'+shifts[0].shift_name+'</td>');
      $tr.append($td);
      
      $td = $('<td></td');
      $span = $('<span id="dod-'+i+'-am-1"></span');
      $td.append($span);
      $tr.append($td);
      
      // AM, location 2
      $td = $('<td></td>');
      $span = $('<span id="coverage-'+i+'-am-1"></span>');
      $td.append($span);
      $tr.append($td);
      
      $td = $('<td></td');
      $span = $('<span id="dod-'+i+'-am-2"></span>');
      $td.append($span);
      $tr.append($td);
      
      $td = $('<td></td>');
      $span = $('<span id="coverage-'+i+'-am-2"></span>');
      $td.append($span);
      $tr.append($td);
            
      $('#tb-view-week > tbody').append($tr);
      
      // PM, location 1
      var $tr = $('<tr></tr>');
      var $td = $('<td></td>');
      var $span = $('<span id="date-'+i+'-pm">'+week[i].toDateString()+'</span>');
      $td.append($span);
      $tr.append($td);
      
      $td = $('<td>'+shifts[1].shift_name+'</td>');
      $tr.append($td);      
      
      $td = $('<td></td>');
      $span = $('<span id="dod-'+i+'-pm-1"></span');
      $td.append($span);
      $tr.append($td);
      
      $td = $('<td></td>');
      $span = $('<span  id="coverage-'+i+'-pm-1"></span>');
      $td.append($span);
      $tr.append($td);
      
      // PM, location 2
      $td = $('<td></td>');
      $span = $('<span id="dod-'+i+'-pm-2"></span');
      $td.append($span);
      $tr.append($td);

      $td = $('<td></td>');
      $span = $('<span id="coverage-'+i+'-pm-2"></span>');
      $td.append($span);
      $tr.append($td);
            
      $('#tb-view-week > tbody').append($tr);      
    }
    
    $('#tb-view-week').table('refresh');
    $("#tb-view-week > tbody tr:even").css("background-color", "#F0F0F0");
  };

  uiLoadEditWeek = function (week) {
    for (var d = 0; d < week.length; d++) {
      for (var s = 1; s < 3; s++) {
        for (var l = 1; l < 3; l++) {
          var cmd = {};
          cmd['cmd'] = 'getCoverage';
          // cmd['date'] = uiEditWeekGetDate(d, shift_name(s)).format('yyyy-mm-dd');
          cmd['date'] = week[d].format('yyyy-mm-dd');
          cmd['shift_id'] = s;
          cmd['location_id'] = l;
          $.post('dodcal.php', cmd, function (response) {
            var r = JSON.parse(response);
            if (r.status == 'success') {
              var coverage = JSON.parse(r.data)[0];
              // var date = new Date(coverage.date+' 08:00');
              var tmp = coverage.date.split('-');
              var date = new Date(tmp[0], tmp[1]-1, tmp[2]);              
              var day = date.getDay()-1;
              var shift = shift_name(coverage.shift_id);
              var dod_name = '*';
              if (coverage.dod_next == '0') {
                dod_name = '';
              }
              uiEditWeekSetDOD(day, shift, coverage.location_id, coverage.dod_id);
              uiEditWeekSetCoverage(day, shift, coverage.location_id, coverage.coverage);
              uiEditWeekSetNextDOD(day, shift, coverage.location_id, coverage.dod_next);
            }
          });
        }
      }
    }
  };

  uiViewDay = function (day) {
    $('#tb-view-day > tbody').empty();
    
    var $tr = $('<tr></tr>');
    // AM, location 1
    // var $td = $('<td></td>');
    // var $span = $('<span id="date-am">'+day.toDateString()+'</span>');
    // $td.append($span);
    // $tr.append($td);
    
    $td = $('<td>'+shifts[0].shift_name+'</td>');
    $tr.append($td);
    
    $td = $('<td></td');
    $span = $('<span id="dod-am-1"></span');
    $td.append($span);
    $tr.append($td);
    
    // AM, location 2
    $td = $('<td></td>');
    $span = $('<span id="coverage-am-1"></span>');
    $td.append($span);
    $tr.append($td);
    
    $td = $('<td></td');
    $span = $('<span id="dod-am-2"></span>');
    $td.append($span);
    $tr.append($td);
    
    $td = $('<td></td>');
    $span = $('<span id="coverage-am-2"></span>');
    $td.append($span);
    $tr.append($td);
          
    $('#tb-view-day > tbody').append($tr);
    
    // PM, location 1
    var $tr = $('<tr></tr>');
    // var $td = $('<td></td>');
    // var $span = $('<span id="date-pm">'+day.toDateString()+'</span>');
    // $td.append($span);
    // $tr.append($td);
    
    $td = $('<td>'+shifts[1].shift_name+'</td>');
    $tr.append($td);      
    
    $td = $('<td></td>');
    $span = $('<span id="dod-pm-1"></span');
    $td.append($span);
    $tr.append($td);
    
    $td = $('<td></td>');
    $span = $('<span  id="coverage-pm-1"></span>');
    $td.append($span);
    $tr.append($td);
    
    // PM, location 2
    $td = $('<td></td>');
    $span = $('<span id="dod-pm-2"></span');
    $td.append($span);
    $tr.append($td);

    $td = $('<td></td>');
    $span = $('<span id="coverage-pm-2"></span>');
    $td.append($span);
    $tr.append($td);
          
    $('#tb-view-day > tbody').append($tr);      
    
    $('#tb-view-day').table('refresh');
    $("#tb-view-day > tbody tr:even").css("background-color", "#F0F0F0");
  };
  
  cbSaveEditWeek = function () {
    var coverage = uiGetWeek();
    
    var promises = [];
    for (var i = 0; i < coverage.length; i++ ) {
      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['am']['1']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '1';
      cmd['location_id'] = '1';
      cmd['dod_id'] = coverage[i]['am']['1']['dod_id'];
      cmd['dod_next'] = coverage[i]['am']['1']['dod_next'];
      cmd['coverage'] = coverage[i]['am']['1']['coverage'];
      promises.push($.post('dodcal.php', cmd));
      
      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['am']['2']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '1';
      cmd['location_id'] = '2';
      cmd['dod_id'] = coverage[i]['am']['2']['dod_id'];
      cmd['dod_next'] = coverage[i]['am']['2']['dod_next'];
      cmd['coverage'] = coverage[i]['am']['2']['coverage'];
      promises.push($.post('dodcal.php', cmd));

      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['pm']['1']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '2';
      cmd['location_id'] = '1';
      cmd['dod_id'] = coverage[i]['pm']['1']['dod_id'];
      cmd['dod_next'] = coverage[i]['pm']['1']['dod_next'];
      cmd['coverage'] = coverage[i]['pm']['1']['coverage'];
      promises.push($.post('dodcal.php', cmd));
      
      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['pm']['2']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '2';
      cmd['location_id'] = '2';
      cmd['dod_id'] = coverage[i]['pm']['2']['dod_id'];
      cmd['dod_next'] = coverage[i]['pm']['2']['dod_next'];
      cmd['coverage'] = coverage[i]['pm']['2']['coverage'];
      promises.push($.post('dodcal.php', cmd));
    }
    $.when.apply(null, promises).done(function(r) {
      alert('Saved');
    });    
  };

  cbEditNextWeek = function () {
    var monday = new Date(uiEditWeekGetDate(0, 'am'));
    monday.setDate(monday.getDate() + 7);
    var week = getWeek(monday);
    uiEditWeek(week);
    uiLoadEditWeek(week);    
  };

  cbEditPrevWeek = function () {
    var monday = new Date(uiEditWeekGetDate(0, 'am'));
    monday.setDate(monday.getDate() - 7);
    var week = getWeek(monday);
    uiEditWeek(week);
    uiLoadEditWeek(week);    
  };
  
  cbEditCopyPrevWeek = function () {
    var monday = new Date(uiEditWeekGetDate(0, 'am'));
    monday.setDate(monday.getDate() - 7);
    var week = getWeek(monday);
    // uiEditWeek(week);
    uiLoadEditWeek(week);    
  };  
  
  uiLoadViewWeek = function (week) {
    for (var d = 0; d < week.length; d++) {
      for (var s = 1; s < 3; s++) {
        for (var l = 1; l < 3; l++) {
          var cmd = {};
          cmd['cmd'] = 'getCoverage';
          cmd['date'] = uiViewWeekGetDate(d, shift_name(s)).format('yyyy-mm-dd');
          cmd['shift_id'] = s;
          cmd['location_id'] = l;
          $.post('dodcal.php', cmd, function (response) {
            var r = JSON.parse(response);
            if (r.status == 'success') {
              var coverage = JSON.parse(r.data)[0];
              var tmp = coverage.date.split('-');
              var date = new Date(tmp[0], tmp[1]-1, tmp[2]);
              var day = date.getDay()-1;
              var shift = shift_name(coverage.shift_id);
              var dod_name = '*';
              if (coverage.dod_next == '0') {
                dod_name = '';
              }
              for (var i = 0; i < dods.length; i++) {
                if (dods[i].dod_id == coverage.dod_id) {
                  dod_name += dods[i].dod_name;
                }
              }
              uiViewWeekSetDOD(day, shift, coverage.location_id, dod_name);
              uiViewWeekSetCoverage(day, shift, coverage.location_id, coverage.coverage);
            }
          });
        }
      }
    }
  };
  
  uiLoadViewDay = function () {
    for (var s = 1; s < 3; s++) {
      for (var l = 1; l < 3; l++) {
        var cmd = {};
        cmd['cmd'] = 'getCoverage';
        // cmd['date'] = uiViewDayGetDate(shift_name(s)).format('yyyy-mm-dd');
        cmd['date'] = uiGetDay().format('yyyy-mm-dd');
        cmd['shift_id'] = s;
        cmd['location_id'] = l;
        $.post('dodcal.php', cmd, function (response) {
          var r = JSON.parse(response);
          if (r.status == 'success') {
            var coverage = JSON.parse(r.data)[0];
            // var date = new Date(coverage.date+' 08:00');
            var tmp = coverage.date.split('-');
            var date = new Date(tmp[0], tmp[1]-1, tmp[2]);
            var day = date.getDay()-1;
            var shift = shift_name(coverage.shift_id);
            var dod_name = '*';
            if (coverage.dod_next == '0') {
              dod_name = '';
            }
            for (var i = 0; i < dods.length; i++) {
              if (dods[i].dod_id == coverage.dod_id) {
                dod_name += dods[i].dod_name;
              }
            }
            uiViewDaySetDOD(shift, coverage.location_id, dod_name);
            uiViewDaySetCoverage(shift, coverage.location_id, coverage.coverage);
            $('#tb-view-day').table('refresh');
          }
        });
      }
    }
  };
  
  cbViewNextWeek = function () {
    var monday = new Date(uiViewWeekGetDate(0, 'am'));
    monday.setDate(monday.getDate() + 7);
    var week = getWeek(monday);
    uiViewWeek(week);
    uiLoadViewWeek(week);    
  };

  cbViewPrevWeek = function () {
    var monday = new Date(uiViewWeekGetDate(0, 'am'));
    monday.setDate(monday.getDate() - 7);
    var week = getWeek(monday);
    uiViewWeek(week);
    uiLoadViewWeek(week);    
  };

  cbViewNextDay = function () {
    var day = new Date(uiGetDay());
    day.setDate(day.getDate() + 1);

    if (day.getDay() == 0) { // go to next week
      day.setDate(day.getDate() + 1);
    } else if (day.getDay() == 6) { // go to next week
      day.setDate(day.getDate() + 2);
    }
    
    uiSetDay(day);
    uiViewDay(day);
    uiLoadViewDay();    
  };

  cbViewPrevDay = function () {
    var day = new Date(uiGetDay());
    day.setDate(day.getDate() - 1);

    if (day.getDay() == 0) { // go to prev week
      day.setDate(day.getDate() - 2);
    } else if (day.getDay() == 6) { // go to prev week
      day.setDate(day.getDate() - 1);
    }
    
    uiSetDay(day);
    uiViewDay(day);
    uiLoadViewDay();  
  };
  
  uiEditDODList = function() {
    $('#tb-edit-dod-list > tbody').empty();
    
    for (var i = 0; i < dods.length; i++) {
      var $tr = $('<tr id="dod-row-'+dods[i].dod_id+'"></tr>');
      
      var $td = $('<td></td>');
      var $input = $('<input type="text" id="dod-name-'+dods[i].dod_id+'" value="'+dods[i].dod_name+'" />');
      $td.append($input);
      $tr.append($td);

      var $td = $('<td></td>');
      var $input = $('<input type="text" id="dod-email-'+dods[i].dod_id+'" value="'+dods[i].dod_email+'" />');
      $td.append($input);
      $tr.append($td);

      var $td = $('<td></td>');
      var $input = $('<input type="text" id="dod-cell-'+dods[i].dod_id+'" value="'+dods[i].dod_cell+'" />');
      $td.append($input);
      $tr.append($td);
      
      $td = $('<td></td>');
      var $input = $('<input type="checkbox" id="dod-active-'+dods[i].dod_id+'">');
      if (dods[i].dod_active == '0') {
        $input.prop('checked', false);
      } else {
        $input.prop('checked', true);
      }      
      $td.append($input);
      $input.checkboxradio();
      $tr.append($td);
      
      // var $td = $('<td></td>');
      // var $input = $('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ">Delete</a>');
      // $input.on('click', cbUIDeleteDOD);
      // $td.append($input);
      // $tr.append($td);            
      
      $('#tb-edit-dod-list > tbody').append($tr);
    }
    
    $('#tb-edit-dod-list').table('refresh');
    // $("#tb-edit-dod-list > tbody tr:even").css("background-color", "#F0F0F0");
  };
  
  uiHideEditDODList = function () {
    $('#tb-edit-dod-list > tbody').empty();
  };
  
  cbUIDeleteDOD = function (e) {
    // $(e.target).parent().parent().remove();
    $(e.target).parent().parent().addClass('dod-delete');
  };
  
  cbAddDODList = function () {
    var i = dods.length;
    dods.push({dod_id: i+1, dod_name: '', dod_email: '', dod_cell: '', dod_active: 1});
    
    var $tr = $('<tr id="dod-row-'+dods[i].dod_id+'" class="dod-new"></tr>');
    
    var $td = $('<td></td>');
    var $input = $('<input type="text" id="dod-name-'+dods[i].dod_id+'" value="'+dods[i].dod_name+'" />');
    $td.append($input);
    $tr.append($td);

    var $td = $('<td></td>');
    var $input = $('<input type="text" id="dod-email-'+dods[i].dod_id+'" value="'+dods[i].dod_email+'" />');
    $td.append($input);
    $tr.append($td);

    var $td = $('<td></td>');
    var $input = $('<input type="text" id="dod-cell-'+dods[i].dod_id+'" value="'+dods[i].dod_cell+'" />');
    $td.append($input);
    $tr.append($td);
    
    $td = $('<td></td>');
    var $input = $('<input type="checkbox" id="dod-active-'+dods[i].dod_id+'">');
    if (dods[i].dod_active == '0') {
      $input.prop('checked', false);
    } else {
      $input.prop('checked', true);
    }      
    $td.append($input);
    $input.checkboxradio();
    $tr.append($td);
    
    var $td = $('<td></td>');
    var $input = $('<a href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ">Delete</a>');
      // '<input type="text" id="dod-cell-"'+dods[i].dod_id+'" value="'+dods[i].dod_cell+'" />');
    $input.on('click', cbUIDeleteDOD);
    $td.append($input);
    $tr.append($td);            
    
    $('#tb-edit-dod-list > tbody').append($tr);
    $('#tb-edit-dod-list').table('refresh');    
  };
  
  cbSaveDODList = function () {
    var promises = [];
    
    $('#tb-edit-dod-list >tbody >tr').each(function (index) {
      var $tr = $(this);
      var dod_id = $tr.attr('id').replace('dod-row-', '');

      if ($tr.hasClass('dod-delete') && !$tr.hasClass('dod-new')) {
        // We are deleting a DODO
        
        console.log('delete '+$tr.attr('id'));
      } else if ($tr.hasClass('dod-new') && !$tr.hasClass('dod-delete')) {
        // We are adding a new DOD
        var cmd = {};
        cmd['cmd'] = 'saveDOD';
        cmd['dod_id'] = null;
        cmd['dod_name'] = $('#dod-name-'+dod_id).val();
        cmd['dod_email'] = $('#dod-email-'+dod_id).val();
        cmd['dod_cell'] = $('#dod-cell-'+dod_id).val();
        if ($('#dod-active-'+dod_id).prop('checked')) {
          cmd['dod_active'] = 1;
        } else {
          cmd['dod_active'] = 0;
        }
        
        promises.push($.post('dodcal.php', cmd));
      } else if ($tr.hasClass('dod-new') && $tr.hasClass('dod-delete')) {
        console.log('ingore '+$tr.attr('id'));
      } else {
        var cmd = {};
        cmd['cmd'] = 'saveDOD';
        cmd['dod_id'] = dod_id;
        cmd['dod_name'] = $('#dod-name-'+dod_id).val();
        cmd['dod_email'] = $('#dod-email-'+dod_id).val();
        cmd['dod_cell'] = $('#dod-cell-'+dod_id).val();
        if ($('#dod-active-'+dod_id).prop('checked')) {
          cmd['dod_active'] = 1;
        } else {
          cmd['dod_active'] = 0;
        }
        
        promises.push($.post('dodcal.php', cmd));
      }
    });
    
    $.when.apply(null, promises).done(function(r) {
      alert('Saved');
      pub.initEditDODList();
    });
        
  };
  
  uiEditDODSMS = function() {
    $('#tb-edit-dod-sms > tbody').empty();
    
    for (var i = 0; i < dods.length; i++) {
      if (dods[i].dod_active == '1') {
        var $tr = $('<tr id="dod-row-'+dods[i].dod_id+'"></tr>');
        
        var $td = $('<td></td>');
        var $input = $('<input type="checkbox" id="dod-sms-'+dods[i].dod_id+'" />');
        $td.append($input);
        $tr.append($td);
        
        $input.checkboxradio();
        
        $input.change(function (e) {
          var $i = $(e.target);
          $i.closest('tr').toggleClass('dod-select');
        });
  
        var $td = $('<td></td>');
        var $span = $('<span id="dod-name-'+dods[i].dod_id+'">'+dods[i].dod_name+'</span>');
        $td.append($span);
        $tr.append($td);
  
        var $td = $('<td></td>');
        var $span = $('<span id="dod-cell-'+dods[i].dod_id+'">'+dods[i].dod_cell+'</span>');
        $td.append($span);
        $tr.append($td);
                    
        $('#tb-edit-dod-sms > tbody').append($tr);
      }
    }
    
    $('#tb-edit-dod-sms').table('refresh');
  };
  
  uiHideEditDODSMS = function () {
    $('#tb-edit-dod-sms > tbody').empty();
  };
  
  cbSendSMS = function () {
    $('#tb-edit-dod-sms >tbody >tr').each(function (index) {
      var $tr = $(this);
      var dod_id = $tr.attr('id').replace('dod-row-', '');
      
      $i = $tr.find('#dod-sms-'+dod_id);
      if ($i.prop('checked') == true) {
        var dod_cell = $tr.find('#dod-cell-'+dod_id).text();
        // remove non-digits
        dod_cell = dod_cell.replace(/\D/g,'');
        if (dod_cell.length == 10) {
          var cmd = {}; 
          cmd['cmd'] = 'sendMail';
          cmd['dod_id'] = dod_id;
          cmd['to'] = dod_cell+'@vtext.com';
          cmd['subject'] = '';
          cmd ['message'] = $('#sms-msg').val();
          console.log(cmd);
          $.post('dodcal.php', cmd, function (response) {
            var r = JSON.parse(response);
            if (r.status == 'success') {
              var data = JSON.parse(r.data);
              var dod_id = data.dod_id;
              
              $('#dod-row-'+dod_id).removeClass('dod-select');
              $('#dod-sms-'+dod_id).prop('checked', false);
            }  
          }); 
        }
      };
     });
     $('#sms-msg').val('');   
  };  
  
  pub.bindSaveEditWeek = function () {
    $('#edit-save-week').on('click', cbSaveEditWeek);
  };
  
  pub.bindEditNextWeek = function () {
    $('#edit-next-week').on('click', cbEditNextWeek);
  };

  pub.bindEditPrevWeek = function () {
    $('#edit-prev-week').on('click', cbEditPrevWeek);
  };

  pub.bindEditCopyPrevWeek = function () {
    $('#edit-copy-prev-week').on('click', cbEditCopyPrevWeek);
  };
    
  pub.bindViewNextWeek = function () {
    $('#view-next-week').on('click', cbViewNextWeek);
  };
  
  pub.bindViewPrevWeek = function () {
    $('#view-prev-week').on('click', cbViewPrevWeek);
  };

  pub.bindViewNextDay = function () {
    $('#view-next-day').on('click', cbViewNextDay);
  };
  
  pub.bindViewPrevDay = function () {
    $('#view-prev-day').on('click', cbViewPrevDay);
  };
  
  pub.bindAddDODList = function () {
    $('#edit-dod-list-add').on('click', cbAddDODList);
  };
  
  pub.bindSaveDODList = function () {
    $('#edit-dod-list-save').on('click', cbSaveDODList);
  };
  
  pub.bindSendSMS = function () {
    $('#send-sms').on('click', cbSendSMS);
  };
  
  pub.initData = function () {
    $.post('dodcal.php', {'cmd': 'getShifts'}, cbLoadShifts);
    $.post('dodcal.php', {'cmd': 'getLocations'}, cbLoadLocations);
    $.post('dodcal.php', {'cmd': 'getDODs'}, cbLoadDODs);
  };
  
  pub.initEditWeek = function () {
    var today = new Date();    
    today.setDate(today.getDate() + 0);
    
    var week = [];
    week = getWeek(today);
        
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadShifts));
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadLocations));
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiEditWeek(week);
      uiLoadEditWeek(week);
    });
  };
  
  pub.initViewWeek = function () {
    var today = new Date();    
    today.setDate(today.getDate() + 0);
    
    var week = [];
    week = getWeek(today);    
    
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadShifts));
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadLocations));
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiViewWeek(week);
      uiLoadViewWeek(week);
    });
  };

  pub.initViewDay = function () {
    var day = new Date();    
    
    if (day.getDay() == 0) { // go to next week
      day.setDate(day.getDate() + 1);
    } else if (day.getDay() == 6) { // go to next week
      day.setDate(day.getDate() + 2);
    }    
     
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadShifts));
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadLocations));
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiSetDay(day);
      uiViewDay(day);
      uiLoadViewDay();
    });
  };
  
  pub.initEditDODList = function () {
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiEditDODList();
      // uiLoadEditWeek(week);
    });
  };
  
  pub.hideEditDODList = function () {
    uiHideEditDODList();
  };  
  
  pub.initEditDODSMS = function () {
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiEditDODSMS();
      // uiLoadEditWeek(week);
    });
  };
  
  pub.hideEditDODSMS = function () {
    uiHideEditDODSMS();
  }; 
  
  pub.uiInitViewNavbar = function () {
    var $ul = $('<ul></ul>');
    $ul.append('<li><a href = "#page-view-day" data-icon="clock">Day</a></li>');
    $ul.append('<li><a href = "#page-view-week" data-icon="calendar">Week</a></li>');
    $('.view-navbar').append($ul);
  };
  
  pub.uiInitEditNavBar = function () {
    var $ul = $('<ul></ul>');
    $ul.append('<li><a href = "#page-edit-week" data-icon="calendar">Edit Week</a></li>');
    $ul.append('<li><a href = "#page-edit-dod-list" data-icon="bars">Edit DOD List</a></li>');
    $ul.append('<li><a href = "#page-edit-dod-sms" data-icon="mail">DOD SMS</a></li>');
    $('.edit-navbar').append($ul);  
  };

  
  return pub;
}) ();