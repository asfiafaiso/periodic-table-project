<?php
require_once 'vendor/autoload.php';
session_start();

// If user already logged in
if (isset($_SESSION['user'])) {
    header("Location: dashboard.php");
    exit;
}

$client = new Google\Client();
$client->setClientId("48687981210-vqb4iesphh1uepla0ja08oj3m99eu4vi.apps.googleusercontent.com");
$client->setRedirectUri("http://localhost:8000/google-login.php");
$client->addScope("email");
$client->addScope("profile");
$client->setAccessType("offline");
$client->setPrompt("select_account");

$loginUrl = $client->createAuthUrl();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Sign In with Google</title>
    <style>
        body {
            font-family: Arial;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            background:#ffffff;
        }
        .card {
            background:white;
            width:380px;
            padding:40px 30px;
            text-align:center;
            border-radius:12px;
            box-shadow:0 4px 16px rgba(0,0,0,0.12);
        }
        .title {
            font-size:24px;
            font-weight:bold;
            margin-bottom:10px;
        }
        .subtitle {
            font-size:14px;
            color:#777;
            margin-bottom:25px;
        }
        .google-btn {
            display:flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            width:100%;
            padding:12px 0;
            background:#4285F4;
            color:white;
            font-size:16px;
            border-radius:5px;
            text-decoration:none;
        }
        .google-btn img {
            width:20px;
            height:20px;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="title">Welcome Back</div>
        <div class="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>

        <a class="google-btn" href="<?= $loginUrl ?>">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo">
            Sign in with Google
        </a>
    </div>

</body>
</html>
