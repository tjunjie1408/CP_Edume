<?php 
session_start();
include "connect_db.php";
header("Content-Type: application/json");
$data=json_decode(file_get_contents("php://input"),true);
$email=$data["email"];
$password=$data["password"];

//Form Validation
if (empty(trim($email))||empty(trim($password))) {
    echo json_encode(["status"=>422,"message"=>"All fields are required"]);
    exit;
}

//Email Validation
if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status"=>422,"message"=>"Invalid email address"]);
    exit;
}


//Check if email exists
$stmt=$conn->prepare("SELECT user_ID,username,password,role FROM users WHERE email=?");
$stmt->bind_param("s",$email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows==0) {
    echo json_encode(["status"=>422,"message"=>"Email does not exist"]);
    exit;
}
$stmt->bind_result($user_ID,$username,$hashed_password,$role);
$stmt->fetch();

//Verify Password
if (!password_verify($password,$hashed_password)) {
    echo json_encode(["status"=>422,"message"=>"Incorrect password"]);
    exit;
}


//Set Session Variables
$_SESSION["user_ID"]=$user_ID;
$_SESSION["username"]=$username;
$_SESSION["role"]=(int)$role;
echo json_encode(["status"=>200,"message"=>"Login successful","role"=>$_SESSION["role"]]);
$stmt->close();
$conn->close();
?>