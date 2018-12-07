
  // here is all the global stuff
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
  make_upForSale_list(gender);
  make_fulfilled_list(gender);
  make_order_list(gender);
  make_requestMade_list(gender);
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



  // fulfill page
  $('#fulfill').on("click", function() {
    main.empty();
    newLine(main);
    main.append('<div id="request_div"> Current Requests: </div> ');

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

    requestdiv = $('#request_div');
    requestlist = $('<div id="requestlist"></div>');
    requestdiv.append(requestlist);
    make_request_list(gender);
    $('#request_div').append('<input type="button" id="sendUpdate" value="SEND ITEM"> </input>');

    // click event for fulfill button -- PATCH ticket to have User be the seller
    $('#sendUpdate').on("click", function() {
      let data = { "ticket": {"last_name": currentName } }
        // .requestButton is the class name for the radio button
        $.ajax(root_url + "tickets/" + $('.requestButton').val(), {
          type: 'PATCH',
          dataType: 'json',
          data: data,
          xhrFields: {withCredentials: true},
          success: (response) => {
            // re-populates request list
            make_request_list(gender);
          }
        });
    });
  });



  function newLine(x){
    x.append('<br></br>');
  }




  // function to load request list
  function make_request_list(gender) {
    $('#requestlist').empty();
    currentRequestRadioVal = 0;
    let matchArray = [];
    let instanceID, currentID;

    $.ajax(root_url + "tickets", {
       type: 'GET',
       dataType: 'json',
       xhrFields: {withCredentials: true},
       success: (response) => {
         let array = response;
         //find all requests where middle/last name is not the User and gender is correct
         for (let i = 0; i < array.length; i++ ) {
           if (array[i].gender == gender && array[i].is_purchased == true) {
            if (array[i].middle_name.includes("User")){
              //nothing
            } else {
              if (array[i].last_name.includes("User")){
                //nothing
              } else {
                matchArray.push(array[i]);
              }
            }

           }
         }
      // create text nodes of flight info, radio button to choose one, and append to list div for flights
      for (let j = 0; j < matchArray.length; j++) {
          let reqListDiv = $('<div id="indivRequest"></div>');
          instanceID = matchArray[j].instance_id;
          currentID = matchArray[j].id;
          console.log(currentID);
          let firstName = matchArray[j].first_name;
          let pricePay = matchArray[j].price_paid;
          $.ajax(root_url + "instances?filter[id]=" + matchArray[j].instance_id,
                 {
                 type: 'GET',
                 dataType: 'json',
                 xhrFields: {withCredentials: true},
                 success: (response) => {function make_flight_list(airportid) {
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
                                                let indivTick = $('<div id="indivTicket_' + currentID + '"></div>');
                                                let requestButton = $('<input class="requestButton" type="radio" name="request" value="' + currentID + '"> Fulfill this Request: <br>');
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
                                                $('#requestlist').append(indivTick);
                                              }
                                            }
                                        }
                               });
                           }
                      });
                 }  // instance end
          });
      }  // end of for loop for matcharray
     }
   });
 } // end of make_request_list
