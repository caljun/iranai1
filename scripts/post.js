// scripts/post.js

const index = new URLSearchParams(location.search).get("index");
const posts = JSON.parse(localStorage.getItem("posts")) || [];
const post = posts[index];

// 投稿表示
document.getElementById("detailImage").src = post.image;
document.getElementById("postCaption").textContent = post.name;

// いいねボタン（♡ ⇄ ♥）
const likeBtn = document.querySelector(".like-btn");
let liked = false;
likeBtn.addEventListener("click", () => {
  liked = !liked;
  likeBtn.textContent = liked ? "❤" : "🤍";
});

// コメント
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");
const submitComment = document.getElementById("submitComment");

const commentKey = `comments_${index}`;
let comments = JSON.parse(localStorage.getItem(commentKey)) || [];

function renderComments() {
  commentList.innerHTML = "";
  comments.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    commentList.appendChild(li);
  });
}
renderComments();

submitComment.addEventListener("click", () => {
  const comment = commentInput.value.trim();
  if (comment !== "") {
    comments.push(comment);
    localStorage.setItem(commentKey, JSON.stringify(comments));
    renderComments();
    commentInput.value = "";
  }
});

// ✅ 投稿削除機能
const deleteBtn = document.getElementById("deletePostBtn");

deleteBtn.addEventListener("click", () => {
  if (confirm("本当にこの投稿を削除しますか？")) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    window.location.href = "profile.html";
  }
});
