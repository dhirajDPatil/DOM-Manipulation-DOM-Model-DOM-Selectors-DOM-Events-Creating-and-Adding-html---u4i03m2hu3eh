import {fetchMovieAvailability,fetchMovieList} from "./api.js"
const mainElement = document.getElementById('main');
let bookerGridHolder = document.getElementById('booker-grid-holder');
let bookTicketBtn = document.getElementById('book-ticket-btn');
let booker = document.getElementById('booker');

async function renderMovies() {
     mainElement.innerHTML = `<div id='loader'></div>`;
     let movies = await fetchMovieList();
     let movieHolder = document.createElement('div');
     movieHolder.setAttribute('class', 'movie-holder');
     movies.forEach(movie => {
          createSeparateMovieTabs(movie, movieHolder);
     });
     mainElement.innerHTML = '';
     mainElement.appendChild(movieHolder);
     setEventToLinks();
}
renderMovies();

function createSeparateMovieTabs(data, wrapper) {
     let a = document.createElement('a');
     a.setAttribute('data-movie-name', `${data.name}`);
     a.classList.add('movie-link');
     a.href = `#${data.name}`;
     a.innerHTML = `<div class="movie" data-id=${data.name}>
                    <div class="movie-img-wrapper" style="background-image:url(${data.imgUrl})"></div>
                    <h4>${data.name}</h4>
               </div>`;
     wrapper.appendChild(a);
}

function setEventToLinks() {
     let movieLinks = document.querySelectorAll('.movie-link');
     movieLinks.forEach(movieLink => {
          movieLink.addEventListener('click', (e) => {
               renderSeatsGrid(movieLink.getAttribute('data-movie-name'));
          })
     })
}

async function renderSeatsGrid(movieName) {
     bookerGridHolder.innerHTML = `<div id='loader'></div>`;
     bookTicketBtn.classList.add('v-none');
     let data = await fetchMovieAvailability(movieName);
     renderSeats(data);
     setEventsToSeats();
}

function renderSeats(data) {
     if(booker.firstElementChild.tagName !== "H3"){
          seatsSelected = [];
          booker.innerHTML = `<h3 class="v-none">Seat Selector</h3>
                              <div id="booker-grid-holder"></div>
                              <button id="book-ticket-btn" class="v-none">Book my seats</button>`;
     }
     bookerGridHolder = document.getElementById('booker-grid-holder');
     bookTicketBtn = document.getElementById('book-ticket-btn');
     bookerGridHolder.innerHTML = '';
     booker.firstElementChild.classList.remove('v-none');
     createSeatsGrid(data)
}
function createSeatsGrid(data){
     let bookingGrid1 = document.createElement("div");
     let bookingGrid2 = document.createElement("div");
     bookingGrid2.classList.add("booking-grid");
     bookingGrid1.classList.add("booking-grid");
     for (let i = 1; i < 25; i++) {
       let seat = document.createElement("div");
       seat.innerHTML = i;
       seat.setAttribute("id", `booking-grid-${i}`);
       if (data.includes(i)) seat.classList.add("seat", "unavailable-seat");
       else seat.classList.add("seat", "available-seat");
       if (i > 12) bookingGrid2.appendChild(seat);
       else bookingGrid1.appendChild(seat);
     }
     bookerGridHolder.appendChild(bookingGrid1);
     bookerGridHolder.appendChild(bookingGrid2);
     setTicketBooking();
}

let seatsSelected = [];
function setEventsToSeats() {
     let AvaliableSeats = document.querySelectorAll('.available-seat');
     AvaliableSeats.forEach(seat => {
          seat.addEventListener('click', _ => {
               saveSelectedSeat(seat);
          })
     })
}

function saveSelectedSeat(seat) {
     if (!seat.classList.contains("select-seat")) {
          seat.classList.add('select-seat');
          seatsSelected.push(seat.innerText);
          bookTicketBtn.classList.remove('v-none');
     } else {
          seat.classList.remove('select-seat');
          seatsSelected = seatsSelected.filter(item => seat.innerText !== item);
          if (seatsSelected.length == 0){
               bookTicketBtn.classList.add('v-none');
          }
     }
}
function setTicketBooking(){
     bookTicketBtn.addEventListener('click', () => {
          if (seatsSelected.length > 0) {
               booker.innerHTML = '';
               confirmTicket();
          }
     })
}

function confirmTicket(){
     let confirmTicketElement = document.createElement('div');
     confirmTicketElement.setAttribute('id', 'confirm-purchase');
     let h3 = document.createElement('h3');
     h3.innerText = `Confirm your booking for seat numbers:${seatsSelected.join(",")}`;
     confirmTicketElement.appendChild(h3);
     confirmTicketElement.appendChild(createForm());
     booker.appendChild(confirmTicketElement);
     success();
}

function createForm(){
     let form = document.createElement("form");
     let formElements = `<input type="email" id="email" placeholder="email" required><br><br>
                         <input type="tel" id="phone" placeholder="phone" required><br><br>
                         <button id="submitBtn" type="submit">Purchase</button>`;
     form.setAttribute("method", "post");
     form.setAttribute("id", "customer-detail-form");
     form.innerHTML = formElements;
     return form;
}
function success(){
     let submitBtn = document.getElementById('submitBtn');
     submitBtn.addEventListener('click',(e) => {
         let form =  document.getElementById('customer-detail-form');
         if(form.checkValidity()){
              e.preventDefault();
              let email = document.getElementById('email').value;
              let phone = document.getElementById('phone').value;
              renderSuccessMessage(email, phone);
         }
     })
}

function renderSuccessMessage(email, phone){
     booker.innerHTML = '';
     createSuccessMessage(email, phone);
}

function createSuccessMessage(email, phone){
     let successElement = document.createElement("div");
     successElement.setAttribute("id", "success");
     successElement.innerHTML = `<h3>Booking details</h3>
                               <p>Seats: ${seatsSelected.join(", ")}</p>
                              <p>Email: ${email}</p>
                              <p>Phone number: ${phone}</p>`;
     booker.appendChild(successElement);
}


// import {fetchMovieAvailability,fetchMovieList} from "./api.js"

// function loaderAdd(){
//     let main = document.getElementsByTagName('main');
//     let h2 = document.createElement('h2');
//     h2.id = 'loader';
//     h2.innerText = 'Loading ....';
//     main[0].append(h2);
// }
// loaderAdd();
// fetchMovieList()
//     .then(value => appendMovies(value))
//     .catch(()=> console.log("Errror...."));
// // append movie list in the dom
// let mList ={};

// function appendMovies(movieList){
//     mList = {...movieList};
//     document.getElementById("loader").remove();
//     // console.log(movieList);

//     let mholder = document.createElement('div');
//     mholder.className = 'movie-holder';
//     mholder.id = 'movie';
//     let main = document.getElementsByTagName('main');
//     main[0].appendChild(mholder);

//     let movieBlock = document.getElementById("movie");
//     let x = "";   //href="/"
//     movieList.forEach(e => {
//         x += `<a class="movie-link" > 
//                 <div class="movie" data-id="${e.name}"> 
//                     <div class="movie-img-wrapper" style="background-image: url(${e.imgUrl});"></div>
//                     <h4 id="movieName">${e.name}</h4> 
//                 </div> 
//             </a>`;
//     });
//     movieBlock.innerHTML = x;
// }

// document.getElementsByTagName("main")[0].addEventListener('click', myFunc); // on click of movie tile loader should appear
// // checking for available seats for this movie
// function myFunc(e){
//     // console.log(e.target.nextElementSibling.innerText);
//     console.log(e);
//     let movie = e.target.nextElementSibling.innerText;
//     let bookArea = document.getElementById('booker');
//     // let loader = `<h2 id="loader2" class="s-none">Loading...</h2>`;
//     let loader2 = document.createElement('h2');
//     loader2.className='s-none';
//     loader2.innerText = 'Loading....';
//     bookArea.appendChild(loader2);
//     bookArea.children[3].style.visibility = 'visible';
//     fetchMovieAvailability(movie).then(value =>appendSeats(value)).catch(()=> console.log("server error..."));
// }

// function appendSeats(emptySeats){
//     // console.log(emptySeats);
//     let bookArea = document.getElementById('booker');
//     // console.log(bookArea);
//     bookArea.children[3].remove();
//     bookArea.children[0].style.visibility = 'visible'; // 
//     let parentE = document.getElementById('booker-grid-holder');
//     let leftGridE ="";
//     emptySeats.sort((x,y)=> {return (x-y)});
//     let x1 = 1;
//     let i=0;
//     while(x1<=12){
//         if(x1 == emptySeats[i] && x1<=12){
//             leftGridE +=`<div class="gridCSS unavailable-seat" id="booking-grid-${x1}">${x1}</div>`;
//             i++;
//             x1++;
//         }else{
//             while(x1<emptySeats[i] && x1<=12){
//                 leftGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x1}">${x1}</div>`;
//                 x1++;
//             }
//         }
//     }

//     let rightGridE ="";
//     let x2=13;
//     while(x2<=24 && i<emptySeats.length){
//         if(x2 == emptySeats[i] && i<emptySeats.length){
//             rightGridE +=`<div class="gridCSS unavailable-seat" id="booking-grid-${x2}">${x2}</div>`;
//             i++;
//             x2++;
//         }else{
//             while(x2<emptySeats[i] && x2<=24){
//                 rightGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x2}">${x2}</div>`;
//                 x2++;
//             }
//         }
//     }
    
//     while(x2<=24){
//         rightGridE +=`<div class="gridCSS available-seat" id="booking-grid-${x2}">${x2}</div>`;
//         x2++;
//     }

//     let lG = `<div class="leftGrid">${leftGridE}</div>`;
//     let rG = `<div class="rightGrid">${rightGridE}</div>`;

//     parentE.innerHTML = `<div class="booking-grid">${lG}</div>
//                         <div class="booking-grid">${rG}</div>`;
    
// }

// let seatSelection = document.getElementById('booker-grid-holder');
// seatSelection.addEventListener('click', addSelection);

// function addSelection(event){
//     // console.log(event);
//     document.getElementById('book-ticket-btn').removeAttribute('class');
//     if(event.target.classList[1] == 'available-seat'){
//         if(event.target.classList[2]){
//             event.target.classList.remove('selected-seat');
//             let list = document.getElementsByClassName('selected-seat');
//             // console.log(list);
//             if(list.length == 0){
//                 document.getElementById('book-ticket-btn').setAttribute('class', 'v-none');
//             }
//         }else{
//             event.target.classList.add('selected-seat');
//         }
//     }
// }

// let bookticketBtn = document.getElementById('book-ticket-btn');
// bookticketBtn.addEventListener('click', conformationForm);

// let seats = [];
// function conformationForm(){
//     let userSelectedSeats = document.getElementsByClassName('selected-seat');
//     for(let i=0; i<userSelectedSeats.length; i++){
//         seats.push(userSelectedSeats[i].innerText);
//     }
//     let formAppend = `<div id="confirm-purchase">
//                         <h3>Confirm your booking for seat numbers:${seats.join(",")}</h3>
//                         <form id="customer-detail-form">
//                         <label for="email">Email</label>
//                         <input type="email" required><br>
//                         <label for="phone">Phone number</label>
//                         <input type="tel" name="phone" required><br>
//                         <button type="submit">Purchase</button>
//                         </form>
//                     </div>`;
//     document.getElementById("booker").innerHTML = formAppend; // form appended
// }

// document.getElementById('booker').addEventListener('click',confirmPurchase);

// function confirmPurchase(event){
//     event.preventDefault();
//     // console.log(event.target.type == 'submit');
//     let bookingDetails;
//     if(event.target.type == 'submit'){
//         bookingDetails = `<div id="Success">
//                                 <span>Booking details</span><br>
//                                 <span>Seats:${seats.join(",")}</span><br>
//                                 <span>Phone number:${event.target.form[1].value}</span><br>
//                                 <span>Email:${event.target.form[0].value}</span>
//                             </div>`;
//         document.getElementById("booker").innerHTML = bookingDetails;
//     }
    
// }