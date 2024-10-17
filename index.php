<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $jsonFile = 'data.json';
    $jsonData = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];

    if (!is_array($jsonData)) {
        $jsonData = [];
    }

    if (isset($data['editIndex']) && $data['editIndex'] !== '') {
        // Edit existing product
        $index = intval($data['editIndex']);
        if (isset($jsonData[$index])) {
            $jsonData[$index] = [
                'productName' => $data['productName'],
                'quantity' => $data['quantity'],
                'price' => $data['price'],
                'datetime' => $jsonData[$index]['datetime'],
                'totalValue' => $data['quantity'] * $data['price']
            ];
        }
    } else {
        // Add new product
        $newProduct = [
            'productName' => $data['productName'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'datetime' => date('Y-m-d H:i:s'),
            'totalValue' => $data['quantity'] * $data['price']
        ];
        $jsonData[] = $newProduct;
    }

    file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getProducts') {
    header('Content-Type: application/json');
    $jsonFile = 'data.json';
    $jsonData = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];
    echo json_encode(is_array($jsonData) ? $jsonData : []);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Inventory</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Product Inventory</h1>
        
        <form id="productForm">
            <input type="hidden" id="editIndex" name="editIndex" value="">
            <div class="mb-3">
                <label for="productName" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="productName" name="productName" required>
            </div>
            <div class="mb-3">
                <label for="quantity" class="form-label">Quantity in Stock</label>
                <input type="number" class="form-control" id="quantity" name="quantity" required>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price per Item</label>
                <input type="number" class="form-control" id="price" name="price" step="0.01" required>
            </div>
            <button type="submit" class="btn btn-primary" id="submitBtn">Submit</button>
            <button type="button" class="btn btn-secondary" id="cancelBtn" style="display:none;">Cancel</button>
        </form>

        <div id="productTable" class="mt-5"></div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>