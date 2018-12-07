$(document).ready(function() {

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




// up for sale page
$("#sell").on("click", function(){
  main.empty();
  newLine(main);
  main.append('<div id="send_div"> Send a package! </div> ');
  $('#flightlist').empty();

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
  //Populate send div
  senddiv = $('#send_div');
  newLine(senddiv);

  //jess autocomplete
  let autoCompleteDiv = $('<div class="autocomplete"></div>'); //added jess

  let airportDepart = $('<input type="text" id="depAirportInput" class="sendAirport" placeholder="Departure Airport" searchBar2> </input>'); //will change to drop down of airports or autocomplete
  autoCompleteDiv.append(airportDepart);
  senddiv.append(autoCompleteDiv);

  let airportName = "";
  // airportDepart.on("keyup", function() {
  //     airportName = $(this).val();
  // });

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
                                // alert(airportName);

                                $("#depAirportInput").val(airportsNotCYO[i].name);
                                $(".dropdown").remove();
                                $(".temp").remove();

                                //remake flight list
                                make_flightlist_send_page(currentAirportRequestPage.id);
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
  senddiv.append(itemToSendInput);
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
  senddiv.append('<div id = "flightlist"></div>');
  flightlist = $('#flightlist');
  make_flightlist_send_page(currentAirportRequestPage.id);

  // click event for send button -- adds a flight instance to it if one is not already chosen
  senddiv.append('<input type="button" id="sendSubmit" value="SEND"> </input>');

  $('#sendSubmit').on("click", function() {
    // keep everything in here -- this fixed the glitch
      let airport_id = currentAirportRequestPage.id;
      let flight_id = $('.flightButtonSend').val();

      // keep this part
      $.ajax(root_url + "instances?filter[flight_id]=" + flight_id,
             {
             type: 'GET',
             dataType: 'json',
             xhrFields: {withCredentials: true},
             success: (response) => {
               console.log(response);
               let instance = response[0]; //array should be exactly one instance
               let instance_id = instance.id;
               console.log(gender);
               let data =  { "ticket" : {
                                 "first_name": itemToSend,
                                 "middle_name" : "",
                                 "last_name": currentName,
                                 "age" : 1,
                                 "gender" : gender,
                                 "is_purchased" : 0.0,
                                 "price_paid" : askPrice,
                                 "instance_id" : instance_id,
                                 "seat_id" : 5520
                                 }
                             }
                if (itemToSend != "" && askPrice != "" && airport_id != "") {
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


function newLine(x){
  x.append('<br></br>');
}





function make_flightlist_send_page(airportid) {
  $('#flightlist').empty();
  let airport_id = airportid;
  let flight, currentFlightId;

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
          currentFlightId = matchArray[j].id;
          let departureid = airport_id;
          let departsat = matchArray[j].departs_at;
          let instanceDate;

          // get date
          $.ajax(root_url + "instances?filter[flight_id]=" + matchArray[j].id,
             {
             type: 'GET',
             dataType: 'json',
             xhrFields: {withCredentials: true},
             success: (response) => {
               // keep everything in here -- this fixed the glitch
               currentFlightId = response[0].flight_id;
               instanceDate = response[0].date;
               flight = $('<input class="flightButtonSend" type="radio" name="flight" id="'+ response[0].flight_id +'" value="' +
               currentFlightId + '"> <label class="bold">Choose this Flight:</label> <br>');
               let deptime = $('<div id="depTime">' + "Departure Time: " + departsat.slice(11, 16) + '</div>');
               let depdate = $('<div id="depDate">' + "Departure Date: " + instanceDate.toString() + '</div>');
               flightDiv.append(flight);
               flightDiv.append(depdate);
               flightDiv.append(deptime);
               newLine(flightDiv);
               $('#flightlist').append(flightDiv);
             }
          });
      }
   }
 });
}

});
