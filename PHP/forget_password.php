<?php
include "connect_db.php";
header('Content-Type: application/json');

$data=json_decode(file_get_contents("php://input"),true);
$email=$data["email"];

if (empty(trim($email))){
    echo json_encode(["status"=>422,"message"=>"Email is required"]);
    exit;
}

$stmt=$conn->prepare("SELECT user_ID,role FROM users WHERE email=?");
$stmt->bind_param("s",$email);
$stmt->execute();
$stmt->store_result();

//Check if admin email
if ($stmt->num_rows>0) {
    $stmt->bind_result($user_ID,$role);
    $stmt->fetch();
    if((int)$role === 1){
        echo json_encode(["status"=>422,"message"=>"Admin cannot change password"]);
        exit;
    }else{
        echo json_encode(["status"=>200,"message"=>"Email exists","user_ID"=>$user_ID]);
        exit;
    }
} else {
    echo json_encode(["status"=>422,"message"=>"Email does not exist"]);
    exit;
}
$stmt->close();
$conn->close();
