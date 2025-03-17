document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const profileUrl = document.getElementById("profileUrl");
    const userUrl = document.getElementById("userUrl");
    const profileIcon = document.getElementById("profileIcon");
    const profileImageUpload = document.getElementById("profileImageUpload");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // **プロフィール画像のロード**
    if (profileIcon && localStorage.getItem("profileImage")) {
        profileIcon.src = localStorage.getItem("profileImage");
    }

    // **プロフィール画像のアップロード処理**
    if (profileIcon && profileImageUpload) {
        profileIcon.addEventListener("click", function () {
            profileImageUpload.click();
        });

        profileImageUpload.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileIcon.src = e.target.result;
                    localStorage.setItem("profileImage", e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // **投稿を表示する関数**
    function renderPosts() {
        gallery.innerHTML = `<button id="addPostBtn" class="post-box">＋</button>`;
        
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

        // **削除ボタンのイベントを追加**
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                posts.splice(index, 1);
                localStorage.setItem("posts", JSON.stringify(posts));
                renderPosts();
            });
        });

        // **「+」ボタンのイベントを確実に追加（スマホでも動作するように）**
        const addPostBtn = document.getElementById("addPostBtn");
        if (addPostBtn) {
            addPostBtn.addEventListener("click", openModal);
            addPostBtn.addEventListener("touchstart", openModal); // スマホ用のタッチイベント対応
        }
    }

    // **投稿を追加**
    function addPost(name, image) {
        if (!name || !image) {
            alert("名前と画像を入力してください！");
            return;
        }
        const newPost = { name, image };
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    }

    // **関数をグローバルで使えるようにする**
    window.addPost = addPost;

    // **初期表示**
    renderPosts();
});
