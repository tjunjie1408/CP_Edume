<?php
include "connect_db.php";
header('Content-Type: application/json');
$data=json_decode(file_get_contents("php://input"),true);
$email=$data["email"];
$newPassword=$data["newPassword"];

if (empty(trim($email))|| empty(trim($newPassword))) {
    echo json_encode(["status"=>422,"message"=>"Missing data"]);
    exit;
}

//Get user info
$stmt=$conn->prepare("SELECT password FROM users WHERE email=?");
$stmt->bind_param("s",$email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows==0) {
    echo json_encode(["status"=>422,"message"=>"Email does not exist"]);
    exit;
}
$stmt->bind_result($hashed_password);
$stmt->fetch();


//Check if new password is same as old password
if(password_verify($newPassword,$hashed_password)){
    echo json_encode(["status"=>422,"message"=>"New password cannot be the same as the old password"]);
    exit;
}
$stmt->close();




$stmt=$conn->prepare("UPDATE users SET password=? WHERE email=?");
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt->bind_param("ss",$hashedPassword,$email);
if ($stmt->execute()) {
    echo json_encode(["status"=>200,"message"=>"Password reset successfully"]);
} else {
    echo json_encode(["status"=>500,"message"=>"Failed to reset password"]);
}
$stmt->close();
$conn->close();
?>
