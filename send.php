<?php

ini_set('display_errors', 1);

if (isset($_POST['to']) && isset($_POST['title']) && isset($_POST['event'])) {
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
	$mailsent = mail($_POST['to'], $_POST['title'], $message, $headers);
	echo $_POST['to'].'|'.$_POST['title'];
} else {
	echo "no data sent";
}

?>