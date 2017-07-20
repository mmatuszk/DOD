<?php

ini_set('display_errors', 1);

$toMap = array(
	"baltrushes" => "Robin.J.Baltrushes@kp.org",
	"chan" => "Melissa.M.Lewis@kp.org",
	"lee" => "Gregory.W.Lee@kp.org",
	"matuszkiewicz" => "marcin.matuszkiewicz@kp.org",
	"nash" => "Steven.p.nash@kp.org",
	"nelson-munson" => "Kaaren.A.Nelson-Munson@kp.org",
	"pierce" => "Lindsey.X.Pierce@kp.org",
	"salinas" => "Cynthia.L.Salinas@kp.org",
	"scott" => "Stephanie.A.Scott@kp.org",
	"thaker" => "geetha.r.thaker@kp.org",
	"welsh" => "Kelly.A.Welsh@kp.org",
	"van arsdell" => "Kaitlyn.M.Van-Arsdell@kp.org"
);

$exitCode = array ();

if (isset($_POST['to']) && isset($_POST['title']) && isset($_POST['id']) && isset($_POST['event'])) {
	$to = strtolower($_POST['to']);
	
	if (array_key_exists($to, $toMap)) {
		$email = $toMap[$to];
		$from_name = "DOD";
		$from_address = "dod@jewelmirror.com";
		// $headers = 'From: dod@jewelmirror.com' . "\r\n" .
	    // 'Reply-To: no-reply@jewelmirror.com' . "\r\n" .
	    // 'X-Mailer: PHP/' . phpversion();
			
	  //Create Email Headers
	  $mime_boundary = "----Meeting Booking----".MD5(TIME());
	
	  $headers = "From: ".$from_name." <".$from_address.">\n";
	  $headers .= "Reply-To: ".$from_name." <".$from_address.">\n";
	  $headers .= "MIME-Version: 1.0\n";
	  $headers .= "Content-Type: multipart/alternative; boundary=\"$mime_boundary\"\n";
	  $headers .= "Content-class: urn:content-classes:calendarmessage\n";
	  
	  //Create Email Body (HTML)
	  $message = "--$mime_boundary\r\n";
	  $message .= "Content-Type: text/html; charset=UTF-8\n";
	  $message .= "Content-Transfer-Encoding: 8bit\n\n";
	  $message .= "<html>\n";
	  $message .= "<body>\n";
	  $message .= '<p>Your DOD reminder.  Add to your calendar</p>';
	  $message .= "</body>\n";
	  $message .= "</html>\n";
	  $message .= "--$mime_boundary\r\n";
					
		$message .= 'Content-Type: text/calendar;name="dod.ics";method=REQUEST'."\n";
		$message .= "Content-Transfer-Encoding: 8bit\n\n";
		$message .= $_POST['event'];
		
		// echo $_POST['event'];
		$mailsent = mail($email, $_POST['title'], $message, $headers);
		$exitCode['status'] = 'success';
		$exitCode['message'] = $_POST['to'].'|'.$_POST['title'];
		$exitCode['id'] = $_POST['id'];
	} else {
		$exitCode['status'] = 'failed';
		$exitCode['message'] = "Recipient not found: ".$to;
		$exitCode['id'] = $_POST['id'];
	}
	
} else {
	$exitCode['status'] = "failed";
	$exitCode['message'] = "no data recieved";
}

echo json_encode($exitCode);

?>
