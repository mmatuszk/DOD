var DOD = (function () {
	var scheduleText = "";
	var host = 'jewelmirror.com';
	var hostuid = 'dod';
	var coverageList = {
		'Mon': undefined,
		'Tue': undefined,
		'Wed': undefined,
		'Thr': undefined,
		'Fri': undefined
	};
	var days = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri'];
	var test = "A1	B1	C1\nA2	B2	C2\nA3	B3	C3";
	
	var organizer = 'marcin201@gmail.com';
	
	var pub = {};
	
	pub.onPaste = function (e) {
			console.log("Paste detected");
  		// access the clipboard using the api
  		var scheduleText = e.originalEvent.clipboardData.getData('Text');
  		// console.log(scheduleText);
  		
  		pub.processSchedule(scheduleText);
  		pub.displayCoverage();
  		  		
  		e.preventDefault();
		};						
	
	pub.bindPaste = function() {
			$("#i_schedule").bind("paste", pub.onPaste);
	};

	pub.onSend = function() {
		console.log('onSend');
		
		for (var i = 0; i < days.length; i++) {
			var day = days[i];
			
			event = pub.createCalEvent(coverageList[day], true);
			var title = 'DOD '+coverageList[day].am.date.toDateString()+' AM';
			if (coverageList[day].am.email) {
				$.post('send.php', { 'to': coverageList[day].am.email, 'title': title, 'event': event}, function (data) {
					console.log(data);
					}, 'text');				
			}

			event = pub.createCalEvent(coverageList[day], false);
			if (coverageList[day].pm.email) {
				var title = 'DOD '+coverageList[day].pm.date.toDateString()+' PM';
				$.post('send.php', { 'to': coverageList[day].pm.email, 'title': title, 'event': event}, function (data) {
					console.log(data);
					}, 'text');				
			}
		}					
	};
	
	pub.bindSend = function () {
		$('#send').bind('click', pub.onSend);
	};
	
	pub.processSchedule = function (text) {
		var rows = text.split('\n');
		var coverage;
		
		for (var i = 0; i < rows.length; i++) {
			var cols = rows[i].split('\t');
			c0 = cols[0].trim();
			
			if (c0 ===  'Monday') {
				console.log('M');
				coverage = pub.processDay(rows[i], rows[i+1]);
				coverageList['Mon'] = coverage;
				pub.createCalEvent(coverage, true);
			} else if (c0 === 'Tuesday') {
				console.log('T');
				coverage = pub.processDay(rows[i], rows[i+1]);
				coverageList['Tue'] = coverage;
			} else if (c0 === 'Wednesday') {
				console.log('W');
				coverage = pub.processDay(rows[i], rows[i+1]);
				coverageList['Wed'] = coverage;
			} else if (c0 === 'Thursday') {
				console.log('Th');
				coverage = pub.processDay(rows[i], rows[i+1]);
				coverageList['Thr'] = coverage;				
			} else if (c0 === 'Friday') {
				console.log('F');
				coverage = pub.processDay(rows[i], rows[i+1]);
				coverageList['Fri'] = coverage;
			}
		}
	};
	
	pub.processDay = function (am_row, pm_row) {
		var coverage = {
			'am': {
				'date': undefined,
				'name': undefined,
				'email': undefined,
				'coverage': undefined
			},
			'pm': {
				'date': undefined,
				'name': undefined,
				'email': undefined,
				'coverage': undefined				
			}
		};
		
		var am_cells = am_row.split('\t');
		var pm_cells = pm_row.split('\t');
		
		var dateStr = pm_cells[0].trim();
		var year = new Date().getFullYear();
		
		coverage['am']['date'] = new Date(dateStr+year);
		coverage['am']['name'] = am_cells[2].trim();
		coverage['am']['email'] = am_cells[3].trim();
		coverage['am']['coverage'] = am_cells[4].trim();

		coverage['pm']['date'] = new Date(dateStr+year);
		coverage['pm']['name'] = pm_cells[2].trim();
		coverage['pm']['email'] = pm_cells[3].trim();
		coverage['pm']['coverage'] = pm_cells[4].trim();
		
		console.log(dateStr);
		
		console.log(coverage);
		return coverage;
	};
	
	pub.createCalEvent = function (coverage, am) {
		var event = "";
		var now = new Date;
		if (am != true) {
			am = false;
		}
		
		event += 'BEGIN:VCALENDAR'+'\n';
		event += 'VERSION:2.0'+'\n';
		event += 'PRODID:DOD//V 1.0'+'\n';
		event += 'METHOD:REQUEST'+'\n';
		event += 'BEGIN:VEVENT'+'\n';
		
		var uid = now.format('yyyymmddhhMMssl')+' '+Math.random()+' '+hostuid+'@'+host;
		// console.log('UID:'+uid);
		event += 'UID:'+uid+'\n';
		event += 'DTSTAMP:'+now.format("yyyymmdd'T'hhMMss'Z'")+'\n';
		event += 'ORGANIZER;CN=Marcin Matuszkiewicz:MAILTO:marcin201@gmail.com'+'\n';
		if (am) {
			event += 'DTSTART:'+coverage.am.date.format("yyyymmdd")+'T';
			event += '083000'+'\n';
			event += 'DTEND:'+coverage.am.date.format("yyyymmdd")+'T';
			event += '123000'+'\n';
			event += 'DESCRIPTION:'+coverage.am.coverage+'\n';
			event += 'SUMMARY:DOD '+coverage.am.date.toDateString()+' AM'+'\n';
		}
		else {
			event += 'DTSTART:'+coverage.pm.date.format("yyyymmdd")+'T';
			event += '133000'+'\n';
			event += 'DTEND:'+coverage.pm.date.format("yyyymmdd")+'T';
			event += '173000'+'\n';
			event += 'DESCRIPTION:'+coverage.pm.coverage+'\n';
			event += 'SUMMARY:DOD '+coverage.pm.date.toDateString()+' PM'+'\n';			
		}
		
		
		event += 'BEGIN:VALARM'+'\n';
		event += 'TRIGGER:-PT15M'+'\n';
		event += 'ACTION:DISPLAY'+'\n';
		event += 'DESCRIPTION:Reminder'+'\n';
		event += 'END:VALARM'+'\n';
		
		
		event += 'END:VEVENT'+'\n';
		event += 'END:VCALENDAR'+'\n';
		
		// console.log(event);
		// console.log('\n');
		return event;
	};
	
	pub.displayCoverage = function() {
		var $div = $('#o_schedule');
		// Deelte any childre
		$div.children().remove();
		
		var $tab = $('<table></table>');
		$div.append($tab);
		var $h = $('<tr></tr>');
		$h.append('<td>Day</td><td>Date</td><td>Shift</td><td>DOD</td><td>DOD email</td><td>Coverage</td>');
		$tab.append($h);
		
		for (var i = 0; i < days.length; i++) {
			var day = days[i];
			var $r = $('<tr></tr>');
			$r.append('<td>'+day+'</td>');
			$r.append('<td>'+coverageList[day].am.date.toLocaleDateString("en-US")+'</td>');
			$r.append('<td>AM</td>');
			$r.append('<td>'+coverageList[day].am.name+'</td>');
			$r.append('<td>'+coverageList[day].am.email+'</td>');
			$r.append('<td>'+coverageList[day].am.coverage+'</td>');
			$tab.append($r);
	
			var $r = $('<tr></tr>');
			$r.append('<td>'+day+'</td>');
			$r.append('<td>'+coverageList[day].pm.date.toLocaleDateString("en-US")+'</td>');
			$r.append('<td>PM</td>');
			$r.append('<td>'+coverageList[day].pm.name+'</td>');
			$r.append('<td>'+coverageList[day].pm.email+'</td>');
			$r.append('<td>'+coverageList[day].pm.coverage+'</td>');
			$tab.append($r);
					
		}
		
	};
	
	pub.test = function () {
		console.log(coverageList);
	};
	
	return pub;	
})();
