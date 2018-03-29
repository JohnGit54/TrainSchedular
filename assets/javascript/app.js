
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB2bMy0IMJePW-V4eUguj_a8KHZ8y7Pvdk",
    authDomain: "bootcamp7firebase.firebaseapp.com",
    databaseURL: "https://bootcamp7firebase.firebaseio.com",
    projectId: "bootcamp7firebase",
    storageBucket: "bootcamp7firebase.appspot.com",
    messagingSenderId: "505631329820"
};
firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();


// Capture S Button Click
$("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes

    var trainName = $("#trainname").val().trim();
    var destination = $("#destination").val().trim();
    var FirstTrainTime = $("#FirstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();


    //empty message box 
    $("#trainname").val('');
    $("#destination").val('');
    $('#FirstTrainTime').val('');
    $("#frequency").val('');

    //create dateAdded
    // var myDate = moment();
    // console.log('myDate', JSON.stringify(myDate));


    // Code for handling the push
    database.ref('/train/schedule').push({
        trainName: trainName,
        destination: destination,
        FirstTrainTime: FirstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});


/////////////////////////////////////////////////////////

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref('/train/schedule').orderByChild("dateAdded").limitToLast(60).on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var DateAdded = moment(sv.dateAdded);
    // Console.loging the last user's data
    console.log(sv.trainName, sv.destination, sv.FirstTrainTime, sv.frequency, DateAdded, sv.dateAdded);


    //calculations from train example
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.FirstTrainTime, "HH:mm").subtract(1, "years");
    console.log('firstTimeConverted', firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    console.log("currentTime: ", currentTime);

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



    var tr = $('<tr>');
    var tdTrain = $('<td>');
    tdTrain.text(sv.trainName);

    var tdDest = $('<td>');
    tdDest.text(sv.destination);

    var tdFeq = $('<td>');
    tdFeq.text(sv.frequency);

    
    var tdNxAr = $('<td>');
    var xx=moment(nextTrain).format("hh:mm") ;
    console.log('xx',xx);
    tdNxAr.text(xx);

    var tdminAway = $('<td>');
    tdminAway.text(tMinutesTillTrain);

    tr.append(tdTrain).append(tdDest).append(tdFeq).append(tdNxAr).append(tdminAway);


    $('.table').append(tr);


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});