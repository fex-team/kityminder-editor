<?php
/*
  上传文件 demo，用不了，仅作为示例
 */
if (isset($_FILES['upload_file'])) {
  $file = $_FILES['upload_file']['tmp_name'];
  if (filesize($file) > 1024 * 1024 * 5) {
    http_response_code(414);
    echo 'file too large';
    exit;
  }

  $imagetype = exif_imagetype($file);
  if ($imagetype == IMAGETYPE_PNG || $imagetype == IMAGETYPE_JPEG || $imagetype == IMAGETYPE_GIF) {
    // 这里需要改，返回图片 url
    echo 'http://localhost/' . md5_file($file);
  } else {
    http_response_code(415);
    echo 'file type not allow';
  }
  
} else {
  http_response_code(404);
  echo "No files uploaded ...";
}
