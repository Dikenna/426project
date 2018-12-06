$(document).ready(function() {

  let main = $('#main');
  var root_url = "http://comp426.cs.unc.edu:3001/";
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
      $.ajax(root_url + "airports",
                                 {
                                     type: 'GET',
                                     dataType: 'json',
                                     xhrFields: {withCredentials: true},
                                     success: (response) => {
                                          airports = response;
                                     }
                                 });

   $('.rbutton').on('click', function() {
     gender = $(this).val();
   });
   var gender;

  $("#receive").on("click", function(){
   main.empty();

   let recDiv = $('<div id="receive_div"> </div>');
   let airportDiv = $('<div id="airport_div"> </div>');  // floating left
   let itemDiv = $('<div id="items_div"> </div>');  // floating right

   recDiv.append(airportDiv);
   recDiv.append(itemDiv);

   newLine(airportDiv, 4);
   airportDiv.append('<h1 id="search_airport">SEARCH AIRPORT</h1>');
   main.append(recDiv);

   let formDiv = $('<div></div>');
   airportDiv.append(formDiv);

   let autoCompleteDiv = $('<div class="autocomplete"><input id="myInput" type="text" name="myCountry" placeholder="Airports Near You ..." searchBar><br></div>');
   formDiv.append(autoCompleteDiv);

   listDiv = $('<div id="list_of_tickets"> </div> '); //all tickts go in here
   newLine(itemDiv, 2);
   itemDiv.append(listDiv);

   let searchResult = "";
   let airportNames = new Array(airports.length -1);
   let airportsNotCYO = new Array(airports.length -1);

   let j = 0;
   for (let i=0; i < airports.length; i++) {
     if (airports[j].code == "CYO"){
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
                               $('#myInput').val(airportsNotCYO[i].name); //dikenna is currently here
                               $(".ticketDiv").remove();
                               currentAirportReceivePage = airportsNotCYO[i];

                               listDiv.empty();
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
                                            $.ajax(root_url + "tickets?filter[is_purchased]=0.0&filter[instance_id]=" + instance_id,
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
   darkBrightHandler(gender);

  });

  function newLine(x){
    x.append('<br></br>');
  }

  function newLine(x, y){
    for(let i = 0; i < y; i++){
      x.append('<br></br>');
    }
  }

  function darkBrightHandler(gender){
    if (gender == "dark") {
      document.body.style.backgroundColor = "#282828";
      document.body.style.color = "white";
      if(document.getElementById("req_flightlist")!=null)
        document.getElementById("req_flightlist").style.backgroundColor = "rgba(0,0,0,0.5)";

      if(document.getElementById("newFlightInput")!=null)
        document.getElementById("newFlightInput").style.backgroundColor = "rgba(0,0,0,0.5)";

      if(document.getElementById("airport_div")!=null)
        document.getElementById("airport_div").style.backgroundColor = "rgba(0,0,0,0.5)";

      if(document.getElementById("items_div")!=null)
        document.getElementById("items_div").style.backgroundColor = "rgba(0,0,25,0.5)";

        document.getElementById("navdiv").style.color = "white";


    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      if(document.getElementById("req_flightlist")!=null)
        document.getElementById("req_flightlist").style.backgroundColor = "rgba(250,250,250,0.5)";

      if(document.getElementById("newFlightInput")!=null)
        document.getElementById("newFlightInput").style.backgroundColor = "rgba(250,250,250,0.5)";

      if(document.getElementById("airport_div")!=null)
        document.getElementById("airport_div").style.backgroundColor = "rgba(245, 245, 245, 0.5)";

      if(document.getElementById("items_div")!=null)
        document.getElementById("items_div").style.backgroundColor = "rgba(220, 220, 245, 0.5)";

      document.getElementById("navdiv").style.color = "black";

    }
  }

});
