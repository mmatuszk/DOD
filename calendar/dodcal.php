<?php

ini_set('display_errors', 1);

require_once('config.php');

define('EC_STATUS', 'status');
define('EC_DATA', 'data'); 
define('EC_STATUS_ERR', 'error');
define('EC_STATUS_SUCCESS', 'success');

define('CMD_GET_SHIFTS', 'getShifts');
define('CMD_GET_LOCATIONS', 'getLocations');
define('CMD_GET_DODS', 'getDODs');
define('CMD_SAVE_COVERAGE', 'saveCoverage');
define('CMD_GET_COVERAGE', 'getCoverage');

define('DB_TB_SHIFTS', 'shifts');
define('DB_COL_SHIFT_ID', 'shift_id');
define('DB_COL_SHIFT_NAME', 'shift_name');

define('DB_TB_LOCATIONS', 'locations');
define('DB_COL_LOCATION_ID', 'location_id');
define('DB_COL_LOCATION_NAME', 'location_name');

define('DB_TB_DODS', 'dods');
define('DB_COL_DOD_ID', 'dod_id');
define('DB_COL_DOD_NAME', 'dod_name');
define('DB_COL_DOD_EMAIL', 'dod_email');
define('DB_COL_DOD_CELL', 'dod_cell');

define('DB_TB_CALENDAR', 'calendar');
define('DB_COL_DATE','date');
define('DB_COL_DOD_NEXT', 'dod_next');
define('DB_COL_COVERAGE', 'coverage');

$exitCode = array();

function queryGetShifts() {
  $query = 'SELECT '.DB_COL_SHIFT_ID.','.DB_COL_SHIFT_NAME. ' FROM '.DB_TB_SHIFTS;
  return $query;
}

function queryGetLocations() {
  $query = 'SELECT '.DB_COL_LOCATION_ID.','.DB_COL_LOCATION_NAME. ' FROM '.DB_TB_LOCATIONS;
  return $query;
}

function queryGetDODs() {
  $query = 'SELECT '.DB_COL_DOD_ID.','.DB_COL_DOD_NAME.','.DB_COL_DOD_EMAIL.','.DB_COL_DOD_CELL. ' FROM '.DB_TB_DODS;
  return $query;
}

function quereyGetCoverage($date, $shift_id, $location_id) {
  $query = 'SELECT * FROM '.DB_TB_CALENDAR." ";
  $query .= 'WHERE '.DB_COL_DATE."='".$date."' AND ";
  $query .= DB_COL_SHIFT_ID.'='.$shift_id.' AND ';
  $query .= DB_COL_LOCATION_ID.'='.$location_id;
  return $query;
}

function queryInsertCoverage($date, $shift_id, $location_id, $dod_id, $dod_next, $coverage) {
  $query = "INSERT INTO ".DB_TB_CALENDAR." (".DB_COL_DATE.",";
  $query .= DB_COL_SHIFT_ID.",";
  $query .= DB_COL_LOCATION_ID.",";
  $query .= DB_COL_DOD_ID.",";
  $query .= DB_COL_DOD_NEXT.",";
  $query .= DB_COL_COVERAGE.") ";
  $query .= " VALUES(";
  $query .= "'".$date."',";
  $query .= "'".$shift_id."',";
  $query .= "'".$location_id."',";
  $query .= "'".$dod_id."',";
  $query .= "'".$dod_next."',";
  $query .= "'".$coverage."')";
  return $query;  
} 

function queryUpdateCoverage($date, $shift_id, $location_id, $dod_id, $dod_next, $coverage) {
  $query = "UPDATE ".DB_TB_CALENDAR." SET ";
  $query .= DB_COL_DOD_ID."='".$dod_id."', ";
  $query .= DB_COL_DOD_NEXT."='".$dod_next."', ";
  $query .= DB_COL_COVERAGE."='".$coverage."' ";
  $query .= 'WHERE '.DB_COL_DATE."='".$date."' AND ";
  $query .= DB_COL_SHIFT_ID.'='.$shift_id.' AND ';
  $query .= DB_COL_LOCATION_ID.'='.$location_id;
  return $query;
}

// echo quereyGetCoverage('2017-08-07', '1', '1');
// echo queryInsertCoverage('2017-08-08', '1', '1', '3', '1', 'Steve (full)');
// echo queryUpdateCoverage('2017-08-07', '1', '1', '10', '1', 'Kelly');
// exit();

$link = mysqli_connect(DB_SERVER, DB_SERVER_USERNAME, DB_SERVER_PASSWORD, DB_DATABASE);
if (mysqli_connect_errno()) {
	$exitCode[EC_STATUS] = EC_STATUS_ERR;
	$exitCode[EC_DATA] = 'Could not connect: ' . mysqli_connect_error();
  echo json_encode($exitCode); 
  exit();
}

if (isset($_POST['cmd'])) {
  $cmd = $_POST['cmd'];
  // echo $cmd;
  if ($cmd == CMD_GET_SHIFTS) {
    $query = queryGetShifts();
    $result = mysqli_query($link, $query);
    $data = array();
    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
      }
    }
    $exitCode[EC_STATUS] = EC_STATUS_SUCCESS;
    $exitCode[EC_DATA] = json_encode($data);
  } else if ($cmd == CMD_GET_LOCATIONS) {
    $query = queryGetLocations();
    $result = mysqli_query($link, $query);
    $data = array();
    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
      }
    }
    $exitCode[EC_STATUS] = EC_STATUS_SUCCESS;
    $exitCode[EC_DATA] = json_encode($data);
  } else if ($cmd == CMD_GET_DODS) {
    $query = queryGetDODs();
    $result = mysqli_query($link, $query);
    $data = array();
    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
      }
    }
    $exitCode[EC_STATUS] = EC_STATUS_SUCCESS;
    $exitCode[EC_DATA] = json_encode($data);
  } else if ($cmd == CMD_SAVE_COVERAGE) {
    $date = $_POST['date'];
    $shift_id = $_POST['shift_id'];
    $location_id = $_POST['location_id'];
    $dod_id = $_POST['dod_id'];
    $dod_next = $_POST['dod_next'];
    $coverage = $_POST['coverage'];
    $query = quereyGetCoverage($date, $shift_id, $location_id);
    $result = mysqli_query($link, $query);
    if (mysqli_num_rows($result) == 0) {
      $query = queryInsertCoverage($date, $shift_id, $location_id, $dod_id, $dod_next, $coverage);
      mysqli_query($link, $query);
    } else {
      $query = queryUpdateCoverage($date, $shift_id, $location_id, $dod_id, $dod_next, $coverage);
      mysqli_query($link, $query);
    }
    $exitCode[EC_STATUS] = EC_STATUS_SUCCESS;
    $exitCode[EC_DATA] = $cmd.": OK";    
  } else if ($cmd == CMD_GET_COVERAGE) {
    $date = $_POST['date'];
    $shift_id = $_POST['shift_id'];
    $location_id = $_POST['location_id'];    
    $query = quereyGetCoverage($date, $shift_id, $location_id);
    $result = mysqli_query($link, $query);
    $data = array();
    if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
      }
      $exitCode[EC_STATUS] = EC_STATUS_SUCCESS;
      $exitCode[EC_DATA] = json_encode($data);
    } else {
      $exitCode[EC_STATUS] = EC_STATUS_ERR;
      $exitCode[EC_DATA] = $cmd.': No data found';
    }
  } else {
    $exitCode[EC_STATUS] = EC_STATUS_ERR;
    $exitCode[EC_DATA] = $cmd.': Command not recognized';
  }
} else {
    $exitCode[EC_STATUS] = EC_STATUS_ERR;
    $exitCode[EC_DATA] = 'no data sent';
}

echo json_encode($exitCode); 
?>
