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





$("#receive").on("click", function(){
  main.empty();
  newLine(main);

  let recDiv = $('<div id="receive_div"> Pick Up </div> '); //main holder div for receive section
  main.append(recDiv);
  recDiv.append('<input type="text" placeholder="Airports Near You ..."> </input>'); //will change to drop down of airports or autocomplete - arrival airport on ticket

  let submitr = $("<button id=submit_rec_arrival> Submit </button>");
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




function newLine(x){
  x.append('<br></br>');
}


});
