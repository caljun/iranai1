document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const profileUrl = document.getElementById("profileUrl");
    const userUrl = document.getElementById("userUrl");
    const profileIcon = document.getElementById("profileIcon");
    const profileImageUpload = document.getElementById("profileImageUpload");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // **アイコン画像のロード**
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        profileIcon.src = savedImage;
    }

    // **アイコン画像のアップロード処理**
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

        // **投稿が1つ以上ならURLを表示**
        if (posts.length > 0) {
            profileUrl.style.display = "block";
            userUrl.textContent = `iranai.com/${localStorage.getItem("username")}`;
            userUrl.href = `https://iranai.com/${localStorage.getItem("username")}`;
            userUrl.target = "_blank";
        }

        // **「+」ボタンを再設定**
        document.getElementById("addPostBtn").addEventListener("click", function () {
            openModal();
        });
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

    // **`window` に関数を登録**
    window.addPost = addPost;

    renderPosts();
});
