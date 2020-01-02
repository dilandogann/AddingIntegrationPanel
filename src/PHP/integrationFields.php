<?php

include('db_connect.php');

$name = $description = $file = $fields = $selected = $message = $oldName = $operation = $text = $IntegrationRequirements = "";

$response = array();

if (isset($_POST['Name'])) {
  $name = mysqli_real_escape_string($conn, $_POST['Name']);
}

if (isset($_POST['Description'])) {
  $description = mysqli_real_escape_string($conn, $_POST['Description']);
}

if (isset($_POST['File'])) {
  $file = mysqli_real_escape_string($conn, $_POST['File']);
}

if (isset($_POST['Fields'])) {
  $fields = $_POST['Fields'];
}

if (isset($_POST['IntegrationRequirements'])) {
  $IntegrationRequirements = $_POST['IntegrationRequirements'];
}

if (isset($_POST['oldName'])) {
  $oldName = $_POST['oldName'];
}

if (isset($_POST['Operation'])) {
  $operation = $_POST['Operation'];
}

$fields = json_decode($_POST['Fields'], true);
$IntegrationRequirements = json_decode($_POST['IntegrationRequirements'], true);


if ($operation == "Add") {
  $sql = "SELECT * from integrations where name='$name'";
  $result = mysqli_query($conn, $sql);

  if (mysqli_affected_rows($conn) > 0) {

    $message = "Bu entegrasyon  mevcut";
  } else {

    $sqlAddIntegration = "INSERT INTO integrations(name,description,file) VALUES ('$name','$description','$file')";
    $resultAddIntegration = mysqli_query($conn, $sqlAddIntegration);
    $id = $conn->insert_id;
    foreach ($fields as $field) {

      $text = $field["text"];
      $inputType = $field["inputType"];
      $radioFields = $field["RadioFields"];
      if ($text != "" && $radioFields != "") {
        $sqlAddFields = "INSERT INTO integrationfields(integrationId,field,inputType) VALUES ('$id','$text','$inputType')";
        $resultAddFields = mysqli_query($conn, $sqlAddFields);

        if ($inputType == "Radio") {

          $fieldId = $conn->insert_id;

          foreach ($radioFields as $radio) {
            $optionText = $radio["text"];
            $sql = "INSERT INTO radiofieldoptions(integrationId,fieldId,fieldoption) VALUES ('$id','$fieldId','$optionText')";
            $result = mysqli_query($conn, $sql);
          }
        }
      }
    }

    foreach ($IntegrationRequirements as $req) {

      $text = $req["text"];
      if ($text != "") {
        $sqlAddRequirements = "INSERT into authanticationrequirements (integrationId,requirement) VALUES ('$id','$text')";
        $resultAddFields = mysqli_query($conn, $sqlAddRequirements);
      }
    }
  }
  $message = "Integration succesfully added";
}



if ($operation == "Update") {

  $sqlGetIntegration = "SELECT * from integrations where name='$oldName'";
  $resultGetIntegration = mysqli_query($conn, $sqlGetIntegration);


  if ($rowSelect = mysqli_fetch_assoc($resultGetIntegration)) {

    $integrationId = $rowSelect["id"];
    //Update integration values
    $sqlUpdateIntegration = "UPDATE integrations set name='$name',description='$description',file='$file' where name='$oldName'";
    $resultUpdateIntegration = mysqli_query($conn, $sqlUpdateIntegration);

    //Select integration fields by integration id
    $sqlSelectFields = "SELECT * from integrationfields where integrationId='$integrationId'";
    $resultSelectFields = mysqli_query($conn, $sqlSelectFields);

    if (mysqli_affected_rows($conn) > 0) {

      while ($row = mysqli_fetch_assoc($resultSelectFields)) {

        $selectedFieldId = $row["id"];
        $selectedName = $row["field"];
        $selectedInputType = $row["inputType"];
        $flag = true;

        foreach ($fields as $field) {

          //Name ve inputType değişmediyse
          if ($selectedName == $field["text"] && $selectedInputType == $field["inputType"]) {
            // echo "Name ve inputType değişmediyse\n";
            $flag = false;
            //Input type radio ise değişenleri güncelleyip silme ekleme işlemleri yapılıyor
            if ($selectedInputType == "Radio") {

              $radioFields = $field["RadioFields"];

              $sqlSelectRadioOption = "SELECT * from radiofieldoptions where fieldId='$selectedFieldId' AND integrationId='$integrationId'";
              $resultSelectRadioOption = mysqli_query($conn, $sqlSelectRadioOption);


              if (mysqli_affected_rows($conn) > 0) {
                while ($rowRadioFields = mysqli_fetch_assoc($resultSelectRadioOption)) {

                  $radioOption = $rowRadioFields["fieldoption"];
                  $rowIdRadioOption = $rowRadioFields["id"];
                  $flagRadioOption = true;

                  foreach ($radioFields as $radio) {

                    $optionText = $radio["text"];
                    $oldOptionText = $radio["oldRadioName"];

                    if ($radioOption == $oldOptionText) {
                      $flagRadioOption = false;

                      //Option name güncellendi
                      $sqlUpdateRadioText = "UPDATE radiofieldoptions set fieldoption='$optionText' where  id='$rowIdRadioOption'";
                      $resultUpdateRadioOptionField = mysqli_query($conn, $sqlUpdateRadioText);

                      //Option daha önceden seçili ise ticketfields'dan silindi
                      $sqlDeleteSelectedRadioValues = "DELETE from ticketfields where integrationId='$integrationId' AND fieldId='$selectedFieldId' AND value='$oldOptionText' ";
                      $resultDeleteSelectedRadioValues = mysqli_query($conn, $sqlDeleteSelectedRadioValues);
                    }
                  }
                  if ($flagRadioOption == true) {

                    //Silinen option database'dan silindi
                    $sqlDeleteRadioText = "DELETE from radiofieldoptions  where  id='$rowIdRadioOption'";
                    $resultDeleteRadioOptionField = mysqli_query($conn, $sqlDeleteRadioText);

                    //Option daha önceden seçili ise ticketfields'dan silindi
                    $sqlDeleteSelectedRadioValues = "DELETE from ticketfields where integrationId='$integrationId' AND fieldId='$selectedFieldId' ";
                    $resultDeleteSelectedRadioValues = mysqli_query($conn, $sqlDeleteSelectedRadioValues);
                  }
                }
              }
              foreach ($radioFields as $radio) {

                $optionText = $radio["text"];
                // $oldOptionText = $radio["oldRadioName"];
                $flagRadioOption = true;

                $sqlSelectRadioOption = "SELECT * from radiofieldoptions where fieldId='$selectedFieldId' AND integrationId='$integrationId'";
                $resultSelectRadioOption = mysqli_query($conn, $sqlSelectRadioOption);

                if (mysqli_affected_rows($conn) > 0) {

                  while ($rowRadioFields = mysqli_fetch_assoc($resultSelectRadioOption)) {
                    $radioOption = $rowRadioFields["fieldoption"];
                    if ($radioOption == $optionText) {
                      $flagRadioOption = false;
                    }
                  }
                  if ($flagRadioOption == true) {
                    $sqlInsertNewRadioField = "INSERT into radiofieldoptions  (integrationId,fieldId,fieldoption) VALUES ('$integrationId','$selectedFieldId','$optionText')";
                    $resultInsertNewRadioFiled = mysqli_query($conn, $sqlInsertNewRadioField);
                  }
                }
              }
            }
          }

          //Name'i değişmedi 
          else if ($selectedName == $field["text"]) {

            $flag = false;
            $inputType = $field["inputType"];
            $oldInputType = $field["oldInputType"];

            $sqlUpdateIntegrationfield = "UPDATE integrationfields set inputType='$inputType' where  id='$selectedFieldId'";
            $resultUpdateIntegrationField = mysqli_query($conn, $sqlUpdateIntegrationfield);
            //Bu sorgu çalışmadı buna bak
            $sqlDeleteFromSelectedRadioValues = "DELETE from ticketfields where integrationId='$integrationId' AND fieldId='$selectedFieldId'";
            $resultDeleteFromSelectedRadioValues = mysqli_query($conn, $sqlDeleteFromSelectedRadioValues);

            if ($oldInputType == "Radio") {

              $sqlDeleteOldRadioFields = "DELETE from radiofieldoptions where fieldId='$selectedFieldId' AND integrationId='$integrationId' ";
              $resultDeleteOldRadioFields = mysqli_query($conn, $sqlDeleteOldRadioFields);
              //Burda kaldım
            } else if ($inputType == "Radio") {

              $radioFields = $field["RadioFields"];
              foreach ($radioFields as $radio) {

                $optionText = $radio["text"];

                $sqlInsertNewRadioField = "INSERT into radiofieldoptions  (integrationId,fieldId,fieldoption) VALUES ('$integrationId','$selectedFieldId','$optionText')";
                $resultInsertNewRadioFiled = mysqli_query($conn, $sqlInsertNewRadioField);
              }
            }
          }
        }
        //Silinen field option diğer tablolardan da silindi
        if ($flag == true) {

          $sqlDeleteIntegrationField = "DELETE from integrationfields where id='$selectedFieldId' ";
          $resultDeleteIntegrationField = mysqli_query($conn, $sqlDeleteIntegrationField);

          $sqlDeleteOldRadioFields = "DELETE from radiofieldoptions where fieldId='$selectedFieldId' AND integrationId='$integrationId' ";
          $resultDeleteOldRadioFields = mysqli_query($conn, $sqlDeleteOldRadioFields);

          $sqlDeleteFromSelectedRadioValues = "DELETE from ticketfields where integrationId='$integrationId' AND fieldId='$selectedFieldId' ";
          $resultDeleteFromSelectedRadioValues = mysqli_query($conn, $sqlDeleteFromSelectedRadioValues);
        }
      }
    }


    //Yeni eklenen integration fieldları tablolara eklendi
    foreach ($fields as $field) {
      $flag = true;
      $fieldName = $field["text"];
      $inputType = $field["inputType"];

      $sqlSelectOldFields = "SELECT * from integrationfields where integrationId='$integrationId' ";
      $resultSelectOldFields = mysqli_query($conn, $sqlSelectOldFields);
      if (mysqli_affected_rows($conn) > 0) {
        echo "burda\n";
        while ($rowAddNew = mysqli_fetch_assoc($resultSelectOldFields)) {
          $rowName = $rowAddNew["field"];
          if ($fieldName == $rowName) {
            $flag = false;
          }
        }
      }
      if ($flag == true) {
        $sqlInsertField = "INSERT INTO integrationfields(integrationId,field,inputType) VALUES ('$integrationId','$fieldName','$inputType')";
        $resultInsertField = mysqli_query($conn, $sqlInsertField);
        $id = $conn->insert_id;

        if ($inputType == "Radio") {

          $radioFields = $field["RadioFields"];
          foreach ($radioFields as $radio) {
            $optionText = $radio["text"];

            $sqlInsertNewRadioField = "INSERT into radiofieldoptions  (integrationId,fieldId,fieldoption) VALUES ('$integrationId','$id','$optionText')";
            $resultInsertNewRadioFiled = mysqli_query($conn, $sqlInsertNewRadioField);
          }
        }
      }
    }


    $sqlSelectIntegReq = "SELECT * from authanticationrequirements where integrationId='$integrationId'";
    $resultSelectIntegReq = mysqli_query($conn, $sqlSelectIntegReq);

    if (mysqli_affected_rows($conn) > 0) {

      while ($rowSelectedReq = mysqli_fetch_assoc($resultSelectIntegReq)) {
        $reqId = $rowSelectedReq["id"];
        $reqName = $rowSelectedReq["requirement"];
        echo "reqName:" . $reqName . "\n";
        $flag = true;
        foreach ($IntegrationRequirements as $req) {
          $old = $req["oldReqName"];
          $new = $req["text"];
          echo "old:" . $old . "\n";
          if ($old == $reqName) {
            $flag = false;
            $sqlUpdateRequirmentField = "UPDATE authanticationrequirements set requirement='$new' where id='$reqId' ";
            $resultUpdateReqField = mysqli_query($conn, $sqlUpdateRequirmentField);

            $sqlDeleteRequrValue = "DELETE from authanticationrequirementvalues where requirementId='$reqId' AND integrationId='$integrationId'";
            $resultSqldeletedRequrValue = mysqli_query($conn, $sqlDeleteRequrValue);
          }
        }

        if ($flag == true) {
          $sqldeletedRequr = "DELETE from authanticationrequirements where id='$reqId' ";
          $resultSqldeletedRequr = mysqli_query($conn, $sqldeletedRequr);

          $sqlDeleteRequrValue = "DELETE from authanticationrequirementvalues where requirementId='$reqId' AND integrationId='$integrationId'";
          $resultSqldeletedRequrValue = mysqli_query($conn, $sqlDeleteRequrValue);
        }
      }
    }


    foreach ($IntegrationRequirements  as $req) {
      $flag = true;
      $reqName = $req["text"];

      $sqlSelectIntegReq = "SELECT * from authanticationrequirements where integrationId='$integrationId'";
      $resultSelectIntegReq = mysqli_query($conn, $sqlSelectIntegReq);

      if (mysqli_affected_rows($conn) > 0) {
        while ($rowSelectedReq = mysqli_fetch_assoc($resultSelectIntegReq)) {
          if ($rowSelectedReq["requirement"] == $reqName) {
            $flag = false;
          }
        }
      }
      if ($flag == true) {
        $sqlInsertNewReq = "INSERT into authanticationrequirements(integrationId,requirement) VALUES ('$integrationId','$reqName') ";
        $resultNewReq = mysqli_query($conn, $sqlInsertNewReq);
      }
    }
  }
  $message = "Integration succesfully updated";
}



$response = array('message' => $message);

echo json_encode($response);
