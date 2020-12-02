/*
            gets data from the cases.xml file and stores it into the casesXML variable
            */
           var cases_xhttp = new XMLHttpRequest();
           var casesXML;

           cases_xhttp.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                   casesXML = this.responseXML;
               }
           };
           cases_xhttp.open("GET", "http://localhost:8080/cases.xml", true);
           cases_xhttp.send();


           /*
           gets data from the testing.xml file and stores it into the testsXML variable
           */
           var tests_xhttp = new XMLHttpRequest();
           var testingXML;

           tests_xhttp.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                   testingXML = this.responseXML;
               }
           };
           tests_xhttp.open("GET", "http://localhost:8080/testing.xml", true);
           tests_xhttp.send();

           /*
           gets data from the hospital.xml file and stores it into the hospitalXML variable
           */
           var hospital_xhttp = new XMLHttpRequest();
           var hospitalXML;

           hospital_xhttp.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                   hospitalXML = this.responseXML;
               }
           };
           hospital_xhttp.open("GET", "http://localhost:8080/hospital.xml", true);
           hospital_xhttp.send();


           /*
           function to fill the output table with daily data
           */
           function get_daily_data() {
               //erase previous data in the table and make the first row with the legend
               var table = document.getElementById("output_table");
               reset_table(table);

               //get all the data elemtents from the different files
               var cases = casesXML.getElementsByTagName('data');
               var testing = testingXML.getElementsByTagName('data');
               var hospital = hospitalXML.getElementsByTagName('data');

               //add code here to handle the extra data from the casesXML file


               //create a new row and insert the appropriate data into it
               for (i=0; i+3<cases.length; i++) {
                   var row = table.insertRow(-1);
                   var date_col = row.insertCell(0);
                   date_col.innerHTML = cases[i+3].getElementsByTagName('date').item(0).innerHTML;
                   var cases_col = row.insertCell(1);
                   cases_col.innerHTML = cases[i+3].getElementsByTagName('newCasesByPublishDate').item(0).innerHTML;
                   var tests_done_col = row.insertCell(2);
                   tests_done_col.innerHTML = testing[i] != undefined ? testing[i].getElementsByTagName('newPCRTestsByPublishDate').item(0).innerHTML : "";
                   var tests_planned_col = row.insertCell(3);
                   tests_planned_col.innerHTML = testing[i] != undefined ? testing[i].getElementsByTagName('plannedPCRCapacityByPublishDate').item(0).innerHTML : "";
                   var patients_in_hospital_col = row.insertCell(4);
                   patients_in_hospital_col.innerHTML = hospital[i] != undefined ? hospital[i].getElementsByTagName('hospitalCases').item(0).innerHTML : "";
               }

           }

           /*
           function to hide all data that does not match the query month
           */
           function filter_by_month() {
               //get the value of the month and year the user wants to query
               let year_month = document.getElementById('query_month').value;
               if (year_month == "") return;
               let list = year_month.split("-");
               let search_year = list[0];
               let search_month = list[1];

               table = document.getElementById("output_table");
               tr = table.getElementsByTagName('tr');

               // Loop through all table rows, and hide those that don't match the year and month query
               for (i = 0; i < tr.length; i++) {
                   td = tr[i].getElementsByTagName("td")[0];
                   if (td) {
                       column_date = td.innerHTML.split("-");
                       if (column_date[0]==search_year && column_date[1]==search_month) {
                           tr[i].style.display = "";
                       } else {
                           tr[i].style.display = "none";
                       }
                   }
               }
           }

                       /*
           function to hide all data that does not match the query month
           */
           function filter_averages_by_month() {
               //get the value of the month and year the user wants to query
               let year_month = document.getElementById('query_month').value;
               if (year_month == "") return;
               let list = year_month.split("-");
               let search_year = list[0];
               let search_month = list[1];

               table = document.getElementById("output_table");
               tr = table.getElementsByTagName('tr');

               // Loop through all table rows, and hide those that don't match the year and month query
               for (i = 0; i < tr.length; i++) {
                   td = tr[i].getElementsByTagName("td")[0];
                   if (td) {
                       dates = td.innerHTML.split("<br>");
                       start = dates[0].split("-");
                       end = dates[1].split("-");
                       
                       if ((start[0]==search_year && start[1]==search_month) || (end[0]==search_year && end[1]==search_month)) {
                           tr[i].style.display = "";
                       } else {
                           tr[i].style.display = "none";
                       }
                   }
               }
           }

           /*
           function to filter out all the data that does not match the query_date parameters:
               if equals: filter all data that does not match the specific date
               if greater than: filter all the data that comes before the date, date inclusive
               if less than: filter all data that comes after the date, date inclusive
           */
           function filter_by_date() {
               //get the date the user wants to query
               let yr_mo_day = document.getElementById('query_date').value;
               if (yr_mo_day == "") return;
               let list = yr_mo_day.split("-");
               let search_year = list[0];
               let search_month = list[1];
               let search_date = list[2];

               table = document.getElementById("output_table");
               tr = table.getElementsByTagName('tr');

               // display the correct data according to what the user wants to see
               let comparator = document.getElementById('date_comparator').value;
               if (comparator == "equals") {
                   for (i = 0; i < tr.length; i++) {
                       td = tr[i].getElementsByTagName("td")[0];
                       if (td) {
                           column_date = td.innerHTML.split("-");
                           if (column_date[0]==search_year && column_date[1]==search_month && column_date[2]==search_date) {
                               tr[i].style.display = "";
                           } else {
                               tr[i].style.display = "none";
                           }
                       }
                   }
               }
               else if (comparator == "greater than") {
                   for (i = 0; i < tr.length; i++) {
                       td = tr[i].getElementsByTagName("td")[0];
                       if (td) {
                           column_date = td.innerHTML.split("-");
                           if (column_date[0]>=search_year && column_date[1]>=search_month && column_date[2]>=search_date ||
                               column_date[0]>=search_year && column_date[1]> search_month ||
                               column_date[0]> search_year) {
                               tr[i].style.display = "";
                           } else {
                               tr[i].style.display = "none";
                           }
                       }
                   }
               }
               else if (comparator == "less than") {
                   for (i = 0; i < tr.length; i++) {
                       td = tr[i].getElementsByTagName("td")[0];
                       if (td) {
                           column_date = td.innerHTML.split("-");
                           if (column_date[0]<=search_year && column_date[1]<=search_month && column_date[2]<=search_date ||
                               column_date[0]<=search_year && column_date[1]< search_month ||
                               column_date[0]< search_year) {
                               tr[i].style.display = "";
                           } else {
                               tr[i].style.display = "none";
                           }
                       }
                   }
               }
           }

           /*
           function to fill the output table with monthly data
           */
           function get_monthly_total() {
               //erase previous data in the table and make the first row with the legend
               var table = document.getElementById("output_table");
               reset_table(table);

               //get all the data elemtents from the different files
               var cases = casesXML.getElementsByTagName('data');
               var testing = testingXML.getElementsByTagName('data');
               var hospital = hospitalXML.getElementsByTagName('data');

               // //add code here to handle the extra data from the casesXML file

               for (month=1; month<=12; month++) {
                   var row = table.insertRow(-1);
                   var date_col = row.insertCell(0);
                   var cases_col = row.insertCell(1);
                   var tests_done_col = row.insertCell(2);
                   var tests_planned_col = row.insertCell(3);
                   var patients_in_hospital_col = row.insertCell(4);

                   var cases_total = 0;
                   var tests_done_total = 0;
                   var tests_planned_total = 0;
                   var hospital_cases_total = 0;

                   table = document.getElementById("output_table");
                   tr = table.getElementsByTagName('tr');

                   for (i=0; i+3 < cases.length; i++) {
                       if ((cases[i+3].getElementsByTagName('date').item(0).innerHTML.split("-")[1] == month)) {
                           cases_total += parseInt(cases[i+3].getElementsByTagName('newCasesByPublishDate').item(0).innerHTML);
                           if (testing[i] != undefined && !isNaN(parseInt(testing[i].getElementsByTagName('newPCRTestsByPublishDate').item(0).innerHTML))) {
                               tests_done_total += parseInt(testing[i].getElementsByTagName('newPCRTestsByPublishDate').item(0).innerHTML);
                           }
                           tests_planned_total += (testing[i] != undefined ? parseInt(testing[i].getElementsByTagName('plannedPCRCapacityByPublishDate').item(0).innerHTML) : 0);
                           hospital_cases_total += (hospital[i] != undefined ? parseInt(hospital[i].getElementsByTagName('hospitalCases').item(0).innerHTML) : 0);
                       }

                   }
                   var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                   date_col.innerHTML = months[month-1] + " 2020";
                   cases_col.innerHTML = cases_total;
                   tests_done_col.innerHTML = tests_done_total;
                   tests_planned_col.innerHTML = tests_planned_total;
                   patients_in_hospital_col.innerHTML = hospital_cases_total;
               }
           }

           function get_daily_average(period) {
               var table = document.getElementById("output_table");
               reset_table(table);

               //get all the data elemtents from the different files
               var cases = casesXML.getElementsByTagName('data');
               var testing = testingXML.getElementsByTagName('data');
               var hospital = hospitalXML.getElementsByTagName('data');

               for (i=0; i+3+period<cases.length; i++) {
                   row_array = [0,0,0,0,0]
                   row_array[0] = cases[i+3+period].getElementsByTagName('date').item(0).innerHTML + "<br>" + cases[(i+3)].getElementsByTagName('date').item(0).innerHTML;
                   for(j=i; j<i+3+period; j++) {
                       row_array[1] += (cases[(j+period)] != undefined ? parseInt(cases[(j+period)].getElementsByTagName('newCasesByPublishDate').item(0).innerHTML) : 0);
                       if (testing[j] != undefined && !isNaN(parseInt(testing[j].getElementsByTagName('newPCRTestsByPublishDate').item(0).innerHTML))) {
                           row_array[2] += parseInt(testing[j].getElementsByTagName('newPCRTestsByPublishDate').item(0).innerHTML);
                       }
                       row_array[3] += (testing[j] != undefined ? parseInt(testing[j].getElementsByTagName('plannedPCRCapacityByPublishDate').item(0).innerHTML) : 0);
                       row_array[4] += (hospital[j] != undefined ? parseInt(hospital[j].getElementsByTagName('hospitalCases').item(0).innerHTML) : 0);
                   }
                   for(k=1; k<row_array.length; k++) {
                       row_array[k] = Math.round(row_array[k]/period);
                   }
                   addRowBottom(row_array);
               }
               


           }

           /*
           resets the table to display just the legend row
           */
           function reset_table(table) {
               table.innerHTML = "";
               var legend_row = table.insertRow(0);
               legend_row.outerHTML = "<tr class='legend'><th>date/month</th><th onclick='top_column(1)'>cases</th><th onclick='top_column(2)'>tests</th><th onclick='top_column(3)'>test capacity</th><th onclick='top_column(4)'>patients in hospital</th></tr>";
           }

           /*
           extracts all data from the current view of the table and returns the data in the form of an array
           */
           function get_table_data(table) {
               rows = table.getElementsByTagName('tr');
               data = new Array(rows.length);
               for (i=1; i<rows.length; i++){
                   if (rows[i].style.display == "none") {
                       continue;
                   }
                   columns = rows[i].getElementsByTagName('td');
                   row_data = new Array(columns.length);
                   for(j=0; j<row_data.length; j++) {
                       row_data[j] = columns[j].innerHTML;
                   }
                   data.push(row_data);
               }
               return data;
           }
           
           /*
           populates the table with the top 10 datapoints using the specified column for comparison
           */
           function top_column(col_idx) {
               table = document.getElementById("output_table");
               data = get_table_data(table); // get the data from the table
               if (data.length == 1) return;
               sorted = data.sort((a, b) => {
                   return b[col_idx]- a[col_idx]
               })
               reset_table(table);
               for (i=0; i<10; i++) {
                   addRowBottom(sorted[i]);
               }
           }

           /*
           function that takes an array[date, cases, test...] and adds a row to the output table 
           with the cells populated with the data
           */
           function addRowBottom(array) {
               // if empty array is undefined return
               if (array == undefined) return;
               table = document.getElementById("output_table");
               row = table.insertRow(-1);
               var date_col = row.insertCell(0);
               date_col.innerHTML = array[0];
               var cases_col = row.insertCell(1);
               cases_col.innerHTML = array[1];
               var tests_done_col = row.insertCell(2);
               tests_done_col.innerHTML = array[2];
               var tests_planned_col = row.insertCell(3);
               tests_planned_col.innerHTML = array[3];
               var patients_in_hospital_col = row.insertCell(4);
               patients_in_hospital_col.innerHTML = array[4];

           }

           /*
           function to get the specified month for the monthly total view
           */
           function filter_for_specific_month() {
               //get the value of the month and year the user wants to query
               let year_month = document.getElementById('query_month').value;
               if (year_month == "") return;
               let list = year_month.split("-");
               let search_year = list[0];
               let search_month = list[1];

               table = document.getElementById("output_table");
               tr = table.getElementsByTagName('tr');
               var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

               // Loop through all table rows, and hide those that don't match the year and month query
               for (i = 0; i < tr.length; i++) {
                   td = tr[i].getElementsByTagName("td")[0];
                   if (td) {
                       month_year = td.innerHTML.split(" ");
                       if (month_year[1]==search_year && months.indexOf(month_year[0])== search_month-1) {
                           tr[i].style.display = "";
                       } else {
                           tr[i].style.display = "none";
                       }
                   }
               }
           }