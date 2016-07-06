<?php
    /**
    * @fileOverview: 本文件用于 DEMO 用途，用于提供图片上传后端的接口，接收前端的上传文件请求，返回上传成功后的 URL（绝对地址）
    *
    * 原理：
    *     1. 返回的接口结构为 {errno: <错误号, 无错误则为 0>, msg: <错误信息>, data: {url: <返回的 URL>}}；
    *     2. 由于要兼容两种情况的上传：通过对话框选择本地文件上传和直接 Ctrl + V（多见于截图后），因此本文件分别进行了判断
    *
    *
    * 注意：
    *     1. 本文件的路径可以进行配置，详见 README.md 中「初始化配置」部分。
    *     2. 由于使用场景不同，请根据实际场景编写上传文件的处理。
    *     3. 本文件并没有做任何的安全方面的防护，请勿用于生产环境。
    *
    * @author: zhangbobell
    *
    * @date: 2016.07.06
    *
    */

    // 返回给前端的地址是绝对地址，这里是前缀
    $HTTP_PREFIX = 'http://localhost/kityminder-editor/';


    $errno = 0;
    $msg = 'ok';
    $url = '';


    if ((($_FILES["upload_file"]["type"] == "image/gif")
    || ($_FILES["upload_file"]["type"] == "image/jpeg")
    || ($_FILES["upload_file"]["type"] == "image/jpg")
    || ($_FILES["upload_file"]["type"] == "image/png"))
    && ($_FILES["upload_file"]["size"] < 1 * 1000 * 1000)) {

        if ($_FILES["upload_file"]["error"] > 0) {
            $errno = 414;
            $msg = $_FILES["upload_file"]["error"];
        } else {

            // 分为两种情况 `Ctrl + V` 和普通上传
            if ($_FILES["upload_file"]["name"] === 'blob') {
                $ext_name =  'png';
            } else {
                $ext_name =  array_pop(explode('.', $_FILES["upload_file"]["name"]));
            }

            $sha1_name =  sha1_file($_FILES["upload_file"]["tmp_name"]) . '.' . $ext_name;

            move_uploaded_file($_FILES["upload_file"]["tmp_name"], "upload/" . $sha1_name);
            $url = $HTTP_PREFIX . "server/upload/" . $sha1_name;
        }
    } else {
        $errno = 416;
        $msg = 'File is invalid';
    }


    $result = array(
        'errno' => $errno,
        'msg' => $msg,
        'data' => array(
            'url' => $url
        )
    );

    echo json_encode($result);