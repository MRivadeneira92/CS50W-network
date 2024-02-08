document.addEventListener("DOMContentLoaded", () => {
    fetch("all_post")
    .then (response => response.json())
    .then (posts => {
        let container = document.querySelector("#all-post-container");
        if (posts.length == 0) {
            container.innerHTML = "No posts";
        }
        for (let i = 0; i < posts.length; i++) {
            container.innerHTML += createPost(posts[i])
        };
    })

    document.querySelector("#btn-follow").addEventListener("click", function() {
        const followId = this.dataset.id;
        fetch(`user/~${followId}`)
        .this(response => response.json)
        .this(user => {

        })
    })
})

function createPost(post) {
    const html = 
    `<div id="post-container">
        <div id="post-info">
            <a data-id=${post.fields["user"]} href="/profile/${post.fields['username']}">${post.fields["username"]}</a>
            <p>${post.fields["date"]}</p>
        </div> 
        <p id="post-content">${post.fields["content"]}</p>
        <div class="d-flex">
            <p id="num-likes" style="margin-right:5px;">${post.fields["likes"]}</p> 
            <label for="num-likes">Likes</label>
        </div>
    </div>`;

    return html;
}