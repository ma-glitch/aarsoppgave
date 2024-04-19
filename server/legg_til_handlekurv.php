<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
 header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");
 header("Content-Type: application/json; charset=UTF-8");


require_once("config.php");


$request_body = file_get_contents('php://input');
if(empty($request_body)) {
    $response = array(
        'success' => false,
        'message' => 'Request body is empty.'
    );
    echo json_encode($response);
    exit();
}


$data = json_decode($request_body);


if (!isset($data->customerId) || !isset($data->productId) || !isset($data->quantity)) {
    $response = array(
        'success' => false,
        'message' => 'Missing required fields in the request data.'
    );
    echo json_encode($response);
    exit();
}


$customerId = $data->customerId;
$productId = $data->productId;
$quantity = $data->quantity;

$stmt3 = $conn->prepare("SELECT antall FROM handlekurv WHERE kundeid = ? AND produktid = ?");
$stmt3->bind_param("ii", $customerId, $productId);
$stmt3->execute();
$stmt3->store_result();

if ($stmt3->num_rows() > 0) {
    $stmt3->bind_result($existingQuantity);
    $stmt3->fetch();
    $newQuantity = $existingQuantity + $quantity;
    $stmt = $conn->prepare("UPDATE handlekurv SET antall = ? WHERE kundeid = ? AND produktid = ?");
    $stmt->bind_param("iii", $newQuantity, $customerId, $productId);
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
} else {
    $stmt2 = $conn->prepare("INSERT INTO handlekurv (kundeid, produktid, antall) VALUES (?, ?, ?)");
    $stmt2->bind_param("iii", $customerId, $productId, $quantity);
    if ($stmt2->execute()) {
        $response = array(
            'success' => true,
            'message' => 'Item added to cart successfully.'
        );
    } else {
        $response = array(
            'success' => false,
            'message' => 'Failed to add item to cart.'
        );
    }
}


$stmt3->close();
$stmt2->close();
$conn->close();

echo json_encode($response);
?>
