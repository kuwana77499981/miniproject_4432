<?php
    $lpcount = 0;
    $bookid = 1;
	$cover_count = 0;
	$array = array();
	$sql = "";
    
    for ($i = 1;$i<317;$i++)
    {
if (!(@$file=fopen("Book_".$i.".txt","read")))
{
	print("<h1>Error</h1>");
	print("<h2>Cannot open the text file.</h2>");
	exit();
}
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

while(!feof($file))
{
	$line = fgets($file);
	$line = trim($line);
	$author = preg_split("/Author:/",$line);
	$title = preg_split("/Title:/",$line);
    $cover = preg_split("/Cover:/",$line);
    $publisher = preg_split("/Publisher:/",$line);
    $ISBN = preg_split("/ISBN10:/",$line);
    $ISBN_img = preg_split("/ISBN13:/",$line);


    if (sizeof($title)!=1)
	{
		$title_p = trim($title[1]);
        $title_d = addslashes($title_p);
	}
	
    if (sizeof($author)!=1)
	{
		$author_p = trim($author[1]);
        $author_d = addslashes($author_p);
	}
    if (sizeof($publisher)!=1)
	{
		$publisher_p = trim($publisher[1]);
        $publisher_d = addslashes($publisher_p);
	}
    if (sizeof($ISBN)!=1)
    {
        $ISBN_p = $ISBN_d = trim($ISBN[1]);
        $cover_p = $cover_d = "http://www.openisbn.com/cover/".$ISBN_p."_220.jpg";
    }
    
    $lpcount++;
    if($lpcount==15)
    {
		//$size = getimagesize("http://www.openisbn.com/cover/".$ISBN_p."_220.jpg");
		//if ($size["bits"]==1)
		//		print("Book have no cover");
		//else
		//	{
				$array[$cover_count] = $bookid;
				$cover_count++;
				print("BookID: ".$bookid."<br>");
				print("Title: ".$title_p."<br>");
				print("Cover: ".$cover_p."<br>");
				print("Author: ".$author_p."<br>");
				print("Publisher: ".$publisher_p."<br>");
				print("ISBN10: ".$ISBN_p."<br>");
				print("<img style='background-image:url(\"http://cdn.openisbn.com/images/no_book_cover.jpg\");' src=\"$cover_d\" border=0 height=175 width=175/><br>");
		//	}
        $sql .= "INSERT INTO Book(Title, Author, Publisher, Cover, ISBN, CallNumber, CourseBook) VALUES (\"$title_d\", \"$author_d\", \"$publisher_d\", \"$cover_d\", \"$ISBN_d\", null, 0);";
    }


    }
    fclose($file);
    $bookid++;
	$lpcount =0;
    echo "<br>";
}
    // you should create a databse called mini4432;
    $conn = mysqli_connect("localhost", "root", "","mini4432");
    if ($conn->connect_error)  {
        echo "Unable to connect to database";
        exit;
    }
    
    if ($conn->multi_query($sql) === TRUE) {
        echo "New records created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    //print_r($array);
    $conn->close();
?>
