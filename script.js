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
    
  $("#receive").on("click", function(){
    main.empty();
    newLine(main);
    
    let recDiv = $('<div id="receive_div"> Pick Up </div> '); //main holder div for receive section
    main.append(recDiv);
    recDiv.append('<input type="text" placeholder="Aiports Near You ..."> </input>'); //will change to drop down of airports or autocomplete - arrival airport on ticket
    
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
	

});
