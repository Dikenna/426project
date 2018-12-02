$(document).ready(function() {
    let main = $('#main');
    
    //user creation and authentication that must be done
    
    
    
    
    

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
    
    recDiv.append('<h2> Avalible/Unpurchsed Items <h2>');
    
    let closetAirport = "RDU"; //whatever value from search bar - placeholder for now
      
    
    
    
    
      
  });

});

