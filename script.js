$(document).ready(function() {
    
    let main = $('#main');
    
    //user authentication that must be done - if we wanted to make a seperate login page we could, but i feel like its not necessary? - this will just log the "website" into the correct database (the one we created) each time
    var root_url = "http://comp426.cs.unc.edu:3001/";

    //request from browser for authentication cookie from server
    $.ajax(root_url + '/sessions',
        {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              "user": {
                "username": "jkwoods",
                "password": "730009124"
              }
            },
            error: () => {
                alert("error");
            }
        });
    //there is no response for this request (not supposed to be), but I am getting a 204 status code, which is what we're supposed to get, so I guess it works?
    
    //get list of airports - i put it up here so its avalible for anyone to use
    let airports = [];
    $.ajax(root_url + "airports", //unfiltered
                               {
                                   type: 'GET',
                                   dataType: 'json',
                                   xhrFields: {withCredentials: true},
                                   success: (response) => {
                                        airports = response;
                                   }
                               });
    
    

  $("#send").on("click", function(){
    main.empty();
    newLine(main);
    main.append('<div id="request_div"> Current Requests </div> '); //left float request div
    main.append('<div id="send_div"> Send a package! </div> '); //right float send package div

    //Add a list to request div and populate it with requests.
    requestdiv = $('#request_div');
    requestdiv.append('<ul id = "requestlist"></ul>');
    requestlist = $('#requestlist');
    requestlist.append('<li>Request 1 here... </li>');
    requestlist.append('<li>Request 2 here...</li>');
    requestlist.append('<li>Request 3 here...</li>');

    //Populate send div
    senddiv = $('#send_div');
    newLine(senddiv);
    senddiv.append('<input type="text" placeholder="Send from Airport"> </input>'); //will change to drop down of airports or autocomplete
    senddiv.append('<input type="text" placeholder="Send to Airport"> </input>'); //will change to drop down of airports

    //List of flights
    senddiv.append('<ul id = "flightlist"></ul>');
    requestlist = $('#flightlist');
    requestlist.append('<li>Flight 1 here... </li>');
    requestlist.append('<li>Flight 2 here...</li>');
    requestlist.append('<li>Flight 3 here...</li>');

    senddiv.append('<input type="text" placeholder="What are you sending?"> </input>');
    newLine(senddiv);
    senddiv.append('<input type="button" value="SEND"> </input>');
  });

  function newLine(x){
    x.append('<br></br>');
  }

//jess - receive page    
  $("#receive").on("click", function(){
    main.empty();
    newLine(main);
    
    let recDiv = $('<div id="receive_div"> </div> '); //main holder div for receive section
    recDiv.append('<h1>Search Unpurchased Items Avalible for Pick Up</h1>');
      
    main.append(recDiv);
      
    let formDiv = $('<div></div>');
    recDiv.append(formDiv);
    
    let autoCompleteDiv = $('<div class="autocomplete"><input id="myInput" type="text" name="myCountry" placeholder="Airports Near You ..." searchBar><br></div>');  
    formDiv.append(autoCompleteDiv);
      
    listDiv = $('<div id="list_of_tickets"> </div> '); //all tickts go in here
    recDiv.append(listDiv);
    
    let searchResult = "";
    let airportNames = new Array(airports.length -1);
    let airportsNotCYO = new Array(airports.length -1);  
      
    let j = 0;
    for (let i=0; i < airports.length; i++) {
        if (airports[j].code == "CYO"){
            //do nothing - we don't want to include this one
        } else {
            airportsNotCYO[j] = airports[j];
            airportNames[j] = airports[j].name + " (" + airports[j].code + ")";
        
            j++;
        }
        
    }
      
    let currentAirportReceivePage = airportsNotCYO[0];
      
      //autocomplete
    $('[searchBar]').on("keyup", function() {
    
        let term = $(this).val().toLowerCase();
        
            if (term != '') {
                $(".dropdown").remove();
                $(".temp").remove();
                    for (let i=0; i < airportNames.length; i++) {
                        let anlc = airportNames[i].toLowerCase();
                        if(anlc.includes(term)){
                            autoCompleteDiv.append('<button class="dropdown" id="' + airportsNotCYO[i].code + '">' + airportNames[i] + '</button><br class="temp" id="temp_' + airportsNotCYO[i].code + '">');
                            
                            //on dropdown clicks, set current airport
                            $("#" + airportsNotCYO[i].code).on("click", function(){
                                $(".ticketDiv").remove();
                                
                                currentAirportReceivePage = airportsNotCYO[i];
                                
                                //when airport is submitted, generate all unpurchased tickets for which that is the arrival airport
                                listDiv.empty(); //to prevent duplicates on multiple button click
        
                                //Gameplan:
                                //get all flights arriving at airpot, get all instances of these planes, get unpurchased tickets of those instances, make new listing for each ticket
                                //once make, these tickets could be sorted or whatever

                                //get airport id
                                let airport_id = currentAirportReceivePage.id;

                                //get all flights arriving at airport
                                $.ajax(root_url + "flights", //couldn't get filtering to work for integers on flights?? .... idk fam
                               {
                                   type: 'GET',
                                   dataType: 'json',
                                   xhrFields: {withCredentials: true},
                                   success: (response) => {
                                   let array = response;
                                    //find correct arrival ids 
                                   for (let i=0; i<array.length; i++) { //filtering workaround
                                        if(array[i].arrival_id == airport_id){

                                            let flight = array[i];
                                            //get instance of that flight
                                            let flight_id = flight.id;

                                            $.ajax(root_url + "instances?filter[flight_id]=" + flight_id,
                                               {
                                                   type: 'GET',
                                                   dataType: 'json',
                                                   xhrFields: {withCredentials: true},
                                                   success: (response) => {
                                                   let instance = response[0]; //array should be exactly one instance

                                                    let instance_id = instance.id;
                                                   //get tickets of that array   

                                                    $.ajax(root_url + "tickets?filter[is_purchased]=0.0&filter[instance_id]=" + instance_id, //filtering ajax request on tickets
                                                       {
                                                           type: 'GET',
                                                           dataType: 'json',
                                                           xhrFields: {withCredentials: true},
                                                           success: (response) => {

                                                           let tickets = response;
                                                            if (tickets.length > 0){//if there exsist tickets

                                                                //for each unpurchased ticket make new listing
                                                                for (let i=0; i<tickets.length; i++) {
                                                                        let ticketDiv = $('<div class="ticketDiv" id="ticketDiv_' + tickets[i].id + '"></div> '); 
                                                                        //div per ticket - id is "ticketDiv_<ticketID>"

                                                                        listDiv.append(ticketDiv);

                                                                        //make fields for ticket request
                                                                        ticketDiv.append('<div class="itemName">' + tickets[i].first_name + '</div>');
                                                                        ticketDiv.append('<div class="itemPrice">'+ "Asking Price: $" + tickets[i].price_paid + '</div>');
                                                                        ticketDiv.append('<div class="flightNum">'+ "Flight: " + flight.number + '</div>');
                                                                        ticketDiv.append('<div class="arrivalDate">'+ "Arrival Date: " + instance.date + '</div>');

                                                                        //arrival time string is weird - must be cut up
                                                                        let arrTime = flight.arrives_at;
                                                                        arrTime = arrTime.slice(11, 16);

                                                                        ticketDiv.append('<div class="arrivalTime">'+ "Arrival Time: " + arrTime + '</div>');
                                                                }    
                                                            }
                                                           }
                                                       });  
                                                   }
                                               });
                                        }
                                   }
                                   }

                               });
                            });
                            
                        } else {
                            $("#" + airportsNotCYO[i].code).remove();
                            $("#temp_" + airportsNotCYO[i].code).remove();
                            
                        }
                    }

            } else {
                $(".dropdown").remove();
                $(".temp").remove();
            }
    }); 
  });
    
// olivia
	// request page
  $("#request").on("click", function(){
    main.empty();
    newLine(main);
    main.append('<div id="req_div"> Make a Request! </div> ');

    // select "gender", if dark, change background color
    $('#bright').prop("checked", true);
    let gender = "bright";
    $('.rbutton').on('click', function() {
      gender = $(this).val();
      if (gender == "dark") {
        document.body.style.backgroundColor = "#282828";
        document.body.style.color = "white";
        document.getElementById("req_flightlist").style.backgroundColor = "#202020";
      } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        document.getElementById("req_flightlist").style.backgroundColor = "#d6dbdf";
      }
    });

    // Make text boxes with options for user to fill in - edited by jess for drop down
    reqdiv = $('#req_div');
    newLine(reqdiv);
      
    let autoCompleteDiv = $('<div class="autocomplete"></div>'); //added jess
      
    let airportInput = $('<input type="text" id="airportInput" class="req" placeholder="Arrival airport" searchBar2></input><br>'); // user types in arrival airport
    autoCompleteDiv.append(airportInput);  //new
      
    reqdiv.append(autoCompleteDiv);
      
    let airportName = "";
    
    //jess helper code
    let airportNames = new Array(airports.length -1);
    let airportsNotCYO = new Array(airports.length -1);  

    let j = 0;
    for (let i=0; i < airports.length; i++) {
        if (airports[j].code == "CYO"){
            //do nothing - we don't want to include this one
        } else {
            airportsNotCYO[j] = airports[j];
            airportNames[j] = airports[j].name + " (" + airports[j].code + ")";

            j++;
        }

    }
      
  let currentAirportRequestPage = airportsNotCYO[0];
      
      //autocomplete #2 by jess - slightly different functionality
    $('[searchBar2]').on("keyup", function() {
    
        let term = $(this).val().toLowerCase();
        
            if (term != '') {
                $(".dropdown").remove();
                $(".temp").remove();
                    for (let i=0; i < airportNames.length; i++) {
                        let anlc = airportNames[i].toLowerCase();
                        if(anlc.includes(term)){
                            autoCompleteDiv.append('<button class="dropdown" id="r_' + airportsNotCYO[i].code + '">' + airportNames[i] + '</button><br class="temp" id="temp_' + airportsNotCYO[i].code + '">');
                            
                            //on dropdown clicks, set current airport
                            $("#r_" + airportsNotCYO[i].code).on("click", function(){
                                
                                currentAirportRequestPage = airportsNotCYO[i];
                                airportName = airportsNotCYO[i].name;
                                alert(airportName);
                                
                                $("#airportInput").val(airportsNotCYO[i].name);
                                $(".dropdown").remove();
                                $(".temp").remove();
                                
                                //remake flight list
                                make_flight_list(reqdiv, currentAirportRequestPage);
                                
                            });
                        } else {
                            $("#r_" + airportsNotCYO[i].code).remove();
                            $("#temp_" + airportsNotCYO[i].code).remove();
                        }
                    }
            } else {
                $(".dropdown").remove();
                $(".temp").remove();
            }
    }); //end of autocomplete #2

    
    let itemReqNameInput = $('<br><input type="text" id="itemRequestName" class="req" placeholder="What item are you requesting?"> </input>'); //jess changed <br>
    reqdiv.append(itemReqNameInput);
    let itemName = "";
    itemReqNameInput.on("keyup", function() {
      itemName = $(this).val();
    });

    newLine(reqdiv);
    let priceReqInput = $('<input type="text" id="reqPriceWilling" class="req" placeholder="How much are you willing to pay?"> </input>');
    reqdiv.append(priceReqInput);
    let priceWillReq = "";
    priceReqInput.on("keyup", function() {
      priceWillReq = $(this).val();
    });

    newLine(reqdiv);
    //List of flights going to that airport
    reqdiv.append('<div id = "req_flightlist"></div>');
    reqFlightList = $('#req_flightlist');

    let airport_id = currentAirportRequestPage.id;
      alert("airport id = " + airport_id);
    let flight;
    let matchArray = [];

    $.ajax(root_url + "flights", {
     type: 'GET',
     dataType: 'json',
     xhrFields: {withCredentials: true},
     success: (response) => {
       // console.log(response);
       let array = response;

       //find correct arrival ids
       for (let i=0; i<array.length; i++) {
            if(array[i].arrival_id == airport_id){
                //get instance of that flight
                matchArray.push(array[i]);
              }
      }

      // create text nodes of flight info, radio button to choose one, and append to list div for flights
      for (let j = 0; j < matchArray.length; j++) {
          let flightDiv =  $('<div id="indivFlight"></div>');
          let arrivalid = airport_id; //changed - this should be checked if problem arises
          let arrivesat = matchArray[j].arrives_at;
          let instanceDate;

          // get arrival date
          $.ajax(root_url + "instances?filter[flight_id]=" + matchArray[j].id,
                 {
                 type: 'GET',
                 dataType: 'json',
                 xhrFields: {withCredentials: true},
                 success: (response) => {
                     instanceDate = response[0].date;
                     flight = $('<input class="reqbutton" type="radio" name="flight" id="chooseFlight" value="' + j + '"> <div class="bold">Choose this Flight:</div> <br>');
                     // let arrdate = document.createTextNode("Arrival Date: " + arrivesat.slice(NaN, 10));
                     let arrtime = document.createTextNode("Arrival Time: " + arrivesat.slice(11, 16));
                     let arrdate = document.createTextNode("Arrival Date: " + instanceDate.toString());
                     flightDiv.append(flight);
                     flightDiv.append(arrdate);
                     newLine(flightDiv);
                     flightDiv.append(arrtime);
                     newLine(flightDiv);
                     reqFlightList.append(flightDiv);
                 }
          });
      }

      // give user the option to add a new flight if their preference is not there
      let makeFlight = $('<input class="reqbutton" type="radio" name="flight" id="newFlight"> Add New Flight <br>');
      reqdiv.append(makeFlight);
      let inputDiv = $('<div id="newFlightInput"></div>');
      $('#newFlight').on("click", function(){
        inputDiv.empty();

        // option for flight arrival time
        reqdiv.append(inputDiv);
        addTimeDropdown();
        addDateDropdown();
        let submitButton = $('<input type="button" value="Submit" id="submitFlight"> </input>');
        inputDiv.append(submitButton);
        newLine(inputDiv);
        newLine(inputDiv);
        let arrTime
        let depTime;

        // let the user submit their own arrival time, making a new flight
        $('#submitFlight').on("click", function() {

          // get hour, min, year, month, and date from user
          let hourSel = document.getElementById("hourSel").selectedIndex;
          let hour = document.getElementsByTagName("option")[hourSel].value;
          let minSel = document.getElementById("minSel").selectedIndex;
          let min = document.getElementsByTagName("option")[minSel].value;
          arrTime = hour + ":" + min;
          console.log(arrTime);
          let dHour, depTime, depDay, depYear, depMonth, depDate;

          let yearSel = document.getElementById("yearSel").selectedIndex;
          let year = parseInt(document.getElementsByTagName("option")[yearSel].value) + 2018;
          let monthSel = document.getElementById("monthSel").selectedIndex;
          let month = document.getElementsByTagName("option")[monthSel+1].value;
          let day = document.getElementById("daySel").selectedIndex + 1;
          // let day = document.getElementsByTagName("option")[daySel+1].value;
          if (parseInt(day) < 11) {
            day = "0" + day.toString();
          }
          let date = year + "-" + month + "-" + day;
          console.log(date);

          depYear = year;
          // make dep time 3 hours less than arrival
          if (parseInt(hour) < 3) {
            if (parseInt(hour) == 0) {
              depTime = "21:00";
            } else if (parseInt(hour) == 1) {
              depTime = "22:00";
            } else if (parseInt(hour) == 2) {
              depTime = "23:00";
            }
            if (parseInt(day) == 1) {
              if ((parseInt(month) == 2) || (parseInt(month) == 4) || (parseInt(month) == 6) || (parseInt(month) == 8) || (parseInt(month) == 9) || (parseInt(month) == 11)) {
                depDay = 31;
                depMonth = month - 1;
              } else if ((parseInt(month) == 5) || (parseInt(month) == 7) || (parseInt(month) == 10) || (parseInt(month) == 12)){
                depDay = 30;
                depMonth = month - 1
              } else if (parseInt(month) == 3) {
                if (year == 2019) {
                  depDay = 28;
                } else if (year = 2020) {
                  depDay = 29;
                }
                depMonth = 2
              } else if (parseInt(month) == 1) {
                depDay = 31;
                depYear = year - 1;
                depMonth = 12;
              }
            } else {
              depDay = parseInt(day) - 1;
            }
          } else {
              dHour = hour - 3;
              depTime = dHour + ":00";
              depDay = day;
              depMonth = month;
              depYear = year;
          }
          depDate = depYear + "-" + depMonth + "-" + depDay;

          console.log(depMonth);
          console.log(depDay);
          console.log(depDate)

          // don't allow user to select past days or days that don't exist
          if ((parseInt(year) == 2018 && parseInt(month) < 12) ||  (parseInt(month) == 12 && parseInt(day) < 10)) {
            alert("You cannot choose a date that has already passed.");
          } else if (((parseInt(month) == 2) || (parseInt(month) == 4) || (parseInt(month) == 6) || (parseInt(month) == 9) || (parseInt(month) == 11)) && parseInt(day) == 31)  {
            alert("This date does not exist.");
          } else if ((parseInt(year) == 2019 && parseInt(month) == 2 && parseInt(day) > 28) || (parseInt(year) == 2020 && parseInt(month) == 2 && parseInt(day) > 29)) {
            alert("This date does not exist.");
          } else {
            let flightData = {
              "flight": {
                "departs_at":   depTime,
                "arrives_at":   arrTime,
                "number":       "request",
                "plane_id":     2249, //ok to be hardcoded - everything plane
                "departure_id": 134212, //ok to be hardcoded - CYO
                "arrival_id":   airport_id
              }
            }
          // POST new flight to API
            $.ajax(root_url + "flights", {
               type: 'POST',
               dataType: 'json',
               data: flightData,
               xhrFields: {withCredentials: true},
               success: (response) => {
                 console.log(response);
                 make_flight_list(reqdiv, currentAirportRequestPage);
                 // make new instance of the flight
                 let instanceData = {
                   "instance" : {
                     "flight_id": response.id,
                     "date":      date
                   }
                 }

                 $.ajax(root_url + "instances", {
                   type: 'POST',
                   dataType: 'json',
                    data: instanceData,
                   xhrFields: {withCredentials: true},
                   success: (response) => {
                   }
                 });
               }
            }); // end of ajax call for flights
          }

        });

      });

      }
    });

    // final request button
    let endDiv = $('<div id="endDiv"></div>');
    reqdiv.after(endDiv);
    endDiv.append('<input type="button" value="REQUEST" id="requestDone"> </input>');

    // click event for request button -- POST new ticket
    $('#requestDone').on("click", function(){

      let chosenFlight = matchArray[$(".reqbutton").val()]; //this is where the problem is - FIX!!
      console.log("chosenFlight =");
      console.log(chosenFlight);
      let airport_id = chosenFlight.arrival_id;
      let flight_id = chosenFlight.id;
      $.ajax(root_url + "instances?filter[flight_id]=" + flight_id,
             {
             type: 'GET',
             dataType: 'json',
             xhrFields: {withCredentials: true},
             success: (response) => {
                 let instance = response[0]; //array should be exactly one instance
                 let instance_id = instance.id;
                 console.log(gender);
                 let data =  { "ticket" : {
                                   "first_name": itemName,
                                   "middle_name" : "User",
                                   "last_name": "Request",
                                   "age" : 1,
                                   "gender" : gender,
                                   "is_purchased" : 1.0,
                                   "price_paid" : priceWillReq,
                                   "instance_id" : instance_id,
                                   "seat_id" : 5520 //ok - seat 11 on everything plane
                                   }
                               };
                  // POST new ticket with given info from user
                  $.ajax(root_url + "/tickets?" , {
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        xhrFields: {withCredentials: true},
                        success: (response) => {
                          console.log(response);
                        }
                   });
             }
        });
    });


  });
	
	// request page
  $("#request").on("click", function(){
    main.empty();
    newLine(main);
    main.append('<div id="req_div"> Make a Request! </div> ');

    // Make text boxes with options for user to fill in
    reqdiv = $('#req_div');
    newLine(reqdiv);
    reqdiv.append('<input type="text" placeholder="Send to Airport"> </input>'); //will change to drop down of airports
    newLine(reqdiv);
    reqdiv.append('<input type="text" placeholder="What item are you requesting?"> </input>');
    newLine(reqdiv);
    reqdiv.append('<input type="text" placeholder="How much are you willing to pay?"> </input>');

    //List of flights going to that airport
    reqdiv.append('<ul id = "req_flightlist"></ul>');
    reqFlightList = $('#req_flightlist');
    reqFlightList.append('<li>Flight 1 here... </li>');
    reqFlightList.append('<li>Flight 2 here...</li>');
    reqFlightList.append('<li>Flight 3 here...</li>');

    reqdiv.append('<input type="button" value="REQUEST" id="requestDone"> </input>');

    $('#requestDone').on("click", function(){
      
    });


  });
	


  // function to update flight list when new one is added
  function make_flight_list(reqdiv, wantedAirport) {
    $('#req_flightlist').empty();
    let airport_id = wantedAirport.id; //check this is out of scope
    let flight;

     let matchArray = [];
    $.ajax(root_url + "flights", {
       type: 'GET',
       dataType: 'json',
       xhrFields: {withCredentials: true},
       success: (response) => {
         console.log(response);
         let array = response;

         //find correct arrival ids
         for (let i=0; i<array.length; i++) {
              if(array[i].arrival_id == airport_id){
                  //get instance of that flight
                  matchArray.push(array[i]);
                  console.log(array[i]);
                }
        }

      // create text nodes of flight info, radio button to choose one, and append to list div for flights
      for (let j = 0; j < matchArray.length; j++) {
          let flightDiv =  $('<div id="indivFlight"></div>');
          let arrivalid = airport_id; //changed
          let arrivesat = matchArray[j].arrives_at;
          flight = $('<input class="reqbutton" type="radio" name="flight" value="' + j + '"> Choose this Flight: <br>');
          let arrdate = document.createTextNode("Arrival Date: " + arrivesat.slice(NaN, 10));
          let arrtime = document.createTextNode("Arrival Time: " + arrivesat.slice(11, 16));
          // let airText = document.createTextNode("Arrival Airport: " + arrivalid);
          flightDiv.append(flight);
          flightDiv.append(arrtime);
          reqFlightList.append(flightDiv);
          reqFlightList.append(flightDiv);
      }
     }
   });
  }

  function addTimeDropdown() {
    let td = $('<td class="record-value"></td>');
    $('#newFlightInput').append(td);

    td.append("Arrival Time: ");
    // add hour dropdown
    let div = $('<div id="hourDiv" class="form-inline time-view"></div>');
    let selectTime = $('<select tabindex="0" id="hourSel" class="form-control x-select time-view">');
    td.append(div);
    div.append("Hour: ");
    div.append(selectTime);
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        let timeOpt = $('<option value="0' + i + '" id="hour0' + i + '" class="x-option time-view"></option>');
        let text = document.createTextNode("0" + i);
        timeOpt.append(text);
        selectTime.append(timeOpt);
      } else {
        let timeOpt = $('<option value="' + i + '" id="hour' + i + '" class="x-option time-view"></option>');
        selectTime.append(timeOpt);
        let text = document.createTextNode(i);
        timeOpt.append(text);
      }
    }

    // add minute dropdown
    let minDiv = $('<div id="minDiv" class="form-inline min-view"></div>');
    let selectMin = $('<select tabindex="0" id="minSel" class="form-control x-select min-view">');
    td.append(minDiv);
    minDiv.append("Min: ");
    minDiv.append(selectMin);
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        let timeOpt = $('<option value="0' + i + '" id="min0' + i + '" class="x-option min-view"></option>');
        let text = document.createTextNode("0" + i);
        timeOpt.append(text);
        selectMin.append(timeOpt);
      } else {
        let timeOpt = $('<option value="' + i + '" id="min' + i + '" class="x-option min-view"></option>');
        selectMin.append(timeOpt);
        let text = document.createTextNode(i);
        timeOpt.append(text);
      }
    }
  }

  function addDateDropdown() {
    let td = $('<td class="record-value"></td>');
    $('#newFlightInput').append(td);

    td.append("Arrival Date: ");
    // add year dropdown
    let yearDiv = $('<div id="yearDiv" class="form-inline year-view"></div>');
    let selectYear = $('<select tabindex="0" id="yearSel" class="form-control x-select year-view">');
    td.append(yearDiv);
    yearDiv.append("Year: ");
    yearDiv.append(selectYear);
    for (let i = 0; i < 3; i++) {
        let p = 2018 + i;
        let timeOpt = $('<option value="' + p + '" id="year' + i + '" class="x-option year-view"></option>');
        selectYear.append(timeOpt);
        let text = document.createTextNode(p);
        timeOpt.append(text);
    }

    // add month dropdown
    let monthDiv = $('<div id="monthDiv" class="form-inline month-view"></div>');
    let selectMonth = $('<select tabindex="0" id="monthSel" class="form-control x-select month-view">');
    td.append(monthDiv);
    monthDiv.append("Month: ");
    monthDiv.append(selectMonth);
    for (let i = 1; i < 13; i++) {
      if (i < 10) {
        let timeOpt = $('<option value="0' + i + '" id="month0' + i + '" class="x-option month-view"></option>');
        let text = document.createTextNode("0" + i);
        timeOpt.append(text);
        selectMonth.append(timeOpt);
      } else {
        let timeOpt = $('<option value="' + i + '" id="month' + i + '" class="x-option month-view"></option>');
        selectMonth.append(timeOpt);
        let text = document.createTextNode(i);
        timeOpt.append(text);
      }
    }

    // add day dropdown
    let dayDiv = $('<div id="dayDiv" class="form-inline day-view"></div>');
    let selectDay = $('<select tabindex="0" id="daySel" class="form-control x-select day-view">');
    td.append(dayDiv);
    dayDiv.append("Day: ");
    dayDiv.append(selectDay);
    for (let i = 1; i < 32; i++) {
      if (i < 10) {
        let timeOpt = $('<option value="0' + i + '" id="day0' + i + '" class="x-option min-view"></option>');
        let text = document.createTextNode("0" + i);
        timeOpt.append(text);
        selectDay.append(timeOpt);
      } else {
        let timeOpt = $('<option value="' + i + '" id="day' + i + '" class="x-option min-view"></option>');
        selectDay.append(timeOpt);
        let text = document.createTextNode(i);
        timeOpt.append(text);
      }
    }
  }

});
