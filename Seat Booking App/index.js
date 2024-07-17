const moviesList = [
    { movieName: "Kalki 2898 AD", price: 10},
    { movieName: "Kill", price: 7},
    { movieName: "Maharaja", price: 9},
    { movieName: "Chandu Champion", price: 8},
];

const selectMovieElement = document.getElementById("selectMovie");
const allSeatContainer = document.querySelectorAll("#seatContainer .seat");
const seatNotOccupied = document.querySelectorAll("#seatContainer .seat:not(.occupied)");
const selectedSeatHolderElement = document.getElementById("selectedSeatsHolder");
const moviePriceElement = document.getElementById("moviePrice");
const cancelBtnElement = document.getElementById("cancelBtn");
const processBtnElement = document.getElementById("proceedBtn");

// Adding Movie Option and Their Price
moviesList.forEach(movie => {
    const optionEl = document.createElement('option');
    optionEl.innerHTML = `${movie.movieName} $${movie.price}`;
    selectMovieElement.appendChild(optionEl);
});

// Adding value to the Attribute
let initialSeatValue = 0

allSeatContainer.forEach( (seat)=> {
    // attribute names are case-insensitive and usually written in lowercase.
    const attribute = document.createAttribute('data-seatid');
    attribute.value = ++initialSeatValue;
    seat.setAttributeNode(attribute);
});

// Select Movie and their price
let moviePrice = 10;
selectMovieElement.addEventListener('input', (e) => {
    let movieName = e.target.value.split("");
    let dollerIndex = movieName.indexOf("$");
    let movie = movieName.splice(0, dollerIndex-1).join("");
    let price = JSON.parse(movieName.splice(2, dollerIndex).join(""));
    moviePrice = price;
    UpdateMovieName(movie, price);
});

// Update movieName
function UpdateMovieName(movieName, price) {
    const movieNameEl = document.getElementById('movieName');
    const moviePriceEl = document.getElementById('moviePrice');

    movieNameEl.innerHTML = movieName;
    moviePriceEl.innerHTML = `$${price}`;
    cancelSeat();
}

// Select Seats
let takenSeat = [];

seatNotOccupied.forEach((seat) => {
    seat.addEventListener('click', (e) => {
        let isSelected = seat.classList.contains('selected');
        let seatid = JSON.parse(seat.dataset.seatid);

        if(!isSelected && !seat.classList.contains('occupied')) {
            seat.classList.add('selected');
            takenSeat.push(seatid);
            takenSeat = [...new Set(takenSeat)]; // Ensure unique seat IDs
        }else {
            seat.classList.remove('selected');
            takenSeat = takenSeat.filter((seat) => {
                if( seat !== seatid) {
                    return seat;
                }
            });
        }
        updatePrice(moviePrice, takenSeat.length);
        updateSeats();
    });
})

// Update the Movie Price
function updatePrice(price , seats) {
    let total = seats * price;
    const totalPriceEl = document.getElementById('totalPrice');
    totalPriceEl.innerHTML = `$${total}`;
} 

// Update Seats
function updateSeats() {
    selectedSeatHolderElement.innerHTML = ``;

    takenSeat.forEach(seat => {
        const seatHolder = document.createElement('div');
        seatHolder.classList.add('selectedSeat');
        selectedSeatHolderElement.appendChild(seatHolder);
        seatHolder.innerHTML = seat;
    })

    if(!takenSeat.length) {
        const spanEl = document.createElement('span');
        spanEl.classList.add('noSelected');
        spanEl.innerHTML = 'No Seat Selected';
        selectedSeatHolderElement.appendChild(spanEl);
    }

    seatCount();
}

// Count the Number of Seat
function seatCount() {
    const totalSeat = document.getElementById('numberOfSeat');
    totalSeat.innerHTML = takenSeat.length;
}

// Cancel Seat
cancelBtnElement.addEventListener('click', ()=> {
    if(takenSeat.length){
        if(confirm('Are you sure you want to cancel the tickets ?')){
            cancelSeat();
        }
    } else {
        alert('Oops no seat Selected');
    }
})

function cancelSeat() {
    takenSeat = [];
    seatNotOccupied.forEach(seat => {
        seat.classList.remove('selected');
    });

    updatePrice(0,0);
    updateSeats();
}

// Booking Seat
processBtnElement.addEventListener('click', (e)=> {
    if(takenSeat.length){
        alert('Yayy! Your Seats have been booked');
        processSeat();
    }else {
        alert("Oops, no seat Selected");
    }
})

function processSeat() {
    takenSeat = [];
    seatNotOccupied.forEach(seat => {
        if(seat.classList.contains('selected')){
            seat.classList.remove('selected');
            seat.classList.add('seat');
            seat.classList.add('occupied');
        }
    });
    updatePrice(0,0);
    updateSeats();
}