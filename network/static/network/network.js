document.addEventListener("DOMContentLoaded", () => {
    fetch("/network/db.sqlite3")
    .then (response => response.json())
    .then (posts => {
        console.log(posts);
    })
})