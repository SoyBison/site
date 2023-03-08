let index = 0,
    messyness = 2,
    interval = 5000;

let translate_width = 0.1 * messyness;
let rotate_width = 10 * messyness;
let pfp_container = $("#pfp-container")
const rand = (min, max) =>
    (Math.random() * (max - min)) + min;

const letter_drift = function(letter) {
    if (document.getElementById("bio-section").matches(":hover")) {
        letter.style.setProperty("transform", "rotate(0) translate(0, 0)")
    } else {
        letter.style.setProperty("transform", `rotate(${rand(-rotate_width, rotate_width)}deg) translate(${rand(-translate_width, translate_width)}em, ${rand(-translate_width, translate_width)}em)`)
    }
}

$(document).ready(function() {
    for (const letter of document.getElementsByClassName("my-name")) {
        letter_drift(letter);
        setInterval(() => {
            letter_drift(letter)
            }, interval + rand(0, 2000))
    }

    $('section.bio').hover(function () {
        for(const letter of document.getElementsByClassName("my-name")) {
            letter.style.setProperty("transform", "rotate(0) translate(0, 0)")
            letter.style.setProperty("transition-duration", "200ms")
        }
    }, function () {
        for(const letter of document.getElementsByClassName("my-name")) {
            letter.style.setProperty("transition-duration", "10000ms");
            letter_drift(letter);
        }

    },
    );
});


