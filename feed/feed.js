import { getData } from "../mjs/getData.mjs";
import { isMediaValid } from "../mjs/helpers.mjs";

const mainApiUrl = "https://api.noroff.dev/api/v1";
const postsUrl = `${mainApiUrl}/social/posts`;
const requestParam = {
    _author: true,
    // offset: 100
};


const queryString = new URLSearchParams(requestParam).toString();

const token = localStorage.getItem("accessToken");
let feedPosts = undefined;
let isShowingTodaysPosts = false;

window.onload = fetchPostsFromApi();


// reset page to all posts
document.getElementById("homeBtn").addEventListener("click", () => {
    isShowingTodaysPosts = false;
    searchField.value = "";
    showPosts(feedPosts);
});

// search

const searchField = document.getElementById("searchInput");

searchField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const result = searchElement(feedPosts, searchField.value);
        // debugger;
        showPosts(result);
    }
});


function searchElement(postsArray, searchText) {
    return postsArray.filter((post) =>
        post.title.includes(searchText) || post.body.includes(searchText)
    );
}


// showing today's posts

const todaysPostsBtn = document.getElementById("todaysPosts");

todaysPostsBtn.addEventListener("click", function () {
    if (isShowingTodaysPosts === false) {
        const date = new Date();
        const dateToday = date.toLocaleDateString();
        const todaysPosts = feedPosts.filter((post) => {
            if (new Date(post.updated).toLocaleDateString() === dateToday) {
                return true;
            } else {
                return false;
            }
        });
        showPosts(todaysPosts);
        isShowingTodaysPosts = true;
    } else {
        showPosts(feedPosts);
        isShowingTodaysPosts = false;
    }
});


// showing posts
var containerHTMLCard = document.getElementById("singleCard");

async function fetchPostsFromApi() {
    feedPosts = await getData(`${postsUrl}?${queryString}`);
    showPosts(feedPosts);
}

function showPosts(posts) {
    //var posts = await getData(`${postsUrl}?${queryString}`);
    var setImg = "";
    containerHTMLCard.innerHTML = "";
    for (var i = 0; i < posts.length; i++) {
        let formattedDate = new Date(posts[i].updated).toLocaleDateString();
        let formattedTime = new Date(posts[i].updated).toLocaleTimeString();
        if (isMediaValid(posts[i].media)) {
            setImg = posts[i].media;
        } else {
            setImg = "../pics/jean-marc-vieregge-cDKqFb-NOZc-unsplash.jpg";
        }

        containerHTMLCard.innerHTML += `
        <div class="my-2 col col-lg-10">
            <div class="card shadow-sm"> 
                <img src="${setImg}" alt="Hanks of wool" class="bd-placeholder-img card-img-top" id="cardPicture">
                <h5 class="card-title" id="cardTitle">${posts[i].title}</h5>
                <div class="card-body">
                    <p class="card-text text-start" id="cardBody">${posts[i].body}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-secondary" id="btnShowAuthor">${posts[i].author.name}</button>
                            <button type="button" class="btn btn-sm btn-secondary" id="btnShowComments${posts[i].id}" data-postid="${posts[i].id}">Comments</button>
                            
                            <button type="button" class="btn btn-sm btn-secondary" id="btnShowReactions">Reactions</button>
                           
                        </div>
                        <small class="text-muted" id="cardUpdated">${formattedDate} ${formattedTime}</small>
                        
                    </div>
                </div>
                <div class="showComments" id="showComments${posts[i].id}" style="display:none;">${posts[i]._count.comments}</div>
                <div class="showReactions" style="display:none;">reactions go here</div>
            </div>
        </div>        
        `;
    }
    showComments();
}





// new post

const formPost = document.getElementById("formPost");

document.getElementById("postBtn").addEventListener("click", (event) => {
    event.preventDefault();

    const titlePost = formPost.elements[0];
    const messagePost = formPost.elements[1];
    const mediaPost = formPost.elements[2];

    const userTitlePost = titlePost.value;
    const userMessagePost = messagePost.value;
    const userMediaPost = mediaPost.value;

    const newPost = newPostValuesToObject(userTitlePost, userMessagePost, userMediaPost);
    newPostToApiFunksjon(postsUrl, newPost);
});

function newPostValuesToObject(title, message, media) {
    const postToApi = {
        "title": title,
        "body": message,
        "media": media
    };
    return postToApi;
}

async function newPostToApiFunksjon(url, post) {
    try {
        const token = localStorage.getItem("accessToken");
        const postData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(post),
        };
        const response = await fetch(url, postData);
        const json = await response.json();

        //return json;
    } catch (error) {
        console.log(error)
    }
}


// show comments

function showComments() {
    const commentBtns = document.querySelectorAll('[id^="btnShowComments"]');

    commentBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            document.getElementById(`showComments${btn.dataset.postid}`).style.display = "block";
        })
    })
}