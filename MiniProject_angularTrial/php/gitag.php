<?php
session_start();
//header('Content-Type: application/json; charset=UTF-8');
    if($_POST["tag"]==""){
        getTag();
    } else if($_POST["tag"]=="addANewTag") {
        letUserInput();
    }else if($_POST["tag"]){
        insertTag();
    }
    function getTag(){

        $action="replace";
        $msg="<h3>Press the tag you want to add the most:</h3>";
        $conn = mysqli_connect("localhost", "root", "","mini4432");
        if ($conn->connect_error)  {
            $msg.="Unable to connect to database";
            exit;
        }
        $bookid = mysqli_real_escape_string($conn,$_POST["bookid"]);
        $query = "select BookTag.TagID,TagName,Qty from Book,BookTag,Tag where BookTag.TagID=Tag.TagID && Book.BookID=BookTag.BookID && Book.BookID=\"".$bookid."\" order by Qty DESC limit 10";
        $result = $conn->query($query);
        $query2 = "select sum(qty) as qty from BookTag where BookID=\"".$bookid."\"";
        $result2 = $conn->query($query2);
        $result2->data_seek(0);
        $row2 = $result2->fetch_assoc();
        if (!$result)  die ("cannot open sql file");
        else {
            $result->data_seek(0);
            while ($row = $result->fetch_assoc())  {
                $colorDepth=intval(($row["Qty"]/$row2["qty"])*255);

                $msg.="<button id=\"".$row["TagID"]."\" value=\"".$row["TagName"]."\" class=\"tagButton sb\" style=\"color:black;background:rgb(255," . (255-$colorDepth).",". (255-$colorDepth).")\">".$row["TagName"]." (".$row["Qty"].")</button> ";
            }
        }

        $result->free();
        $conn->close();
        $msg.="<button id=\"plus\" class=\"tagButton sb\" value=\"addANewTag\"><b>+</b></button>";
        echo json_encode(array( 'action'=>$action,'msg'=>$msg));
        $_SESSION["plus"]=False;
    }
    function letUserInput() {
        if($_SESSION["plus"]==False){
            $action="append";
            $msg="<p id=\"addInput\">Please input your new tag: <input type=\"text\" id=\"newTag\" ><button id=\"AddANewTag\">Submit</button></p>";
            echo json_encode(array( 'action'=>$action,'msg'=>$msg));
            $_SESSION["plus"]=True;
        } 
    }



    function insertTag(){
	 sleep(1);
         if(isset($_POST["plus"])) $_SESSION["plus"]=False;
         $action="append";
        $conn = mysqli_connect("localhost", "root", "","mini4432");
        if ($conn->connect_error)  {
            $msg="Unable to connect to database";
            exit;
        }
        $bookid = mysqli_real_escape_string($conn,$_POST["bookid"]);
        $tag = mysqli_real_escape_string($conn,$_POST["tag"]);
        $query = "select BookTag.TagID,TagName,BookTag.BookID,Qty from Tag,BookTag,Book where TagName=\"".$tag."\" && Book.BookID= \"".$bookid."\"&& Book.BookID=BookTag.BookID && Tag.TagID=BookTag.TagID";
        $result = $conn->query($query);
        $result->data_seek(0);
        $row = $result->fetch_assoc();
        if (!$row["TagName"]) {
            $sql = "INSERT INTO Tag(TagName) values(\"".$tag."\")";
            if(!($conn->query($sql) === TRUE)){
                $msg="fail to insert a new record";
            }else{
                $query3 = "select TagID from Tag where TagName = '$tag'";
                $result3 = $conn->query($query3);
                $result3->data_seek(0);
                $row3 = $result3->fetch_assoc();
                $sql= "insert into BookTag (Bookid, Qty, TagID) values('$bookid',1,\"".$row3['TagID']."\")";
                if(!($conn->query($sql) === TRUE)){
                    $msg="fail to insert a new record no.2";
                }
                /*TODO:change color*/$msg="<button id=\"".$row3["TagID"]."\" value=\"".$tag."\" class=\"sb tagButton\" style=\"color:black;background:rgb(255,255,255)\">".$tag." (1)</button> <button id=\"plus\" class=\"sb tagButton\" value=\"addANewTag\"><b>+</b></button>";
                echo json_encode(array( 'action'=>$action,'msg'=>$msg));
            }
        }
        else {
            $action="replace";
            $qty=$row["Qty"]+1;
            $sql = "UPDATE BookTag SET Qty = \"".($qty)."\" where BookID=\"".$bookid."\"&& TagID IN(select TagID from Tag where TagName=\"".$tag."\")";
            if ($conn->query($sql) === TRUE) {
                $query2 = "select sum(Qty) as Qty from BookTag where BookID=\"".$bookid."\"";
                $result2 = $conn->query($query2);
                $result2->data_seek(0);
                $row2 = $result2->fetch_assoc();
                $colorDepth=intval(($qty/$row2["Qty"])*255);
                $msg="<button id=\"".$row["TagID"]."\" value=\"".$row["TagName"]."\" class=\"sb tagButton\" style=\"color:black;background:rgb(255," . (255-$colorDepth).",". (255-$colorDepth).")\">".$row["TagName"]." (".$qty.")</button> ";
                echo json_encode(array( 'action'=>$action,'msg'=>$msg,'id'=>$row["TagID"]));
            } else {
                $msg="Error: " . $sql . "<br>" . $conn->error;
            }
        }
        $conn->close();

    }
?>
