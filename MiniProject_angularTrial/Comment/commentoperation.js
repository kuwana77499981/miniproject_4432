   function onestar(){ // set the grade to ★ ☆ ☆ ☆ ☆, &#9733; = ★, &#9734; = ☆
       document.getElementById("s1").innerHTML = "&#9733;";
       document.getElementById("s2").innerHTML = "&#9734;";
       document.getElementById("s3").innerHTML = "&#9734;";
       document.getElementById("s4").innerHTML = "&#9734;";
       document.getElementById("s5").innerHTML = "&#9734;";
   }
   
      function twostar(){ // set the grade to ★ ★ ☆ ☆ ☆, &#9733; = ★, &#9734; = ☆
       document.getElementById("s1").innerHTML = "&#9733;";
       document.getElementById("s2").innerHTML = "&#9733;";
       document.getElementById("s3").innerHTML = "&#9734;";
       document.getElementById("s4").innerHTML = "&#9734;";
       document.getElementById("s5").innerHTML = "&#9734;";
   }
   
      function threestar(){ // set the grade to ★ ★ ★ ☆ ☆, &#9733; = ★, &#9734; = ☆
       document.getElementById("s1").innerHTML = "&#9733;";
       document.getElementById("s2").innerHTML = "&#9733;";
       document.getElementById("s3").innerHTML = "&#9733;";
       document.getElementById("s4").innerHTML = "&#9734;";
       document.getElementById("s5").innerHTML = "&#9734;";
   }
   
      function fourstar(){ // set the grade to ★ ★ ★ ★ ☆, &#9733; = ★, &#9734; = ☆
       document.getElementById("s1").innerHTML = "&#9733;";
       document.getElementById("s2").innerHTML = "&#9733;";
       document.getElementById("s3").innerHTML = "&#9733;";
       document.getElementById("s4").innerHTML = "&#9733;";
       document.getElementById("s5").innerHTML = "&#9734;";
   }
   
      function fivestar(){ // set the grade to ★ ★ ★ ★ ★, &#9733; = ★, &#9734; = ☆
       document.getElementById("s1").innerHTML = "&#9733;";
       document.getElementById("s2").innerHTML = "&#9733;";
       document.getElementById("s3").innerHTML = "&#9733;";
       document.getElementById("s4").innerHTML = "&#9733;";
       document.getElementById("s5").innerHTML = "&#9733;";
   }

function addrow(commentid, netid, content, grade, date, time) { // add a new row in the table with new comment record
    var table = document.getElementById("commenttb"); // get the table by id
    var row = table.insertRow(1); // insert a row as the second row of the table
    var cell1 = row.insertCell(0); // insert a new cell into the row
    var cell2 = row.insertCell(1); // insert a new cell into the row
    var cell3 = row.insertCell(2); // insert a new cell into the row
    var cell4 = row.insertCell(3); // insert a new cell into the row
    var cell5 = row.insertCell(4); // insert a new cell into the row
    var cell6 = row.insertCell(5); // insert a new cell into the row
    var cell7 = row.insertCell(6); // insert a new cell into the row
    var cell8 = row.insertCell(7); // insert a new cell into the row
    row.id = "row"+commentid; // define the id of the row
    cell1.innerHTML = commentid; // set the commentid of the cell
    cell2.innerHTML = netid; // set the netid of the cell
    cell3.innerHTML = content; // set the content of the cell
    
    switch (grade) { // set the grade of the cell by how many stars
        case 1: 
            cell4.innerHTML = "★ ☆ ☆ ☆ ☆";
            break;
        case 2:
            cell4.innerHTML = "★ ★ ☆ ☆ ☆";
            break;
        case 3:
            cell4.innerHTML = "★ ★ ★ ☆ ☆";
            break;
            
        case 4:
            cell4.innerHTML = "★ ★ ★ ★ ☆";
            break;
        case 5:
            cell4.innerHTML = "★ ★ ★ ★ ★";
            break;
    }
    cell5.innerHTML = date; // set the date of the cell
    cell6.innerHTML = time; // set the time of the cell
    cell7.innerHTML = ""; // delete column, need a button
    cell8.innerHTML = ""; // edit column, need a button
}

function getgrade(){ // get the grade from the mouseover star and convert into number
        var grade = 0;
       if (document.getElementById("s5").innerHTML == "★"){
           grade = 5;
       }
       else if (document.getElementById("s4").innerHTML == "★"){
           grade = 4;
       }
       else if (document.getElementById("s3").innerHTML == "★"){
           grade = 3;
       }
       else if (document.getElementById("s2").innerHTML == "★"){
           grade = 2;
       }
       else if (document.getElementById("s1").innerHTML == "★"){
           grade = 1;
       }
       return grade;
}

function getcontent(){ // get the content from the textarea by id
    var content = "";
     content = document.getElementById("comment").value.replace(/\\/g, "\\\\");
       content = content.replace(/\'/g, "\\\'");  
       return content;
}
