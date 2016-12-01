<?php
if(isset($_POST['keyword'])){
	$keyword=$_POST['keyword'];
}
if(isset($_POST['title'])){
	$BookTT=$_POST['title'];
}

// create connection
$conn = mysqli_connect("localhost","root","","mini4432");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$keyword = mysqli_real_escape_string($conn,$keyword);
switch($keyword){
	case "tag":
		$query = "select TagName from Tag group by TagName";
		$row_name = "TagName";
		break;
	case "subj":
		$query = "select TagName from Tag where TagName regexp '[a-zA-z]{2,4}[0-9]{4}' group by TagName order by TagName";
		$row_name = "TagName";
		break;
	case "pop":
		$query = "select Title from Book, BookShelf 
			where Book.BookID=BookShelf.BookID group by Book.BookID order by count(*) desc limit 25";
		$row_name = "Title";
		break;
	case "rank":
		$query = "select Book.Title from BookComment, Comment, Book 
			where Comment.CommentID=BookComment.CommentID AND Book.BookID=BookComment.BookID AND
			Comment.Grade>3 group by Book.BookID order by sum(grade) desc limit 25";
		$row_name = "Title";
		break;	
	case "title":
		$query = "select Title from Book order by Title";
		$row_name = "Title";
		break;
	case "related_bs":
		$query = "select Book.Title from Book, BookShelf where Book.BookID=BookShelf.BookID
			AND NetID in (select NetID from BookShelf, Book where Book.BookID=BookShelf.BookID AND
			Book.Title=\"".$BookTT."\") group by Book.BookID order by count(*) limit 5";
		$row_name = "Title";
		break;
	case "related_bb":
		$query = "select Book.Title from Book, UserBook where Book.BookID=UserBook.BookID
			AND NetID in (select NetID from UserBook, Book where Book.BookID=UserBook.BookID AND 
			Book.Title=\"".$BookTT."\") group by Book.BookID order by count(*) limit 5";
		$row_name = "Title";
		break;
	case "author":
		$query = "select Author from Book group by Author order by Author";
		$row_name = "Author";
		break;
	case "tagToTitle":
		$query = "select Book.Title from Book, Tag, BookTag where Book.BookID=BookTag.BookID AND
			Tag.TagID=BookTag.TagID AND Tag.TagName='" .$BookTT."'";
		$row_name = "Title";
		break;
	case "authorToTitle":
		$query = "select Book.Title from Book where Book.Author=\"" . $BookTT."\"";
		$row_name = "Title";
		break;
		
}

$result = mysqli_query($conn, $query);
if (!$result)  die ("");
else {	
	if(mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			if($row[$row_name])
				echo "<tr><td>" . $row[$row_name] . "</td><td class='add'>+</td></tr>";
		}
	} 
mysqli_free_result($result);
mysqli_close($conn);
}

?>