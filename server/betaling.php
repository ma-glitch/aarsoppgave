<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/phpmailer/phpmailer/src/Exception.php';
require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require '../vendor/phpmailer/phpmailer/src/SMTP.php';

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

$stmt = $conn->prepare("SELECT epost, fornavn, etternavn FROM kundeinfo WHERE kundeid = ?");
$stmt->bind_param("s", $customerId);
$stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $epost = $row['epost'];
        $navn = $row['fornavn'] + ' ' +$row['etternavn'];
    

$mail = new PHPMailer(true);

            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'testdex38@gmail.com';
            $mail->Password = 'cceq qpfw qmlk agyk';
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;

            $mail->setFrom('testdex38@gmail.com');
            $mail->addAddress($epost);
            $mail->isHTML(true);

            $mail->Subject = 'Bekreftelse på bestilling: ' . $order_id;
            $mail-> Body = "Hei, ". $navn . ",<br>
            <br>
            Dette er en bekreftelse på at vi har mottatt din bestilling:<br>
            <br>
            Ordrenummer: " . $order_id .  "<br>
            Dato sendt inn: " . date("Y-m-d") . "<br>
            <br>
            Vi ønsker å forsikre deg om at vi tar din henvendelse på alvor, og vårt supportteam vil gjennomgå saken din så raskt som mulig.<br>
            <br>
            For referanseformål, her er en kort oppsummering av din henvendelse:<br>
            <br>
            Beskrivelse av problemet:<br>
            <br>
            Vi vil holde deg oppdatert på statusen for saken din. Hvis du har ytterligere spørsmål eller informasjon å legge til, vennligst svar på denne e-posten eller kontakt vårt supportteam direkte.<br>
            <br>
            Takk for din tålmodighet og forståelse.<br>
            <br>
            Vennlig hilsen,<br>
            SKODEX AS";

            $mail->send();
}



$stmt = $conn->prepare("DELETE FROM handlekurv WHERE kundeid = ?");
$stmt->bind_param("i", $customerId);
$stmt->execute();
$stmt->close();

$conn->close();
?>
