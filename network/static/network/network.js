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
    };        
})

/* for sending csrf token */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) return parts.pop().split(";").shift();

}

function editButton(id) {
    if (document.querySelector("#text-edit") == null) {
        document.querySelector(`#post-content-${id}`).innerHTML = 
        `<form>
            <textarea id='text-edit' autofocus></textarea>`; 
        document.querySelector(`#btn-edit-${id}`).innerHTML = "Save";
    }
    else {
        const newText = document.querySelector("#text-edit").value;
        fetch(`/all_post/${id}`, {
            method: "POST",
            headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
            body: JSON.stringify({
                "content": newText
            })
        })
        .then(response => response.json())
        .then(result => {
            document.querySelector(`#post-content-${id}`).innerHTML = 
            `<p id="post-content">${result["content"]}</p>`;
            document.querySelector(`#btn-edit-${id}`).innerHTML = "Saved!";
            setTimeout(()=> {
                document.querySelector(`#btn-edit-${id}`).innerHTML = "Edit";
            }, 2000)
        })
    }  
}

function likeButton(id) {
    fetch(`likes/${Number(id)}`)
    .then(response => response.json())
    .then(like => {
        let likeCounter = document.querySelector(`#num-likes-${Number(id)}`);
        if (like.liked == true) {
            likeCounter.innerHTML = Number(likeCounter.innerHTML) + 1;
        } else {
            likeCounter.innerHTML = Number(likeCounter.innerHTML) - 1
            if (Number(likeCounter.innerHTML) < 0) {
                likeCounter.innerHTML = 0;
            }
        }
    })
}

function createPost(post, edit) {
    let html = 
    `<div id="post-container" id=post-id-${post.pk}>
        <div id="post-info">
            <a data-id=${post.fields["user"]} href="/profile/${post.fields['username']}">${post.fields["username"]}</a>
            <p>${post.fields["date"]}</p>
        </div> 
        <div id=post-content-${post.pk}>
            <p id="post-content">${post.fields["content"]}</p>
        </div>
        <div class="d-flex justify-content-between mt-2">
            <div class="d-flex">                
                <button type="button" id="btn-like-${post.pk}" class="btn-like d-flex" onclick="likeButton(${post.pk})">
                    <p id="num-likes-${post.pk}" style="margin-right:5px;">${post.fields["likes"].length}</p> 
                    <label for="num-likes">Likes</label>
                </button>
            </div>`;
    if (edit == true){
        html += `<button type="button" class="button-edit btn btn-primary" onclick="editButton(${post.pk})" 
        data-postId=${post.pk} id="btn-edit-${post.pk}">Edit</button></div></div>`;
    }
    else {
        html += `</div></div>`;
    }
    return html;
}
