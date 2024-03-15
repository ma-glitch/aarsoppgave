<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

$newEmail = $data->newEmail;
$kundeid = $data->kundeid;


$stmt = $conn->prepare("UPDATE kundeinfo SET epost = ? WHERE kundeid = ?");
$stmt->bind_param("si", $newEmail, $kundeid);

if ($stmt->execute()) {
    $response = array(
        'success' => true,
        'message' => 'Passord updated successfully.'
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'Failed to update Passord.'
    );
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
