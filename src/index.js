const BASE_URL = "http://localhost:3000";
const PUPS_URL = `${BASE_URL}/pups`;


document.addEventListener("DOMContentLoaded", function () {
  const dogBar = document.querySelector("#dog-bar");
  const goodFilter = document.querySelector("#good-dog-filter");
  const summaryContainer = document.querySelector("#dog-summary-container");
  const dogInfo = document.querySelector("#dog-info");
  let pupList = {}; //object
  let selectedPup;  //semi global variable that keeps track of selected puppy

  const fetchDogs = function () {
    fetch(PUPS_URL)
    .then(res => res.json())
    .then(json => populatePups(json));
  };

  function populatePups(pups) {
    console.log(pups);
    dogBar.innerHTML = "";
    for (let pup of pups) {
      pupList[pup.id] = pup;
      //display their name
      dogBar.innerHTML += `<span class="pup-selector" data-pup-id="${pup.id}">${pup.name}</span>`;
    }
  }


  dogBar.addEventListener("click", function (event) {
    if (event.target.className === "pup-selector") {
      console.log("inhere!!");
      showPup(event.target.dataset.pupId);
    }
  });


  function showPup(pupID) {
    dogInfo.innerHTML = ""; //clears current content
    //grabs selected puppy
    selectedPup = pupList[pupID];
    //shows new card
    dogInfo.innerHTML += `
    <div data-pup-id="${pupID}">
    <img src=${selectedPup.image}>
    <h2>${selectedPup.name}</h2>
    <button id="good-bad">${selectedPup.isGoodDog === true ? "Good Dog!" : "Bad Dog!"}</button>
    </div>
    `;
  }
  //listens for good/bad dog button click
  dogInfo.addEventListener("click", function () {
    if (event.target.id === "good-bad") {
      //locally change dog status
      selectedPup.isGoodDog = !selectedPup.isGoodDog;
      //patch request to update good status
      fetch(PUPS_URL+`/${selectedPup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type" : "application/json",
          "Accept" : "application/json"
        },
        body: JSON.stringify({
          isGoodDog: selectedPup.isGoodDog
        })
      })
      .then(res => res.json())
      .then(json => {
        console.log("Updated Pup!", json)
        showPup(selectedPup.id)
        populatePups(Object.values(pupList).filter(pup => pup.isGoodDog))
      });
    }
  })

  goodFilter.addEventListener("click", function (event) {
    if (event.target.dataset.status === "on") {
      goodFilter.dataset.status = "off";
      goodFilter.innerText = "Filter good dogs: OFF";
      populatePups(Object.values(pupList));
    } else {
      goodFilter.dataset.status = "on";
      goodFilter.innerText = "Filter good dogs: ON";
      populatePups(Object.values(pupList).filter(pup => pup.isGoodDog));
    }
  })

  fetchDogs();

});
