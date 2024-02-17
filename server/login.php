<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

require_once('config.php');

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {


    if (isset($data["username"]) && isset($data["password"])) {
        
        $username = $data["username"];
        $password = $data["password"];
        

        if (empty($username)) {
            echo json_encode(["success" => false, "message" => "Brukernavn er nødvendig."]);
            exit();
        }

        if (empty($password)) {
            echo json_encode(["success" => false, "message" => "Passord er nødvendig."]);
            exit();
        }
       
        $sql = "SELECT * FROM kundeinfo WHERE brukernavn = ?";
        
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $username);
            if ($stmt->execute()) {
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    $stmt->bind_result($kundeid, $fornavn, $etternavn, $epost, $brukernavn, $passord,);

                    if ($stmt->fetch()) {
                       
                            session_start();

                            $_SESSION["loggedin"] = true;
                            $_SESSION["kundeid"] = $kundeid;
                            $_SESSION["fornavn"] = $fornavn;
                            $_SESSION["etternavn"] = $etternavn;
                            $_SESSION["epost"] = $epost;
                            $_SESSION["brukernavn"] = $username;
                            $_SESSION["passord"] = $passord;
                            

                            echo json_encode(array(
                                "kundeid" => $kundeid, 
                                "fornavn" => $fornavn, 
                                "etternavn" => $etternavn, 
                                "epost" => $epost
                                ));
                            exit();
                        }
                    }
                } else {
                    echo json_encode(["success" => false, "message" => "Fant ingen Brukere med det bruker navnet."]);
                    exit();
                }
            } else {
                echo json_encode(["success" => false, "message" => "Kunne ikke utføre spørringen."]);
                exit();
            }

            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Kunne ikke forberede spørringen."]);
            exit();
        }
    } else {
        echo json_encode(["success" => false, "message" => "Mangler brukernavn eller passord."]);
        exit();
    }
?>

