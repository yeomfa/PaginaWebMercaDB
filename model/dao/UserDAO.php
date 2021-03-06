<?php
require_once ("DataBase.php");
require_once(__DIR__."/../entity/User.php");

class UserDAO{

    public function loginUser($email, $password){

        $dataBase = new DataBase();
        $dataTable = $dataBase->runQuery("SELECT * FROM user WHERE email=:email AND password=:password", array(':email'=>$email,':password'=>$password));
        $user = null;
        if (count($dataTable) == 1) {
            foreach ($dataTable as $i => $value) {
                $user = new User(
                                $dataTable[$i]["id"],
                                $dataTable[$i]["name"],
                                $dataTable[$i]["phone"],
                                $dataTable[$i]["email"],
                                $dataTable[$i]["dir"],
                                $dataTable[$i]["photo"],
                                $dataTable[$i]["password"],
                                $dataTable[$i]["admin"]);
            }
        }
        return $user;
    }

    public function registerUser(User $user){
        $dataBase = new DataBase();

        $stmt1 = "INSERT INTO user VALUES (NULL, :name, :phone, :email, :dir, :photo, :password, :admin)";
        $result = $dataBase->runUpdate($stmt1, array(
            ':name'=>$user->getName(),
            ':phone'=>$user->getPhone(),
            ':email'=>$user->getEmail(),
            ':dir'=>$user->getDir(),
            ':photo'=>$user->getPhoto(),
            ':password'=>$user->getPassword(),
            ':admin'=>$user->admin()
            )
        );

        return $result;
    }

    public function deleteUser($idUser){
        $dataBase = new DataBase();

        $stmt1 = "DELETE FROM user WHERE id = :idUser";

        $result = $dataBase->runUpdate($stmt1, array(':idUser' => $idUser));

        return $result;
    }

    public function modifyUser($user){
        $dataBase = new DataBase();

        $stmt1 = "UPDATE user SET name = :name, phone = :phone, email = :email, dir = :dir, password = :password, admin = :admin WHERE id = :idUser"; 

        $result = $dataBase->runUpdate($stmt1, array(
            ':name' => $user->getName(),
            ':phone' => $user->getPhone(),
            ':email' => $user->getEmail(),
            ':dir' => $user->getDir(),
            ':password' => $user->getPassword(),
            ':admin' => $user->Admin(),
            ':idUser' => $user->getId()
            )
        ); 

        return $result;
    }

    public function updatePhoto($namePhoto, $id){

        $dataBase = new DataBase();
        $stmt1 = "UPDATE user SET photo = :photo WHERE id = :idUser";
        $result = $dataBase->runUpdate($stmt1, array(
            ':photo' => $namePhoto,
            ':idUser' => $id
        ));

    }

    public function seeUsers(){
        $dataBase = new DataBase();
        
        $dataTable = $dataBase->runQuery("SELECT * FROM user", NULL);
        $user=null;
        $users=array();

        foreach($dataTable as $i => $value){
            $user = new User(
                    $dataTable[$i]["id"],
                    $dataTable[$i]["name"],
                    $dataTable[$i]["phone"],
                    $dataTable[$i]["email"],
                    $dataTable[$i]["dir"],
                    $dataTable[$i]["photo"],
                    $dataTable[$i]["password"],
                    $dataTable[$i]["admin"]
                    );
            array_push($users,$user);
        }
        
        return $users;
    }

    public function seeUser($idUser){
        $dataBase = new DataBase();

        $dataTable = $dataBase->runQuery("SELECT * FROM user WHERE id = :idUser", array(':idUser'=>$idUser));

        $user=null;
        if(count($dataTable)==1){
            $user = new User(
                    $dataTable[0]["id"],
                    $dataTable[0]["name"],
                    $dataTable[0]["phone"],
                    $dataTable[0]["email"],
                    $dataTable[0]["dir"],
                    $dataTable[0]["photo"],
                    $dataTable[0]["password"],
                    $dataTable[0]["admin"]
                    );
        }


        return $user;
    }

}

 ?>
