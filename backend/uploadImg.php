<?php
function uploadImg(int $carId)
{
    $target_dir = "img/";
    $imgName = "imagen_carro" . ($carId + 2) . ".jpg";
    $target_file = $target_dir . $imgName;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    if(!isset($_FILES["img"])){
        return $target_file;
    }
    // Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimagesize($_FILES["img"]["tmp_name"]);
        if ($check !== false) {
            // echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            $uploadOk = 0;
            exit("File is not an image.");
        }
    }
    // Check file size

    if ($_FILES["img"]["size"] > 5000000) {
        $uploadOk = 0;
        exit("La imagen seleccionada es muy pesada.");
    }
    // Allow certain file formats
    if (
        $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif"
    ) {
        $uploadOk = 0;
        exit("Solo se aceptan formatos de imagen.");
    }
    // Check if $uploadOk is set to 0 by an error
    if (move_uploaded_file($_FILES["img"]["tmp_name"], $target_file)) {
        // echo "The file " . htmlspecialchars(basename($_FILES["img"]["name"])) . " has been uploaded.";
    } else {
        exit("Hubo un error subiendo el archivo.");
    }
    return $imgName;
}
?>