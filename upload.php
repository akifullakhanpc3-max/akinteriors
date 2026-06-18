<?php
/**
 * Hostinger Image Upload Handler
 * Deploy to: public_html/akinterious/upload.php
 *
 * POST   - Upload image (file field: "file")
 * DELETE - Delete image (X-API-Key header + JSON body {filename})
 * OPTIONS- CORS preflight
 */

$allowedOrigins = ['https://akinteriors.design', 'http://localhost:3000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0]));
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('UPLOAD_DIR', __DIR__ . '/uploads');
define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('API_KEY', getenv('UPLOAD_API_KEY') ?: 'akinteriors-upload-key-2024');
define('ALLOWED_MIMES', ['image/jpeg', 'image/png', 'image/webp']);
define('ALLOWED_EXTS', ['jpg', 'jpeg', 'png', 'webp']);

function jsonResponse(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function ensureUploadDir(): void {
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $htaccess = UPLOAD_DIR . '/.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, implode("\n", [
            'Options -ExecCGI',
            'AddHandler cgi-script .php .php3 .php4 .php5 .phtml .pl .py .jsp .asp .aspx .sh .cgi',
            '<FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|aspx|sh|cgi)$">',
            '    Order Deny,Allow',
            '    Deny from all',
            '</FilesMatch>',
        ]));
    }

    if (!file_exists(UPLOAD_DIR . '/index.html')) {
        file_put_contents(UPLOAD_DIR . '/index.html', '<!DOCTYPE html><title>Forbidden</title>');
    }
}

function sanitizeFilename(string $filename): string {
    $ts = time();
    $rand = bin2hex(random_bytes(8));
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $ext = in_array($ext, ALLOWED_EXTS) ? $ext : 'jpg';
    return "{$ts}-{$rand}.{$ext}";
}

// POST / Upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        ensureUploadDir();

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(400, ['success' => false, 'error' => 'No file uploaded or upload error']);
        }

        $file = $_FILES['file'];

        if ($file['size'] > MAX_FILE_SIZE) {
            jsonResponse(400, ['success' => false, 'error' => 'File too large (max 5MB)']);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, ALLOWED_MIMES)) {
            jsonResponse(400, ['success' => false, 'error' => 'Only JPG, PNG, WEBP allowed']);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTS)) {
            jsonResponse(400, ['success' => false, 'error' => 'Invalid file extension']);
        }

        $filename = sanitizeFilename($file['name']);
        $dest = UPLOAD_DIR . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            jsonResponse(500, ['success' => false, 'error' => 'Failed to save file']);
        }

        $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
        $url = "{$proto}://{$_SERVER['HTTP_HOST']}{$base}/uploads/{$filename}";

        echo json_encode(['success' => true, 'imageUrl' => $url, 'filename' => $filename]);
    } catch (Throwable $e) {
        jsonResponse(500, ['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
    }
    exit;
}

// DELETE / Delete
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if ($key !== API_KEY) {
        jsonResponse(401, ['success' => false, 'error' => 'Unauthorized']);
    }

    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $filename = $_GET['filename'] ?? $input['filename'] ?? '';
    if (empty($filename)) {
        jsonResponse(400, ['success' => false, 'error' => 'Filename required']);
    }

    $filename = basename($filename);
    $filepath = UPLOAD_DIR . '/' . $filename;
    if (file_exists($filepath)) {
        unlink($filepath);
    }

    echo json_encode(['success' => true]);
    exit;
}

jsonResponse(405, ['success' => false, 'error' => 'Method not allowed']);
