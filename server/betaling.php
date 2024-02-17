<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$data = json_decode(file_get_contents("php://input"), true);

$customerId = $data['customerId'];
$shippingAddress = $data['shippingAddress'];
$products = $data['products'];
$shippingOption = $data['shippingOption'];


$stmt = $conn->prepare("INSERT INTO bestilling (dato, levering_adresse, kundeid) VALUES (NOW(), ?, ?)");
$stmt->bind_param("ss", $shippingAddress, $customerId);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();


foreach ($products as $product) {
    $stmt = $conn->prepare("INSERT INTO produkt_i_bestilling (produktid, bestillingsid, antall) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $product['produktid'], $order_id, $product['antall']);
    $stmt->execute();
    $stmt->close();
}

$stmt = $conn->prepare("DELETE FROM handlekurv WHERE kundeid = ?");
$stmt->bind_param("i", $customerId);
$stmt->execute();
$stmt->close();

$conn->close();
?>
