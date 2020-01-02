<?php

include('db_connect.php');

$username = $password = $message = "";

$response = array();

if (isset($_POST['Username'])) {
    $username = mysqli_real_escape_string($conn, $_POST['Username']);
}

if (isset($_POST['Password'])) {
    $password = mysqli_real_escape_string($conn, $_POST['Password']);
}

if (isset($_POST['Operation'])) {
    $operation = $_POST['Operation'];
}

$sqlGetUser = "SELECT * from adminusers where username='$username' AND password='$password' ";
$resultGetUser = mysqli_query($conn, $sqlGetUser);

if ($operation == "Sign Up") {

    if (mysqli_affected_rows($conn) > 0) {

        $message = "User already exist";
    } else {
        $message = "Welcome to application";
        $sqlInsertUser = "INSERT  INTO adminusers (username,password) VALUES ('$username','$password') ";
        $resultInsertUser = mysqli_query($conn, $sqlInsertUser);
    }
} else if ($operation == "Login") {
    if (mysqli_affected_rows($conn) > 0) {

        $message = "Login succesfull";
    } else {

        $message = "Username or password wrong";
    }
}
$response = array('message' => $message);

echo json_encode($response);
