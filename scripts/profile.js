document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const profileUrl = document.getElementById("profileUrl");
    const userUrl = document.getElementById("userUrl");
    const profileIcon = document.getElementById("profileIcon");
    const profileImageUpload = document.getElementById("profileImageUpload");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // **ユーザーURLを取得し表示**
    const storedUserUrl = localStorage.getItem("userUrl");
    if (storedUserUrl) {
        profileUrl.style.display = "block"; // URLを表示
        userUrl.textContent = storedUserUrl;
        userUrl.href = storedUserUrl;
        userUrl.target = "_blank";
    }

    // **ローカルストレージの画像をロード**
    const savedImage = localStorage.getItem("profileImage");
    if (profileIcon && savedImage) {
        profileIcon.src = savedImage;
    }

    // **クリックで画像アップロード**
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

    function renderPosts() {
        gallery.innerHTML = `<button id="addPostBtn" class="post-box">＋</button>`; // **「＋」ボタンを常に残す**

        // **投稿データを表示**
        posts.forEach((post, index) => {
            const postBox = document.createElement("div");
            postBox.classList.add("post-box");
            postBox.innerHTML = `
                <img src="${post.image}" alt="投稿画像">
                <p>${post.name}</p>
                <button class="want-btn">欲しい</button>
                <button class="delete-btn" data-index="${index}">削除</button>
            `;
            gallery.appendChild(postBox);
        });

        // **削除機能**
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                posts.splice(index, 1);
                localStorage.setItem("posts", JSON.stringify(posts));
                renderPosts();
            });
        });

        // **「＋」ボタンのイベントを確実に登録**
        setTimeout(() => {
            const addPostBtn = document.getElementById("addPostBtn");
            if (addPostBtn) {
                addPostBtn.addEventListener("click", function () {
                    if (window.openModal) {
                        window.openModal();
                    } else {
                        alert("モーダルを開く処理に失敗しました。");
                    }
                });
            }
        }, 100); // **非同期で確実にイベントが登録されるようにする**
    }

    window.addPost = function (name, image) {
        if (!name || !image) {
            alert("名前と画像を入力してください！");
            return;
        }
    
        // **最新の投稿データを取得**
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        const newPost = { name, image };
        posts.push(newPost);
    
        // **ローカルストレージを更新**
        localStorage.setItem("posts", JSON.stringify(posts));
    
        // **最新のデータを使って再描画**
        renderPosts();
    }
});
