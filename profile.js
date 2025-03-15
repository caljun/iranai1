document.addEventListener("DOMContentLoaded", function () {
    const addPostBtn = document.getElementById("addPostBtn");
    const gallery = document.querySelector(".gallery");
    const profileUrl = document.getElementById("profileUrl");
    const userUrl = document.getElementById("userUrl");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // 投稿を表示する関数
    function renderPosts() {
        gallery.innerHTML = '<button id="addPostBtn" class="post-box">＋</button>';
        posts.forEach((post, index) => {
            const postBox = document.createElement("div");
            postBox.classList.add("post-box");
            postBox.innerHTML = `
                <img src="${post.image}" alt="投稿画像" style="width:100%; height:80px; object-fit:cover;">
                <p>${post.name}</p>
                <button class="want-btn">欲しい</button>
                <button class="delete-btn" data-index="${index}">削除</button>
            `;
            gallery.appendChild(postBox);
        });

        // 削除ボタンのイベントリスナーを追加
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                posts.splice(index, 1);
                localStorage.setItem("posts", JSON.stringify(posts));
                renderPosts();
            });
        });

        // 投稿が1つ以上ならURLを表示
        if (posts.length > 0) {
            profileUrl.style.display = "block";
            userUrl.textContent = `iranai.com/${localStorage.getItem("username")}`;
        }
    }

    // `＋` ボタンを押したらモーダルを開く
    document.addEventListener("click", function (event) {
        if (event.target && event.target.id === "addPostBtn") {
            openModal();
        }
    });

    // 投稿を追加
    function addPost(name, image) {
        const newPost = { name, image };
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    }

    // `window` に関数を登録（他のスクリプトから呼び出せるようにする）
    window.addPost = addPost;

    renderPosts();
});
