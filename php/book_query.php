<?php

$keyword=$_POST['keyword'];
$cat=$_POST['category'];
// create connection
$conn = mysqli_connect("localhost","root","","mini4432");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$keyword = mysqli_real_escape_string($conn,$keyword);
switch($cat){
	case 'title':
		$query = "select BookID, Title, Author, Publisher, Cover, CallNumber from Book where Title='$keyword'";
		break;
	default:
		$query = "select BookID, Title, Author, Publisher, Cover, CallNumber from Book where Title='$keyword'";
}


/*CREATE TABLE IF NOT EXISTS `mini4432`.`Book` (
  `BookID` INT(11) NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(200) NOT NULL,
  `Author` VARCHAR(100) NOT NULL,
  `Publisher` VARCHAR(100) NOT NULL,
  `Cover` VARCHAR(50) NOT NULL,
  `ISBN` VARCHAR(20) NOT NULL,
  `CallNumber` VARCHAR(20) NULL,
  `CourseBook` TINYINT(1) NOT NULL,
  PRIMARY KEY (`BookID`))*/

$result = mysqli_query($conn, $query);
if (!$result)  die ("");
else {	
	if(mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			echo "
					<tr><td colspan='2'><img src='". $row['Cover'] . "'/></td></tr>
					<tr><td>BookID: </td><td>" . $row['BookID'] . "</td></tr>
					<tr><td>Title: </td><td>" . $row['Title'] . "</td></tr>
					<tr><td>Author: </td><td>" . $row['Author'] . "</td></tr>
					<tr><td>Publisher: </td><td>". $row['Publisher']."</td></tr>
					<tr><td>CallNumber: </td><td>".$row['CallNumber']."</td></tr>";
		}
	}
mysqli_free_result($result);
mysqli_close($conn);
}



?>