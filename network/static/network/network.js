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

        /* edit button */ 
        setTimeout(()=> {
            if (document.querySelector("#all-post-container").firstElementChild.id == "post-container") {

                /* set up edit buttons */
                document.querySelectorAll(".button-edit").forEach(function(button) {
                    button.onclick  = function() {
                        const id = Number(this.dataset.postid);
                        if (document.querySelector("#text-edit") == null) {
                            document.querySelector(`#post-content-${id}`).innerHTML = 
                            `<form>
                                <textarea id='text-edit' autofocus></textarea>`; 
                            document.querySelector(`#btn-edit-${id}`).innerHTML = "Save";
                        }
                        else {
                            const newText = document.querySelector("#text-edit").value;
                            document.querySelector(`#post-content-${id}`).innerHTML = 
                            `<p id="post-content">${newText}</p>`;
                            fetch(`/all_post/${id}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    "content": newText
                                })
                            })
                            .then(response => response.json())
                            .then(result => {
                                document.querySelector(`#btn-edit-${id}`).innerHTML = "Saved!";
                                setTimeout(()=> {
                                    document.querySelector(`#btn-edit-${id}`).innerHTML = "Edit";
                                })
                            })
                        }  
                    }
                });

                /* set up like buttons */ 
                document.querySelectorAll(".btn-like").forEach(function(button) {
                    button.onclick = function() {
                        const postId = this.dataset.id;
                        fetch(`likes/${postId}`)
                        .then(response => response.json())
                        .then(liked => {
                            console.log(liked)
                            setTimeout(() => {
                                let likeCounter = document.querySelector(`#num-likes-${Number(id)}`);
                                if (liked == true) {
                                    likeCounter.innerHTML = Number(likeCounter.innerHTML) + 1;
                                }
                                else {
                                    likeCounter.innerHTML = Number(likeCounter.innerHTML) - 1;
                                }
                            },"1000");
                        })
                    };
                });
            };
        },"1500");
        
    }
})

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
        <div class="d-flex justify-content-between">
            <div class="d-flex">
                <p id="num-likes-${post.pk}" style="margin-right:5px;">${post.fields["likes"].length}</p> 
                <button type="button" id="btn-like-${post.pk}" class="btn-like" data-id=${post.pk}>
                    <label for="num-likes">Likes</label>
                </button>
            </div>`;
    if (edit == true){
        html += `<button type='button' class='button-edit btn btn-primary' 
        data-postId=${post.pk} id="btn-edit-${post.pk}">Edit</button></div></div>`;
    }
    else {
        html += `</div></div>`;
    }
    return html;
}

function likePost(id) {
    
}