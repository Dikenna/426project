
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






$('#home').on("click", function() {
  main.empty();
  $('.client-items').empty();

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

  main.append($('<div class = "client-items"></div>'));
  $('.client-items').append($('<h1 class = "sell"> Up For Sale </h1>'));
  $('.sell').append($('<div id="upForSale"></div>'));
  make_upForSale_list(gender);

  $('.client-items').append($('<h1 class= "fulfill"> Fulfilled Requests </h1>'));
  $('.fulfill').append($('<div id="fulfilledReq"></div>'));
  make_fulfilled_list(gender);

  $('.client-items').append($('<h1 class = "ordered"> Ordered </h1>'));
  $('.ordered').append($('<div id="order"></div>'));
  make_order_list(gender);

  $('.client-items').append($('<h1 class = "requestsMade"> Requests Made </h1>'));
  $('.requestsMade').append($('<div id="requestsMade"></div>'));
  make_requestMade_list(gender);

});




function newLine(x){
  x.append('<br></br>');
}



// populate the up for sale items on my things page
function make_upForSale_list(gender) {
  $('#upForSale').empty();

  $.ajax(root_url + "tickets?filter[is_purchased]=0.0", //filtering ajax request on tickets
     {
         type: 'GET',
         dataType: 'json',
         xhrFields: {withCredentials: true},
         success: (response) => {
           let ticketArray = response;
           for (let i = 0; i < ticketArray.length; i++) {
             if (ticketArray[i].last_name.includes("User") && ticketArray[i].gender == gender) {
               $.ajax(root_url + "instances?filter[id]=" + ticketArray[i].instance_id, //filtering ajax request on tickets
                  {
                      type: 'GET',
                      dataType: 'json',
                      xhrFields: {withCredentials: true},
                      success: (response) => {
                         let instanceRay = response;
                         for (let j = 0; j < instanceRay.length; j++) {
                           if (instanceRay[j].id == ticketArray[i].instance_id) {
                             let date = instanceRay[j].date;
                             $.ajax(root_url + "flights?filter[id]=" + instanceRay[j].id, //filtering ajax request on tickets
                                {
                                    type: 'GET',
                                    dataType: 'json',
                                    xhrFields: {withCredentials: true},
                                    success: (response) => {
                                      let flightRay = response;
                                      for (let p = 0; p < flightRay.length; p++) {
                                        if (flightRay[p].id == instanceRay[j].flight_id) {
                                          $.ajax(root_url + "airports?filter[id]=" + flightRay[p].departure_id, //filtering ajax request on tickets
                                             {
                                                 type: 'GET',
                                                 dataType: 'json',
                                                 xhrFields: {withCredentials: true},
                                                 success: (response) => {
                                                   let airRay = response;
                                                   for (let m = 0; m < airRay.length; m++) {
                                                     if (airRay[m].id == flightRay[p].departure_id) {
                                                       let indTick = $('<div id="indTick"></div>');
                                                       indTick.append(ticketArray[i]);
                                                       indTick.append('<div id="itemNameSale"> Item: ' + ticketArray[i].first_name + '</div>');
                                                       indTick.append('<div id="askingPriceSale"> Asking Price: ' + ticketArray[i].price_paid + '</div>');
                                                       indTick.append('<div id="depDateSale"> Depature Date: ' + date + '</div>');
                                                       indTick.append('<div id="depTimeSale"> Departure Time: ' + flightRay[p].departs_at.slice(11, 16) + '</div>');
                                                       indTick.append('<div id="depAirSale"> Departure Airport: ' + airRay[m].name + " (" + airRay[m].code + ")" + '</div>');
                                                       newLine(indTick);
                                                       $('#upForSale').append(indTick);
                                                   }
                                                }
                                              }
                                           });
                                       }
                                  }
                              }
                           });
                          }
                       }
                    }
                });
             }
           }
         }
    });
}

// populate the fulfilled items on my things page
function make_fulfilled_list(gender) {
  $('#fulfilledReq').empty();

  $.ajax(root_url + "tickets?filter[is_purchased]=1.0", //filtering ajax request on tickets
     {
         type: 'GET',
         dataType: 'json',
         xhrFields: {withCredentials: true},
         success: (response) => {
           let ticketArray = response;
           for (let i = 0; i < ticketArray.length; i++) {
             if (ticketArray[i].last_name.includes("User") && ticketArray[i].gender == gender) {
               $.ajax(root_url + "instances?filter[id]=" + ticketArray[i].instance_id, //filtering ajax request on tickets
                  {
                      type: 'GET',
                      dataType: 'json',
                      xhrFields: {withCredentials: true},
                      success: (response) => {
                         let instanceRay = response;
                         for (let j = 0; j < instanceRay.length; j++) {
                           if (instanceRay[j].id == ticketArray[i].instance_id) {
                             let date = instanceRay[j].date;
                             $.ajax(root_url + "flights?filter[id]=" + instanceRay[j].id, //filtering ajax request on tickets
                                {
                                    type: 'GET',
                                    dataType: 'json',
                                    xhrFields: {withCredentials: true},
                                    success: (response) => {
                                      let flightRay = response;
                                      for (let p = 0; p < flightRay.length; p++) {
                                        if (flightRay[p].id == instanceRay[j].flight_id) {
                                          $.ajax(root_url + "airports?filter[id]=" + flightRay[p].departure_id, //filtering ajax request on tickets
                                             {
                                                 type: 'GET',
                                                 dataType: 'json',
                                                 xhrFields: {withCredentials: true},
                                                 success: (response) => {
                                                   let airRay = response;
                                                   for (let m = 0; m < airRay.length; m++) {
                                                     if (airRay[m].id == flightRay[p].departure_id) {
                                                       let indFluff = $('<div id="indFluff"></div>');
                                                       indFluff.append(ticketArray[i]);
                                                       indFluff.append('<div id="itemNameFulfill"> Item: ' + ticketArray[i].first_name + '</div>');
                                                       indFluff.append('<div id="compFulfill"> Compensation: ' + ticketArray[i].price_paid + '</div>');
                                                       indFluff.append('<div id="depDateFulfill"> Depature Date: ' + date + '</div>');
                                                       indFluff.append('<div id="depTimeFulfill"> Departure Time: ' + flightRay[p].departs_at.slice(11, 16) + '</div>');
                                                       indFluff.append('<div id="depAirFulfill"> Departure Airport: ' + airRay[m].name + " (" + airRay[m].code + ")" + '</div>');
                                                       newLine(indFluff);
                                                       $('#fulfilledReq').append(indFluff);
                                                   }
                                                }
                                              }
                                           });
                                       }
                                  }
                              }
                           });
                          }
                       }
                    }
                });
             }
           }
         }
    });
}

// populate the ordered items on my things page
function make_order_list(gender) {
  $('#order').empty();

  $.ajax(root_url + "tickets?filter[is_purchased]=1.0", //filtering ajax request on tickets
     {
         type: 'GET',
         dataType: 'json',
         xhrFields: {withCredentials: true},
         success: (response) => {
           let ticketArray = response;
           for (let i = 0; i < ticketArray.length; i++) {
             if (ticketArray[i].middle_name.includes("User") && ticketArray[i].last_name != "Request" && ticketArray[i].last_name != "" && ticketArray[i].gender == gender) {
               $.ajax(root_url + "instances?filter[id]=" + ticketArray[i].instance_id, //filtering ajax request on tickets
                  {
                      type: 'GET',
                      dataType: 'json',
                      xhrFields: {withCredentials: true},
                      success: (response) => {
                         let instanceRay = response;
                         for (let j = 0; j < instanceRay.length; j++) {
                           if (instanceRay[j].id == ticketArray[i].instance_id) {
                             let date = instanceRay[j].date;
                             $.ajax(root_url + "flights?filter[id]=" + instanceRay[j].id, //filtering ajax request on tickets
                                {
                                    type: 'GET',
                                    dataType: 'json',
                                    xhrFields: {withCredentials: true},
                                    success: (response) => {
                                      let flightRay = response;
                                      for (let p = 0; p < flightRay.length; p++) {
                                        if (flightRay[p].id == instanceRay[j].flight_id) {
                                          $.ajax(root_url + "airports?filter[id]=" + flightRay[p].arrival_id, //filtering ajax request on tickets
                                             {
                                                 type: 'GET',
                                                 dataType: 'json',
                                                 xhrFields: {withCredentials: true},
                                                 success: (response) => {
                                                   let airRay = response;
                                                   for (let m = 0; m < airRay.length; m++) {
                                                     if (airRay[m].id == flightRay[p].arrival_id) {
                                                       let indFluff = $('<div id="indFluff"></div>');
                                                       indFluff.append(ticketArray[i]);
                                                       indFluff.append('<div id="itemNameOrder"> Item: ' + ticketArray[i].first_name + '</div>');
                                                       indFluff.append('<div id="priceOrder"> Price: ' + ticketArray[i].price_paid + '</div>');
                                                       indFluff.append('<div id="arrDateOrder"> Arrival Date: ' + date + '</div>');
                                                       indFluff.append('<div id="arrTimeOrder"> Arrival Time: ' + flightRay[p].arrives_at.slice(11, 16) + '</div>');
                                                       indFluff.append('<div id="arrAirOrder"> Arrival Airport: ' + airRay[m].name + " (" + airRay[m].code + ")" + '</div>');
                                                       newLine(indFluff);
                                                       $('#order').append(indFluff);
                                                   }
                                                }
                                              }
                                           });
                                       }
                                  }
                              }
                           });
                          }
                       }
                    }
                });
             }
           }
         }
    });
}

// populate the requests made for items on my things page
function make_requestMade_list(gender) {
  $('#requestsMade').empty();

  $.ajax(root_url + "tickets?filter[is_purchased]=1.0", //filtering ajax request on tickets
     {
         type: 'GET',
         dataType: 'json',
         xhrFields: {withCredentials: true},
         success: (response) => {
           let ticketArray = response;
           for (let i = 0; i < ticketArray.length; i++) {
             if (ticketArray[i].last_name.includes("Request") && ticketArray[i].middle_name.includes("User") && ticketArray[i].gender == gender) {
               $.ajax(root_url + "instances?filter[id]=" + ticketArray[i].instance_id, //filtering ajax request on tickets
                  {
                      type: 'GET',
                      dataType: 'json',
                      xhrFields: {withCredentials: true},
                      success: (response) => {
                         let instanceRay = response;
                         for (let j = 0; j < instanceRay.length; j++) {
                           if (instanceRay[j].id == ticketArray[i].instance_id) {
                             let date = instanceRay[j].date;
                             $.ajax(root_url + "flights?filter[id]=" + instanceRay[j].id, //filtering ajax request on tickets
                                {
                                    type: 'GET',
                                    dataType: 'json',
                                    xhrFields: {withCredentials: true},
                                    success: (response) => {
                                      let flightRay = response;
                                      for (let p = 0; p < flightRay.length; p++) {
                                        if (flightRay[p].id == instanceRay[j].flight_id) {
                                          $.ajax(root_url + "airports?filter[id]=" + flightRay[p].departure_id, //filtering ajax request on tickets
                                             {
                                                 type: 'GET',
                                                 dataType: 'json',
                                                 xhrFields: {withCredentials: true},
                                                 success: (response) => {
                                                   let airRay = response;
                                                   for (let m = 0; m < airRay.length; m++) {
                                                     if (airRay[m].id == flightRay[p].departure_id) {
                                                       let indFluff = $('<div id="indFluff"></div>');
                                                       indFluff.append(ticketArray[i]);
                                                       indFluff.append('<div id="itemNameReqMade"> Item: ' + ticketArray[i].first_name + '</div>');
                                                       indFluff.append('<div id="priceReqMade"> Price: ' + ticketArray[i].price_paid + '</div>');
                                                       indFluff.append('<div id="arrDateReqMade"> Arrival Date: ' + date + '</div>');
                                                       indFluff.append('<div id="arrTimeReqMade"> Arrival Time: ' + flightRay[p].departs_at.slice(11, 16) + '</div>');
                                                       indFluff.append('<div id="arrAirReqMade"> Arrival Airport: ' + airRay[m].name + " (" + airRay[m].code + ")" + '</div>');
                                                       newLine(indFluff);
                                                       $('#requestsMade').append(indFluff);
                                                   }
                                                }
                                              }
                                           });
                                       }
                                  }
                              }
                           });
                          }
                       }
                    }
                });
             }
           }
         }
    });
}



});
