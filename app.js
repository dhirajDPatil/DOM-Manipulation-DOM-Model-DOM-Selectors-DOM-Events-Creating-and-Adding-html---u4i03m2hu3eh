import {fetchMovieAvailability,fetchMovieList} from "./api.js"

function loaderAdd(){
    let main = document.getElementsByTagName('main');
    let h2 = document.createElement('h2');
    h2.id = 'loader';
    h2.innerText = 'Loading ....';
    main[0].append(h2);
}
loaderAdd();
fetchMovieList()
    .then(value => appendMovies(value))
    .catch(()=> console.log("Errror...."));
// append movie list in the dom
let mList ={};

function appendMovies(movieList){
    mList = {...movieList};
    document.getElementById("loader").remove();
    // console.log(movieList);

    let mholder = document.createElement('div');
    mholder.className = 'movie-holder';
    mholder.id = 'movie';
    let main = document.getElementsByTagName('main');
    main[0].appendChild(mholder);

    let movieBlock = document.getElementById("movie");
    let x = "";   //href="/"
    movieList.forEach(e => {
        x += `<a class="movie-link" > 
                <div class="movie" data-id="${e.name}"> 
                    <div class="movie-img-wrapper" style="background-image: url(${e.imgUrl});"></div>
                    <h4 id="movieName">${e.name}</h4> 
                </div> 
            </a>`;
    });
    movieBlock.innerHTML = x;
}

document.getElementsByTagName("main")[0].addEventListener('click', myFunc); // on click of movie tile loader should appear
// checking for available seats for this movie
function myFunc(e){
    // console.log(e.target.nextElementSibling.innerText);
    console.log(e);
    let movie = e.target.nextElementSibling.innerText;
    let bookArea = document.getElementById('booker');
    // let loader = `<h2 id="loader2" class="s-none">Loading...</h2>`;
    let loader2 = document.createElement('h2');
    loader2.className='s-none';
    loader2.innerText = 'Loading....';
    bookArea.appendChild(loader2);
    bookArea.children[3].style.visibility = 'visible';
    fetchMovieAvailability(movie).then(value =>appendSeats(value)).catch(()=> console.log("server error..."));
}

function appendSeats(emptySeats){
    // console.log(emptySeats);
    let bookArea = document.getElementById('booker');
    // console.log(bookArea);
    bookArea.children[3].remove();
    bookArea.children[0].style.visibility = 'visible'; // 
    let parentE = document.getElementById('booker-grid-holder');
    let leftGridE ="";
    emptySeats.sort((x,y)=> {return (x-y)});
    let x1 = 1;
    let i=0;
    while(x1<=12){
        if(x1 == emptySeats[i] && x1<=12){
            leftGridE +=`<div class="gridCSS unavailable-seat" id="booking-grid-${x1}">${x1}</div>`;
            i++;
            x1++;
        }else{
            while(x1<emptySeats[i] && x1<=12){
                leftGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x1}">${x1}</div>`;
                x1++;
            }
        }
    }

    let rightGridE ="";
    let x2=13;
    while(x2<=24 && i<emptySeats.length){
        if(x2 == emptySeats[i] && i<emptySeats.length){
            rightGridE +=`<div class="gridCSS unavailable-seat" id="booking-grid-${x2}">${x2}</div>`;
            i++;
            x2++;
        }else{
            while(x2<emptySeats[i] && x2<=24){
                rightGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x2}">${x2}</div>`;
                x2++;
            }
        }
    }
    
    while(x2<=24){
        rightGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x2}">${x2}</div>`;
        x2++;
    }

    let lG = `<div class="leftGrid">${leftGridE}</div>`;
    let rG = `<div class="rightGrid">${rightGridE}</div>`;

    parentE.innerHTML = `<div class="booking-grid">${lG}</div>
                        <div class="booking-grid">${rG}</div>`;
    
}

let seatSelection = document.getElementById('booker-grid-holder');
seatSelection.addEventListener('click', addSelection);

function addSelection(event){
    // console.log(event);
    document.getElementById('book-ticket-btn').removeAttribute('class');
    if(event.target.classList[1] == 'available-seat'){
        if(event.target.classList[2]){
            event.target.classList.remove('selected-seat');
            let list = document.getElementsByClassName('selected-seat');
            // console.log(list);
            if(list.length == 0){
                document.getElementById('book-ticket-btn').setAttribute('class', 'v-none');
            }
        }else{
            event.target.classList.add('selected-seat');
        }
    }
}

let bookticketBtn = document.getElementById('book-ticket-btn');
bookticketBtn.addEventListener('click', conformationForm);

let seats = [];
function conformationForm(){
    let userSelectedSeats = document.getElementsByClassName('selected-seat');
    for(let i=0; i<userSelectedSeats.length; i++){
        seats.push(userSelectedSeats[i].innerText);
    }
    let formAppend = `<div id="confirm-purchase">
                        <h3>Confirm your booking for seat numbers:${seats.join(",")}</h3>
                        <form id="customer-detail-form">
                        <label for="email">Email</label>
                        <input type="email" required><br>
                        <label for="phone">Phone number</label>
                        <input type="tel" name="phone" required><br>
                        <button type="submit">Purchase</button>
                        </form>
                    </div>`;
    document.getElementById("booker").innerHTML = formAppend; // form appended
}

document.getElementById('booker').addEventListener('click',confirmPurchase);

function confirmPurchase(event){
    event.preventDefault();
    // console.log(event.target.type == 'submit');
    let bookingDetails;
    if(event.target.type == 'submit'){
        bookingDetails = `<div id="Success">
                                <span>Booking details</span><br>
                                <span>Seats:${seats.join(",")}</span><br>
                                <span>Phone number:${event.target.form[1].value}</span><br>
                                <span>Email:${event.target.form[0].value}</span>
                            </div>`;
        document.getElementById("booker").innerHTML = bookingDetails;
    }
    
}