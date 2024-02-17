document.addEventListener("DOMContentLoaded", () => {
    let postContainer = document.querySelector("#all-post-container");
    let logged_user;
    fetch(`/current_user`)
    .then(response => response.json())
    .then(user => {
        logged_user = user.user
    })

    if (postContainer != "undefined") {
        id = document.querySelector("#all-post-container").dataset.id;
        follow = document.querySelector("#all-post-container").dataset.follow;
        if (follow == "true") {
            id = "following";
        } 
        fetch(`/all_post/${id}`)
        .then(response => response.json())
        .then(posts => {
            let container = document.querySelector("#all-post-container");
            if (posts.length == 0) {
                container.innerHTML = "No posts";
            }
            for (let i = 0; i < posts.length; i++) {
                if (Number(posts[i].fields["user"]) == Number(logged_user)){
                    container.innerHTML += createPost(posts[i], true);
                }
                else {
                    container.innerHTML += createPost(posts[i], false);
                }
            };
        })
    }
})

function createPost(post, edit) {
    let html = 
    `<div id="post-container">
        <div id="post-info">
            <a data-id=${post.fields["user"]} href="/profile/${post.fields['username']}">${post.fields["username"]}</a>
            <p>${post.fields["date"]}</p>
        </div> 
        <p id="post-content">${post.fields["content"]}</p>
        <div class="d-flex justify-content-between">
            <div class="d-flex">
                <p id="num-likes" style="margin-right:5px;">${post.fields["likes"]}</p> 
                <label for="num-likes">Likes</label>
            </div>`;
    if (edit == true){
        html += `<button id='button edit' data-postId=${post.pk}>Edit</button></div></div>`;
        console.log(html)
    }
    else {
        html += `</div></div>`;
    }
       

    return html;
}