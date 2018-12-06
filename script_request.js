
$(document).ready(function() {

    let main = $('#main');
    $("#home").click();
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
        let currentRequestRadioVal = 0;
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
  let currentName = "User";
  $('.rbutton').on('click', function() {
    gender = $(this).val();
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

  // Make text boxes with options for user to fill in
  reqdiv = $('#req_div');
  newLine(reqdiv);

  let autoCompleteDiv = $('<div class="autocomplete"></div>'); //added jess

  let airportInput = $('<input type="text" id="airportInput" class="req" placeholder="Arrival airport" searchBar2></input><br>'); // user types in arrival airport
  autoCompleteDiv.append(airportInput);  //new

  reqdiv.append(autoCompleteDiv);

  let airportName = "";

  //jess helper code
  console.log(airports.length);
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

  newLine(reqdiv);
  let itemReqNameInput = $('<input type="text" id="itemRequestName" class="req" placeholder="What item are you requesting?"> </input>');
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
        make_flight_list(currentAirportRequestPage.id);
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
    // keep everything in here -- this fixed the glitch
    let airport_id = currentAirportRequestPage.id;
    let flight_id = $('.flightButtonReq').val();

    // keep this part though:
    $.ajax(root_url + "instances?filter[flight_id]=" + flight_id,
           {
           type: 'GET',
           dataType: 'json',
           xhrFields: {withCredentials: true},
           success: (response) => {
               let instance = response[0]; //array should be exactly one instance
               let instance_id = instance.id;
               console.log("instance_id:");
               console.log(instance_id);
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
                          $('#request').click();
                        }
                   });
               } else {
                 alert("Please fill in all input boxes to make a request.");
               }
           }
      });
  });


});







function newLine(x){
  x.append('<br></br>');
}




// function to update flight list when new one is added
function make_flight_list(airportid) {
  $('#req_flightlist').empty();
  let airport_id = airportid;
  let flight, currentflightId;

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
        currentFlightId = matchArray[j].id;
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
             // keep everything in here -- this fixed the glitch
             currentFlightId = response[0].flight_id;
             instanceDate = response[0].date;
             flight = $('<input class="flightButtonReq" type="radio" name="flight" id="'+ response[0].flight_id + '" value="' +
             currentFlightId + '"> <label class="bold">Choose this Flight:</label> <br>');
             let arrtime = $('<div id="arrTime">' + "Arrival Time: " + arrivesat.slice(11, 16) + '</div>');
             let arrdate = $('<div id="arrDate">' + "Arrival Date: " + instanceDate.toString() + '</div>');
             flightDiv.append(flight);
             flightDiv.append(arrdate);
             flightDiv.append(arrtime);
             newLine(flightDiv);
             $('#req_flightlist').append(flightDiv);
           }
        });
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
