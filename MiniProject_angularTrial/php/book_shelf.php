<?php
session_start();
$error = 0;
if (!isset($_SESSION["netid"])){
	$error = 1;
	$_SESSION["netid"] = 'testid'; // debug use
	exit($error);
}  else {
	$netid = $_SESSION['netid'];
}
	$_SESSION["netid"] = 'testid'; // debug use
if(isset($_POST['keyword'])||isset($_POST['category'])){
	$keyword=$_POST['keyword'];
	$cat=$_POST['category'];
} else {
	exit();
}
// create connection
$conn = mysqli_connect("localhost","root","","mini4432");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


switch($cat){
	case 'load':
		$query = "select Title, CallNumber from Book where BookID In (
					select BookID from BookShelf where NetID = '".$netid."' group by BookID)";
		$result = mysqli_query($conn, $query);
		if (!$result)  die ("");
		else {	
			if(mysqli_num_rows($result) > 0) {
				$output = "[";
				while($row = mysqli_fetch_assoc($result)) {
					if($output != "[") {$output .= ",";}
					$output .= '{"Title":"' . $row['Title'] . '",';
					$output .= '"Location":"' . $row['CallNumber'] .'"}';
					
				}
				$output .= "]";
				echo($output);
			}
		}
		mysqli_free_result($result);
		break;
	case 'save':
		$query = "delete from BookShelf where NetID='" . $netid . "'";
		$result = mysqli_query($conn, $query);
		if (!$result)  die ("");
		
		$all_title = "";
		if($keyword){
		foreach($keyword as $val){
			if($all_title != "") {$all_title .= ",";}
			$all_title .= "'" . mysqli_real_escape_string($conn,$val) . "'";
		}
		echo($all_title);
		$query = "select BookID from Book where Title in (" . $all_title .")";
		$result = mysqli_query($conn, $query);
		if (!$result)  die ("");
		else {	
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					$query2 = "insert into BookShelf(NetID, BookID) values('". $netid ."','".$row['BookID']."')";
					$result2 = mysqli_query($conn, $query2);
				}
			}
		}
		mysqli_free_result($result);}
		break;
}

mysqli_close($conn);



/*foreach ($_POST['keyword'] as $title)
echo $title;
*/
?>