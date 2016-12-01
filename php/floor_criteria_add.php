<?php
$keyword=$_POST['keyword'];
$cat=$_POST['category'];
// create connection
$conn = mysqli_connect("localhost","root","","mini4432");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$keyword = mysqli_real_escape_string($conn,$keyword);
switch ($cat){
	case "title":
	case "pop":
	case "rank":
	case "related_bs":
	case "related_bb":
		$query = "select CallNumber from Book where Title='". $keyword ."'";
		$row_name = "CallNumber";
		break;
	case "tag":
	case "subj":
		$query = "select CallNumber from Book, BookTag, Tag where Book.BookID = BookTag.BookID AND
			Tag.TagID = BookTag.TagID AND Tag.TagName ='" . $keyword . "' group by CallNumber";
		$row_name = "CallNumber";
		break;
	case "author":
		$query = "select CallNumber From Book where Author='". $keyword ."'";
		$row_name = "CallNumber";
		break;
}

$result = mysqli_query($conn, $query);
if (!$result)  die ("");
else {	
	if(mysqli_num_rows($result) > 0) {
		$output = "[";
		while($row = mysqli_fetch_assoc($result)) {
			if($output != "[") {$output .= ",";}
			//$output .= '{"Location":"' . $row[$row_name] . '"}';
			$output .= '"' . $row[$row_name] . '"';
		}
		$output .= "]";
	}
mysqli_free_result($result);
mysqli_close($conn);
}
echo($output);

?>