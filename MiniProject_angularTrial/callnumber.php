<?php
   $conn = mysqli_connect("localhost", "root", "", "mini4432");
   if (!$conn)  die("cannot connect to the db");
   $a = ['L','M','O','P','Q','R','S'];
	$b = ['A','B','C','D','E','F'];
	$c = ['1','2','3','4','5','6','7','8','9'];

for($i=1; $i<316; $i++){
   $query = "update Book set CallNumber='".$a[$i%7].$b[$i%4].$c[$i%9]."' where BookID=".$i.";";
   echo $query."<br>";
   $result = mysqli_query($conn, $query);

}
$query = "insert into UserLib values('testid','testfn','testln','testpw')";
   echo $query."<br>";
   $result = mysqli_query($conn, $query);
/*

   if (!$result)  die ("");
   else {	
		if(mysqli_num_rows($result) > 0) {

			while($row = mysqli_fetch_assoc($result)) {

			}
			echo "alert('done')";
		}
   }

   mysqli_free_result($result);*/
   mysqli_close($conn);

echo "done";
?>