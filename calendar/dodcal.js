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
  
  getCurrentWeek = function (today) {
    var mon = new Date();
    var week = [];

    if (today.getDay() == 0) { // go to next week
      mon.setDate(today.getDate() + 1);
    } else if (today.getDay() == 6) { // go to next week
      mon.setDate(today.getDate() + 2);
    } else {
      mon.setDate(today.getDate() - today.getDay() + 1);
    }
    
    console.log(mon);
    for (var i = 0; i < 5; i++) {
      var tmp = new Date();
      tmp.setDate(mon.getDate() + i);
      week.push(tmp);
    }
    console.log(week);
    return week;
  };
  
  /*
   * Function: uiGetDate
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
  uiGetDate = function (day, shift) {
    var id = 'date-'+day+'-'+shift;
    var tmp = $('#'+id).text();
    return new Date(tmp);
  };
  
  /*
   * Function: uiGetNextDOD
   * 
   * Parameters
   *    1 - BOMB
   *    2 - Piedmont
   */
  uiGetNextDOD = function (day, shift, location) {
    var id = 'next-dod-'+day+'-'+shift+'-'+location;
    return $('#'+id).prop('checked') ? 1 : 0;
  };
  
  pub.uiGetNextDOD = uiGetNextDOD;
  
  uiGetDOD = function(day, shift, location) {
    var id = 'dod-'+day+'-'+shift+'-'+location;
    return $('#'+id).val();
  };
  
  uiGetCoverage = function(day, shift, location) {
    var id = 'coverage-'+day+'-'+shift+'-'+location;
    return $('#'+id).val();    
  };
  
  uiGetWeek = function () {
    coverage = [];
    for (var i = 0; i < 5; i++) {
      var tmp = {'am': {'1': {}, '2': {}}, 'pm': {'1': {}, '2': {}}};
      tmp['am']['1']['date'] = uiGetDate(i, 'am');
      tmp['am']['1']['dod_next'] = uiGetNextDOD(i, 'am', 1);
      tmp['am']['1']['dod_id'] = uiGetDOD(i, 'am', 1);
      tmp['am']['1']['coverage'] = uiGetCoverage(i, 'am', 1);
      
      tmp['am']['2']['date'] = uiGetDate(i, 'am');
      tmp['am']['2']['dod_next'] = uiGetNextDOD(i, 'am', 2);
      tmp['am']['2']['dod_id'] = uiGetDOD(i, 'am', 2);
      tmp['am']['2']['coverage'] = uiGetCoverage(i, 'am', 2);

      tmp['pm']['1']['date'] = uiGetDate(i, 'pm');
      tmp['pm']['1']['dod_next'] = uiGetNextDOD(i, 'pm', 1);
      tmp['pm']['1']['dod_id'] = uiGetDOD(i, 'pm', 1);
      tmp['pm']['1']['coverage'] = uiGetCoverage(i, 'pm', 1);
      
      tmp['pm']['2']['date'] = uiGetDate(i, 'pm');
      tmp['pm']['2']['dod_next'] = uiGetNextDOD(i, 'pm', 2);
      tmp['pm']['2']['dod_id'] = uiGetDOD(i, 'pm', 2);
      tmp['pm']['2']['coverage'] = uiGetCoverage(i, 'pm', 2);

      coverage.push(tmp);
    }
    return coverage;
  };
  
  uiEditWeek = function(day) {
    var week = [];

    week = getCurrentWeek(day);
    
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
        $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
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
        $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
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
        $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
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
        $select.append('<option value="'+dods[j].dod_id+'">'+dods[j].dod_name+'</option>');
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
    $("tbody tr:even").css("background-color", "#F0F0F0");
  };
  
  cbSaveEditWeek = function () {
    var coverage = uiGetWeek();
    console.log(coverage);
    
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
      console.log(cmd);
      
      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['am']['2']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '1';
      cmd['location_id'] = '2';
      cmd['dod_id'] = coverage[i]['am']['2']['dod_id'];
      cmd['dod_next'] = coverage[i]['am']['2']['dod_next'];
      cmd['coverage'] = coverage[i]['am']['2']['coverage'];
      promises.push($.post('dodcal.php', cmd));
      console.log(cmd);

      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['pm']['1']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '2';
      cmd['location_id'] = '1';
      cmd['dod_id'] = coverage[i]['pm']['1']['dod_id'];
      cmd['dod_next'] = coverage[i]['pm']['1']['dod_next'];
      cmd['coverage'] = coverage[i]['pm']['1']['coverage'];
      promises.push($.post('dodcal.php', cmd));
      console.log(cmd);
      
      var cmd = {};
      cmd['cmd'] = 'saveCoverage';
      cmd['date'] = coverage[i]['pm']['2']['date'].format("yyyy-mm-dd");
      cmd['shift_id'] = '2';
      cmd['location_id'] = '2';
      cmd['dod_id'] = coverage[i]['pm']['2']['dod_id'];
      cmd['dod_next'] = coverage[i]['pm']['2']['dod_next'];
      cmd['coverage'] = coverage[i]['pm']['2']['coverage'];
      promises.push($.post('dodcal.php', cmd));
      console.log(cmd);           
    }
    $.when.apply(null, promises).done(function(r) {
      alert('Saved');
    });    
  };
  
  pub.bindSaveEditWeek = function () {
    $('#save-edit-week').on('click', cbSaveEditWeek);
  };
  
  pub.initData = function () {
    $.post('dodcal.php', {'cmd': 'getShifts'}, cbLoadShifts);
    $.post('dodcal.php', {'cmd': 'getLocations'}, cbLoadLocations);
    $.post('dodcal.php', {'cmd': 'getDODs'}, cbLoadDODs);
  };
  
  pub.initEditWeek = function () {
    var today = new Date();    
    today.setDate(today.getDate() + 0);
    
    var promises = [];
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadShifts));
    promises.push($.post('dodcal.php', {'cmd': 'getShifts'}).done(cbLoadLocations));
    promises.push($.post('dodcal.php', {'cmd': 'getDODs'}).done(cbLoadDODs));
    
    $.when.apply(null, promises).done(function(r) {
      uiEditWeek(today);
    });
  };
  
  return pub;
}) ();