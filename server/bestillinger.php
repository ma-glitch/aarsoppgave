<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$customerId = $_GET['customerId'];

    $stmt = $conn->prepare("SELECT bestilling.bestillingsid, produkt_i_bestilling.antall, produkt.navn, produkt.bilde, produkt.pris, bestilling.dato, bestilling.levering_adresse, kundeinfo.fornavn
    FROM bestilling
    INNER JOIN produkt_i_bestilling ON bestilling.bestillingsid = produkt_i_bestilling.bestillingsid
    INNER JOIN produkt ON produkt_i_bestilling.produktid = produkt.produktid
    INNER JOIN kundeinfo ON bestilling.kundeid = kundeinfo.kundeid
    WHERE kundeinfo.kundeid =?");
$stmt->bind_param("s", $customerId);
$stmt->execute();
$result = $stmt->get_result();



$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}


$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
