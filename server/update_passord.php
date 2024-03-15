<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

$newPassword = $data->newPassword;
$kundeid = $data->kundeid;


$stmt = $conn->prepare("UPDATE kundeinfo SET passord = ? WHERE kundeid = ?");
$stmt->bind_param("ii", $newPassword, $kundeid);

if ($stmt->execute()) {
    $response = array(
        'success' => true,
        'message' => 'Quantity updated successfully.'
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'Failed to update quantity.'
    );
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
