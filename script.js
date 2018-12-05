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


        let airports = [];
        let gender;
        $.ajax(root_url + "airports", //unfiltered
                                   {
                                       type: 'GET',
                                       dataType: 'json',
                                       xhrFields: {withCredentials: true},
                                       success: (response) => {
                                            airports = response;
                                       }
                                   });
  $('#bright').prop("checked", true);
  let currentGenderVal = "bright";
  
  let currentName = "User";
  $('.rbutton').on('click', function() {
    gender = $(this).val();
    currentGenderVal = gender; //added jess
    make_request_list(gender);
    if (gender == "dark") {
      document.body.style.backgroundColor = "#282828";
      document.body.style.color = "white";
      if(document.getElementById("req_flightlist")!=null) {
        document.getElementById("req_flightlist").style.backgroundColor = "rgba(0,0,0,0.5)";
        if (document.getElementById("newFlightInput") != null) {
          document.getElementById("newFlightInput").style.backgroundColor = "rgba(0,0,0,0.5)";
        }
      }
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      if(document.getElementById("req_flightlist")!=null) {
        document.getElementById("req_flightlist").style.backgroundColor = "rgba(250,250,250,0.5)";
        if (document.getElementById("newFlightInput") != null) {
          document.getElementById("newFlightInput").style.backgroundColor = "rgba(250,250,250,0.5)";
        }
      }
    }
  });
  
    
  

  //dikenna send page

  $("#send").on("click", function(){
    main.empty();
    newLine(main);
    main.append('<div id="request_div"> Current Requests </div> '); //left float request div
    main.append('<div id="send_div"> Send a package! </div> '); //right float send package div

    // select "gender", if dark, change background color
    $('#bright').prop("checked", true);
    let gender = "bright";
    $('.rbutton').on('click', function() {
      gender = $(this).val();
      if (gender == "dark") {
        document.body.style.backgroundColor = "#282828";
        document.body.style.color = "white";
        if(document.getElementById("req_flightlist")!=null) {
          document.getElementById("req_flightlist").style.backgroundColor = "rgba(0,0,0,0.5)";
          if (document.getElementById("newFlightInput") != null) {
            document.getElementById("newFlightInput").style.backgroundColor = "rgba(0,0,0,0.5)";
          }
        }
      } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        if(document.getElementById("req_flightlist")!=null) {
          document.getElementById("req_flightlist").style.backgroundColor = "rgba(250,250,250,0.5)";
          if (document.getElementById("newFlightInput") != null) {
            document.getElementById("newFlightInput").style.backgroundColor = "rgba(250,250,250,0.5)";
          }
        }
      }
    });

    //Add a list to request div and populate it with requests
    requestdiv = $('#request_div');
    requestlist = $('<div id="requestlist"></div>');
    requestdiv.append(requestlist);
    make_request_list(gender);

    //Populate send div
    senddiv = $('#send_div');
    newLine(senddiv);

    //jess autocomplete
    let autoCompleteDiv = $('<div class="autocomplete"></div>'); //added jess

    let airportDepart = $('<input type="text" id="depAirportInput" class="sendAirport" placeholder="Departure Airport" searchBar2> </input>'); //will change to drop down of airports or autocomplete
    autoCompleteDiv.append(airportDepart);
    senddiv.append(autoCompleteDiv);

    let airportName = "";
    airportDepart.on("keyup", function() {
        airportName = $(this).val();
    });

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

                                  $("#depAirportInput").val(airportsNotCYO[i].name);
                                  $(".dropdown").remove();
                                  $(".temp").remove();

                                  //remake flight list
                                  make_flight_list(currentAirportRequestPage.id);
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
      senddiv.append(airportDepart);



    let itemToSendInput = $('<input type="text" placeholder="What are you sending?"> </input>');
    senddiv.append(itemToSendINput);
    let itemToSend = "";
    itemToSendInput.on("keyup", function() {
      itemToSend = $(this).val();
    });

    let askingPriceInput = $('<input type="text" placeholder="How much are you asking for it?"> </input>');
    senddiv.append(askingPriceInput);
    let askPrice = 0;
    askingPriceInput.on("keyup", function() {
      askPrice = $(this).val();
    });
    newLine(senddiv);

    //List of flights
    senddiv.append('<ul id = "flightlist"></ul>');
    flightlist = $('#flightlist');
    make_flightlist_send_page(currentAirportRequestPage.id);

    // click event for send button -- changes ticket to have User be the seller
    senddiv.append('<input type="button" id=sendPUT" value="SEND ITEM"> </input>');
    $('#sendPUT').on("click", function() {

    });

    // click event for send button -- adds a flight instance to it if one is not already chosen
    senddiv.append('<input type="button" id=sendSubmit" value="SEND"> </input>');
    $('#sendSubmit').on("click", function() {

    });

  });

  function newLine(x){
    x.append('<br></br>');
  }

  $("#receive").on("click", function(){
    main.empty();
    newLine(main);

    let recDiv = $('<div id="receive_div"> Pick Up </div> '); //main holder div for receive section
    main.append(recDiv);

    recDiv.append('<input type="text" placeholder="Aiports Near You ..."> </input>'); //will change to drop down of airports or autocomplete - arrival airport on ticket

    let submitr = $("<button id=submit_rec_arrival> SUBMIT </button>");

    recDiv.append(submitr);

    recDiv.append('<h2> Avalible/Unpurchsed Items <h2>');

    let closetAirport = "RDU"; //whatever value from search bar - placeholder for now - i will fix

      //when airport is submitted, generate all unpurchased tickets for which that is the arrival airport
    $("#submit_rec_arrival").on("click", function(){

        //Gameplan:
        //get all flights arriving at airpot, get all instances of these planes, get unpurchased tickets of those instances, make new listing for each ticket
        //once make, these tickets could be sorted or whatever


        //get airport id
        let airport_id = 87590;

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

                    //get instance of that flight
                    let flight_id = array[i].id;

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

                                                recDiv.append(ticketDiv);

                                                //make feilds for ticket request
                                                ticketDiv.append('<div class="itemName">' + tickets[i].first_name + '</div>');
                                                ticketDiv.append('<div class="itemPrice">'+ "Asking Price: $" + tickets[i].price_paid + '</div>');

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
  });


  // $('.rbutton').on('click', function() {
  //   gender = $(this).val();
  //   make_request_list(gender);
  //   if (gender == "dark") {
  //     document.body.style.backgroundColor = "#282828";
  //     document.body.style.color = "white";
  //     if(document.getElementById("req_flightlist")!=null) {
  //       document.getElementById("req_flightlist").style.backgroundColor = "rgba(0,0,0,0.5)";
  //       if (document.getElementById("newFlightInput") != null) {
  //         document.getElementById("newFlightInput").style.backgroundColor = "rgba(0,0,0,0.5)";
  //       }
  //     }
  //   } else {
  //     document.body.style.backgroundColor = "white";
  //     document.body.style.color = "black";
  //     if(document.getElementById("req_flightlist")!=null) {
  //       document.getElementById("req_flightlist").style.backgroundColor = "rgba(250,250,250,0.5)";
  //       if (document.getElementById("newFlightInput") != null) {
  //         document.getElementById("newFlightInput").style.backgroundColor = "rgba(250,250,250,0.5)";
  //       }
  //     }
  //   }
  // });


  // olivia
	// request page
  $("#request").on("click", function(){
    main.empty();


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


    main.append('<div id="req_div"> </div> ');

    reqdiv = $('#req_div');
    newLine(reqdiv);
    reqdiv.append('<label class = "req_label"> MAKE A REQUEST!</label> ');
    newLine(reqdiv);

    //jess autocomplete
    let autoCompleteDiv = $('<div class="autocomplete"></div>'); //added jess

 
    // Make text boxes with options for user to fill in
    reqdiv.append('<div id="req_div_textholder"> </div> ');
    req_div_textholder = $('#req_div_textholder');

    let airportInput = $('<input type="text" id="airportInput" class="req" placeholder="Arrival airport" searchBar2> </input>'); // user types in arrival airport
    autoCompleteDiv.append(airportInput);  //new

    req_div_textholder.append(autoCompleteDiv);

    let airportName = "";
    airportInput.on("keyup", function() {
        airportName = $(this).val();
    });

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

                                $("#airportInput").val(airportsNotCYO[i].name);
                                $(".dropdown").remove();
                                $(".temp").remove();

                                //remake flight list
                                make_flight_list(currentAirportRequestPage.id);

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

  

    // newLine(reqdiv);
    let itemReqNameInput = $('<input type="text" id="itemRequestName" class="req" placeholder="Input item"> </input>');
    req_div_textholder.append(itemReqNameInput);

    let itemName = "";
    itemReqNameInput.on("keyup", function() {
      itemName = $(this).val();
    });


    // newLine(reqdiv);
    let priceReqInput = $('<input type="text" id="reqPriceWilling" class="req" placeholder="Price bid"> </input>');
    req_div_textholder.append(priceReqInput);

    let priceWillReq = "";
    priceReqInput.on("keyup", function() {
      priceWillReq = $(this).val();
    });


    newLine(reqdiv);

    //List of flights going to that airport
    reqdiv.append('<div id = "req_flightlist"></div>');
    reqFlightList = $('#req_flightlist');


    let airport_id = currentAirportRequestPage.id;
    //if problem, check here

      // give user the option to add a new flight if their preference is not there
      let makeFlight = $('<input class="reqbutton" type="radio" name="flight" id="newFlight"> Add New Flight <br>');
      reqdiv.append(makeFlight);
      let inputDiv = $('<div id="newFlightInput"></div>');
      $('#newFlight').on("click", function(){
        inputDiv.empty();

        // option for flight arrival time
        reqdiv.append(inputDiv);

        addDateDropdown();
        inputDiv.append('<br>');

        addTimeDropdown();
        let submitButton = $('<input type="button" value="SUBMIT" id="submitFlight"> </input>');
        inputDiv.append(submitButton);
        newLine(inputDiv);
        newLine(inputDiv);
        let arrTime;

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
                "plane_id":     2249,
                "departure_id": 134212,
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

                 make_flight_list(currentAirportRequestPage.id);

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

    $('.reqbutton').on('click', function() {
       console.log("here");
       chosenFlightValue = $(this).val();
       console.log(chosenFlightValue);

    });

    // final request button
    let endDiv = $('<div id="endDiv"></div>');
    reqdiv.after(endDiv);
    endDiv.append('<input type="button" value="REQUEST" id="requestDone"> </input>');

    // click event for request button -- POST new ticket
    $('#requestDone').on("click", function(){

      // let chosenFlight = matchArray[$(".reqbutton").val()]; // FIX HERE
      let chosenFlight = $(".reqbutton").val();
      // console.log(matchArray[$(".reqbutton").val()]);
      console.log(chosenFlight);
      console.log($(".reqbutton").val());


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
                                   "seat_id" : 5520
                                   }

                               }
                  if (itemName != "" && priceWillReq != "" && airport_id != "") {
                    // POST new ticket with given info from user
                    $.ajax(root_url + "/tickets?" , {
                          type: 'POST',
                          dataType: 'json',
                          data: data,
                          xhrFields: {withCredentials: true},
                          success: (response) => {
                          }
                     });
                 } else {
                   alert("Please fill in all input boxes to make a request.");
                 }

             }
        });
    });

  });

  // function to load request list
  function make_request_list(gender) {
    $('#requestlist').empty();
    let matchArray = [];

    $.ajax(root_url + "tickets", {
       type: 'GET',
       dataType: 'json',
       xhrFields: {withCredentials: true},
       success: (response) => {
         let array = response;
         //find all requests where middle/last name is not the User and gender is correct
         for (let i = 0; i < array.length; i++ ) {
           if (array[i].gender == gender && !array[i].last_name.includes("User") && array[i].is_purchased == true) {
            if (array[i].middle_name.includes("User")){
              //nothing
            } else {
              matchArray.push(array[i]);
            }

           }
         }
      // create text nodes of flight info, radio button to choose one, and append to list div for flights
      for (let j = 0; j < matchArray.length; j++) {
          let reqListDiv = $('<div id="indivRequest"></div>');
          let firstName = matchArray[j].first_name;
          let pricePay = matchArray[j].price_paid;
          $.ajax(root_url + "instances?filter[id]=" + matchArray[j].instance_id,
                 {
                 type: 'GET',
                 dataType: 'json',
                 xhrFields: {withCredentials: true},
                 success: (response) => {
                   let instarray = response;
                   let flight_id, dep_date;
                   // match the ticket with its instance object
                   for (let p = 0; p < instarray.length; p++) {
                     if (instarray[p].id == matchArray[j].instance_id) {
                       flight_id = instarray[p].flight_id;
                       dep_date = instarray[p].date;
                     }
                   }
                       // GET flight
                       $.ajax(root_url + "flights?filter[id]=" + flight_id, {
                              type: 'GET',
                              dataType: 'json',
                              xhrFields: {withCredentials: true},
                              success: (response) => {
                                let flightarray = response;
                                let dep_time, dep_id;
                                // match the ticket with its flight object
                                for (let m = 0; m < flightarray.length; m++) {
                                  if (instarray[m].id == matchArray[j].instance_id) {
                                    dep_time = flightarray[m].departs_at;
                                    dep_id = flightarray[m].departure_id;
                                  }
                                }
                       //            // GET airport
                                  $.ajax(root_url + "airports?", {
                                         type: 'GET',
                                         dataType: 'json',
                                         xhrFields: {withCredentials: true},
                                         success: (response) => {
                                            for (let k = 0; k < response.length; k++) {
                                              let airport = response[k];
                                              if (airport.id == dep_id) {
                                                let indivTick = $('<div id="indivTicket"></div>');
                                                let requestButton = $('<input class="requestButton" type="radio" name="request" value="' + j + '"> Fulfill this Request: <br>');
                                                let item = $('<div id="itemName">' + "Item Requested: " + firstName + '</div>');
                                                let compPrice = $('<div id="compPrice">' + "Compensation Price: $" + pricePay + '</div>');
                                                let depDate = $('<div id="depDate">' + "Departure Date: " + dep_date + '</div>');
                                                let depTime = $('<div id="depTime">' + "Departure Time: " + dep_time.slice(11, 16) + '</div>');
                                                let depAir = $('<div id="depAir">' + "Departure Airport: " + airport.name + " (" + airport.code + ")" + '</div>');
                                                indivTick.append(requestButton);
                                                indivTick.append(item);
                                                indivTick.append(compPrice);
                                                indivTick.append(depDate);
                                                indivTick.append(depTime);
                                                indivTick.append(depAir);
                                                newLine(indivTick);
                                                requestlist.append(indivTick);
                                              }
                                            }
                                        }
                               });
                             // }
                           }
                      });
                    // }
                 }  // instance end
          });
      }  // end of for loop for matcharray
     }
   });
  }

  // function to update flight list when new one is added
  function make_flight_list(airportid) {
    $('#req_flightlist').empty();
    let airport_id = airportid;

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

                }
        }

      // create text nodes of flight info, radio button to choose one, and append to list div for flights
      for (let j = 0; j < matchArray.length; j++) {
          let flightDiv =  $('<div id="indivFlight"></div>');

          let arrivalid = airport_id;
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
               flight = $('<input class="reqbutton" type="radio" name="flight" id="chooseFlight" value="' +
               j + '"> <label class="bold">Choose this Flight:</label> <br>');
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
     }
   });
  }


  function make_flightlist_send_page(airportid) {
    $('#flightlist').empty();
    let airport_id = airportid;
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
              if(array[i].departure_id == airport_id){
                  //get instance of that flight
                  matchArray.push(array[i]);
                }
        }

        // create text nodes of flight info, radio button to choose one, and append to list div for flights
        for (let j = 0; j < matchArray.length; j++) {
            let flightDiv =  $('<div id="indivFlight"></div>');
            let departureid = airport_id;
            let departsat = matchArray[j].arrives_at;
            let instanceDate;

            // get date
            $.ajax(root_url + "instances?filter[flight_id]=" + matchArray[j].id,
               {
               type: 'GET',
               dataType: 'json',
               xhrFields: {withCredentials: true},
               success: (response) => {
                 instanceDate = response[0].date;
                 flight = $('<input class="reqbutton" type="radio" name="flight" id="chooseFlight" value="' +
                 j + '"> <label class="bold">Choose this Flight:</label> <br>');
                 let deptime = document.createTextNode("Departure Time: " + departsat.slice(11, 16));
                 let depdate = document.createTextNode("Departure Date: " + instanceDate.toString());
                 flightDiv.append(flight);
                 flightDiv.append(depdate);
                 newLine(flightDiv);
                 flightDiv.append(deptime);
                 newLine(flightDiv);
                 flightlist.append(flightDiv);
               }
            });
        }
     }
   });
  }


  function addTimeDropdown() {
    let td = $('<td class="record-value"></td>');
    $('#newFlightInput').append(td);


    td.append('<label class = "timelabel bold"> ARRIVAL TIME: </label> ');

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

   td.append('<label class = "datelabel bold"> ARRIVAL DATE: </label> ');
    
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



//third party api
    $("#pokemonButton").on("click", function(){
                
        if (currentGenderVal == "dark"){
            $.ajax("https://pokeapi.co/api/v2/type/17/", //dark type
            {
                type: 'GET',
                dataType: 'json',
                
                success: (response) => {
                    let pokemon = response.pokemon;
                    let numPokemon = pokemon.length;
                    let rand = Math.floor(Math.random() * numPokemon);
                    
                    let pickedPokemon = pokemon[rand].pokemon.name;
                    
                    if (pickedPokemon.includes("-")){
                        let splitArray = pickedPokemon.split("-");
                        pickedPokemon = splitArray[0];
                    }
                    
                    currentName = pickedPokemon;
                    $("#currentPseudonym").text("Current Pseudonym: " + pickedPokemon);
                    
                }
            });
        } else {
            $.ajax("https://pokeapi.co/api/v2/type/3/", //flying type
            {
                type: 'GET',
                dataType: 'json',
                
                success: (response) => {
                    let pokemon = response.pokemon;
                    let numPokemon = pokemon.length;
                    let rand = Math.floor(Math.random() * numPokemon);
                    
                    let pickedPokemon = pokemon[rand].pokemon.name;
                    
                    if (pickedPokemon.includes("-")){
                        let splitArray = pickedPokemon.split("-");
                        pickedPokemon = splitArray[0];
                    }
                    
                    currentName = "User: " + pickedPokemon;
                    $("#currentPseudonym").text("Current Pseudonym: " + pickedPokemon);
                    
                }
            });
        }



    });








});

