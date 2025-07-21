<?php
header('Content-Type: application/json');

// بررسی درخواست POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// دریافت داده‌های ارسال شده
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE || !$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// اعتبارسنجی داده‌ها
if (!isset($data['products']) || !isset($data['categories'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data structure']);
    exit;
}

// ساختار داده‌های جدید
$newData = [
    'products' => $data['products'],
    'categories' => $data['categories']
];

// ذخیره در فایل
try {
    $result = file_put_contents('data.json', json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception('Failed to write to file');
    }
    
    echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>