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

  $('#bright').prop("checked", true);

  //dikenna send page
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

  $('.rbutton').on('click', function() {
    gender = $(this).val();
    darkBrightHandler(gender);
  });

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

      for(let i = 0; i < document.getElementsByClassName("navbar-item").length; i++){
        document.getElementsByClassName("navbar-item")[i].style.color = "white";
      }

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

      for(let i = 0; i < document.getElementsByClassName("navbar-item").length; i++){
        document.getElementsByClassName("navbar-item")[i].style.color = "black";
      }

    }
  }


});
