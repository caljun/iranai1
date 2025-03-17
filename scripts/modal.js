document.addEventListener("DOMContentLoaded", function () {
    const modal = document.createElement("div");
    modal.id = "postModal";
    modal.style.display = "none";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>投稿を追加</h2>
            <input type="text" id="postName" placeholder="名前">
            <input type="file" id="postImage" accept="image/*">
            <button id="submitPost">投稿する</button>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-btn");
    const submitPostBtn = modal.querySelector("#submitPost");

    // **モーダルを開く関数（グローバル登録）**
    window.openModal = function () {
        modal.style.display = "block";
    };

    // **モーダルを閉じる**
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // **投稿ボタンを押したら投稿を追加**
    submitPostBtn.addEventListener("click", function () {
        const name = document.getElementById("postName").value;
        const imageInput = document.getElementById("postImage");

        if (name && imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (window.addPost) {
                    window.addPost(name, e.target.result);
                    modal.style.display = "none";
                } else {
                    alert("投稿処理に失敗しました。");
                }
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    });

    // **スマホ対応: タッチでモーダルを閉じる**
    window.addEventListener("touchstart", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
