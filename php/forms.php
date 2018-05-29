
<?php
header('Access-Control-Allow-Origin: *');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require '../vendor/phpmailer/phpmailer/src/Exception.php';
require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require '../vendor/phpmailer/phpmailer/src/SMTP.php';


require '../vendor/autoload.php';
require '../php/config.php';
require '../serverconnection/source.php';


GLOBAL $db;



function validateEmail($email,$db){
    try{

        $checkemail =$db->prepare('SELECT * FROM user where user_email=:email');
        $checkemail->bindParam(':email', $email, PDO::PARAM_STR,100);
        $checkemail->execute();
        $count=$checkemail->rowCount();
        return $count;
    }
    catch(PDOException $e){
        echo "error";
    }
}
// validationemail function ends
// validation device id from the user starts
function gettingDeviceIdUSER($email,$db){
    try{

        $checkemail =$db->prepare('SELECT * FROM user where user_email=:email');
        $checkemail->bindParam(':email', $email, PDO::PARAM_STR,100);
        $checkemail->execute();
        $count=$checkemail->rowCount();
        if($count != 0){
            $r=$checkemail->fetch(PDO::FETCH_OBJ);
            $deviceid = $r->device_id;
            return $deviceid;
        }
    }
    catch(PDOException $e){
        echo "error";
    }
}

// validation from device id user ends

// validation from device id from fabric starts
function gettingDeviceIdFabric($deviceid,$db){
    try{

        $checkemail =$db->prepare('SELECT * FROM device where device_id=:device');
        $checkemail->bindParam(':device', $deviceid, PDO::PARAM_STR,100);
        $checkemail->execute();
        $count=$checkemail->rowCount();
        return $count;
    }
    catch(PDOException $e){
        echo "error";
    }
}




// validation from device id from fabric ends

if(isset($_POST['create'])){
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $device=$_POST['device'];
    $cpassword = $_POST['cpassword'];
    $cemail = $_POST ['cemail'];
    // encryption part
    $hashFormat = "$2y$10$";
    $salt = "iusesomecrazystrings22";
    $hash_and_salt = $hashFormat.$salt.$salt;
    $password = crypt($password, $hash_and_salt);
    $cpassword = crypt($cpassword, $hash_and_salt);

    // encryption part ends
        Try {
            if($password != $cpassword or $email != $cemail){
                echo 'check password and email they are mistyping issues!';
            }
            else{
                 if(validateEmail($email,$db) == 1){
                    echo 'This email has already an User !';

                 }elseif(gettingDeviceIdFabric($device,$db)!=1){
                     echo ' please provide  a valid deviceid, which stands on your kit Device!';
                 }
                 else{

                 $sql = "INSERT INTO user (user_name,user_surname,user_email,user_password,device_id) VALUES (:name,:surname,:email,:password,:device)";
                 $sth= $db->prepare($sql);
                 // use exec() because no results are returned
                $sth->bindParam(':name', $name, PDO::PARAM_STR,100);
                $sth->bindParam(':surname',$surname, PDO::PARAM_STR,40);
                $sth->bindParam(':email', $email, PDO::PARAM_STR,100);
                $sth->bindParam(':password', $password, PDO::PARAM_STR,100);
                $sth->bindParam(':device', $device, PDO::PARAM_STR,100);
                $sth->execute();
                echo "User created successfully";
                }}}
            catch (PDOException $e){echo $e;}
}elseif (isset($_POST['namep'])){

    $nameE = $_POST['namep'];
    $surnameE = $_POST['surnamep'];
    $deviceE  = $_POST['devicep'];
    $email =$_POST['emailp'];

    if(gettingDeviceIdFabric($deviceE,$db)!= 1){
        echo ' please provide  a valid deviceid, which stands on your kit Device!';

    }else {

        $sql = "UPDATE   user  SET user_name=:name , user_surname=:surname , device_id=:deviceid where user_email=:email";
        $sth = $db->prepare($sql);
        $sth->bindParam(':name', $nameE, PDO::PARAM_STR, 100);
        $sth->bindParam(':surname', $surnameE, PDO::PARAM_STR, 40);
        $sth->bindParam(':deviceid', $deviceE, PDO::PARAM_STR, 100);
        $sth->bindParam(':email', $email, PDO::PARAM_STR, 100);
        $sth->execute();

        echo "User Profile Saved successfully";
    }

}elseif (isset($_POST['passwordR'])){
    $currentPassword = $_POST['passwordR'];
    $newPassword = $_POST['newpasswordR'];
    $newPasswordConfirmation =$_POST['cnpasswordR'];
    $hashFormat = "$2y$10$";
    $salt = "iusesomecrazystrings22";
    $hash_and_salt = $hashFormat.$salt.$salt;
    $currentPassword = crypt($currentPassword, $hash_and_salt);
    $newPassword = crypt($newPassword, $hash_and_salt);
    $newPasswordConfirmation = crypt($newPasswordConfirmation, $hash_and_salt);
    $email =$_POST['emailp'];


    $sql = "select*from user where user_email=:email";
    $sth= $db->prepare($sql);
    $sth->bindParam(':email', $email, PDO::PARAM_STR,100);
    $sth->execute();
    $count =$sth->rowCount();
    if($count != 0){
        $r=$sth->fetch(PDO::FETCH_OBJ);
        $db_password=$r->user_password;
        if($db_password == $currentPassword ){

            if($newPassword == $newPasswordConfirmation) {


                $sql = "update user set  user_password=:newpassword where user_email=:email";
                $sth= $db->prepare($sql);
                $sth->bindParam(':newpassword', $newPassword, PDO::PARAM_STR,100);
                $sth->bindParam(':email', $email, PDO::PARAM_STR,100);
                $sth->execute();

                echo "Password was updated";

            }
            else{
                echo "mistyping in password confirmation";
            }
        }
        else{
            echo ' your current password was mistyping';
        }
    }
}
elseif (isset($_POST['username'])) {
    $username = $_POST['username'];
    $fpassword = $_POST['fpassword'];
    // encryption part
    $hashFormat = "$2y$10$";
    $salt = "iusesomecrazystrings22";
    $hash_and_salt = $hashFormat . $salt . $salt;
    $fpassword = crypt($fpassword, $hash_and_salt);
    // encryption part ends
    try {

        $sql = "SELECT * FROM user where user_email=:username and user_password =:fpassword ";
        $sth = $db->prepare($sql);
        $sth->bindParam(':username', $username, PDO::PARAM_STR, 100);
        $sth->bindParam(':fpassword', $fpassword, PDO::PARAM_STR, 100);
        $sth->execute();
        $count = $sth->rowCount();
        if ($count != 0) {
            $r = $sth->fetch(PDO::FETCH_OBJ);
            $db_password = $r->user_password;
            $name = $r->user_name;
            $surname = $r->user_surname;
            $email = $r->user_email;
            $device = $r->device_id;
            if ($db_password == $fpassword) {
                echo json_encode(['error' => 'successful', 'msg' => 'connection made', 'name' => $name, 'surname' => $surname, 'email' => $email, 'device' => $device]);
            }
        } else {
            echo json_encode(['error' => 'no', 'msg' => 'no connection']);
        }
    } catch (PDOException $e) {
        echo $e;
    }

// sending email process for password recovery
}elseif(isset($_POST['deviceid']) && isset($_POST['email'])){
    $email = $_POST['email'];
   $device = $_POST['deviceid'];
    $randomPassword = $_POST['key'];
    $key = $_POST['fake'];
    if(validateEmail($email,$db)== 1 && gettingDeviceIdUSER($email,$db) == $device) {
        $hashFormat = "$2y$10$";
        $salt = "iusesomecrazystrings22";
        $hash_and_salt = $hashFormat . $salt . $salt;
        $key = crypt($key, $hash_and_salt);
        $sql = "UPDATE user SET user_password=:password where user_email=:email";
        $sth = $db->prepare($sql);
        $sth->bindParam(':password', $key, PDO::PARAM_STR);
        $sth->bindParam(':email', $email, PDO::PARAM_STR);
        $sth->execute();

                    /** CONFIGURE PHP MAILER
         *
         */


        $mail = new PHPMailer();

        // Enable verbose debug output

            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = config::SMTP_HOST;  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = config::SMTP_USER;                 // SMTP username
            $mail->Password = config::SMTP_PASSWORD;                           // SMTP password
            $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = config::SMTP_PORT;                   // TCP port to connect to
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';

            $mail->setFrom('admin@oneswitch.club','Password Info');
            $mail->addAddress($email);
            $mail->Subject = 'Password Request';
            $mail->Body = "<h1>YOUR PASSWORD INFORMATION </h1>
<br>
<p>Please find  your password details below: </p>
<p>your new password is : $randomPassword</p>
<br>
<br>
<p> for extra security <b>DON'T FORGET TO UPDATE YOUR PASSWORD</b> in Myprofile section</p>

<br>
<p> kind regards  </p>
<P>One Switch Team</P>

";
        if($mail->send()) {
            echo 'Mail has been sent';

        }else{
            echo 'Mail sent failed';
        }

        }
else{
        echo 'wrong email or device number is not there';
}
}


//password form recovery
// facebook setting User information section starts
elseif (isset($_POST['facebookname'])){

    $facebookName = $_POST['facebookname'];
    $facebookSurname=$_POST['facebooksurname'];
    $facebookEmail = $_POST['facebookemail'];
    $device = $_POST['device'];
    $devicefacebook = gettingDeviceIdUSER($facebookEmail,$db);

      if(validateEmail($facebookEmail,$db) ==0){

          $length = 10 ;
          $randomPassword = bin2hex(openssl_random_pseudo_bytes($length));
          $hashFormat = "$2y$10$";
          $salt = "iusesomecrazystrings22";
          $hash_and_salt = $hashFormat . $salt . $salt;
          $randomPassword= crypt($randomPassword, $hash_and_salt);
          $sql = "INSERT INTO user (user_name,user_surname,user_email,user_password) VALUES (:name,:surname,:email,:password)";
          $sth= $db->prepare($sql);
          // use exec() because no results are returned
          $sth->bindParam(':name', $facebookName, PDO::PARAM_STR,100);
          $sth->bindParam(':surname',$facebookSurname, PDO::PARAM_STR,40);
          $sth->bindParam(':email', $facebookEmail, PDO::PARAM_STR,100);
          $sth->bindParam(':password', $randomPassword, PDO::PARAM_STR,100);
          $sth->execute();

          echo json_encode(['msg' => ' Welcome to OneSwitch please dont forget to set your deviceid in your profile, login on facebook sucessfull for first time' , 'name' => $facebookName,'surname'=>$facebookSurname,'email'=>$facebookEmail, 'device'=>$device]);

      }
      else{

          echo json_encode(['msg' => ' Login successful with facebook' , 'name' => $facebookName,'surname'=>$facebookSurname,'email'=>$facebookEmail, 'device'=>$devicefacebook]);

      }

}
//facebook setting user infromation ends
//if nothing works section
else{
    echo 'no possible';
}
// if nothing works section ends

?>