<?php
session_start();

// Redirect if not logged in
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}

// Fetch CSV from Google Sheets
$csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQViNGxu9LXZjltBcSgD9d5PObSO_fYa4YwSKjnT69-m5sxCxZEahmnK7JzJXJNkKoyhUKqT6Kgxjkd/pub?output=csv";
$csvString = file_get_contents($csvUrl);

// Convert CSV to array
$rows = array_map('str_getcsv', preg_split("/\r\n|\n|\r/", trim($csvString)));

// Remove header row
array_shift($rows);

// Prepare data
$data = [];
foreach ($rows as $row) {
    if (count($row) < 6) continue; // skip malformed rows
    $data[] = [
        "name"     => $row[0],
        "photo"    => $row[1],
        "age"      => $row[2],
        "country"  => $row[3],
        "interest" => $row[4],
        "networth" => $row[5],
    ];
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="dashboard.css">
</head>

<body>

    <!-- Layout Buttons -->
    <div id="menu">
        <button onclick="transform(targets.table, 2000)">TABLE</button>
        <button onclick="transform(targets.sphere, 2000)">SPHERE</button>
        <button onclick="transform(targets.helix, 2000)">DOUBLE HELIX</button>
        <button onclick="transform(targets.grid, 2000)">GRID</button>

        <!-- Legend -->
        <div id="legend">
            <span>LOW</span>
            <div id="legend-bar"></div>
            <span>HIGH</span>
        </div>
    </div>

    </div>

    <!-- Loading Spinner -->
    <div id="spinner">
        <div></div>
        Loading data...
    </div>

    <!-- Pass PHP data to JS -->
    <script>
        window.SHEET_DATA = <?= json_encode($data) ?>;
        console.log("SHEET_DATA:", window.SHEET_DATA);
    </script>

    <!-- Tween.js -->
    <script src="https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js"></script>

    <!-- Main JS bundle -->
    <script src="dist/bundle.js"></script>

</body>

</html>