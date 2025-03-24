document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("postModal");

    // **モーダルが存在しない場合は自動生成**
    if (!modal) {
        modal = document.createElement("div");
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
    }

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

    // **投稿ボタンを押したら投稿を追加（スマホ対応）**
    submitPostBtn.addEventListener("click", function () {
        addPostHandler();
    });
    submitPostBtn.addEventListener("touchstart", function () {
        addPostHandler();
    });

    // **投稿処理を関数化**
    function addPostHandler() {
        const name = document.getElementById("postName").value;
        const imageInput = document.getElementById("postImage");

        if (name && imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (window.addPost) {
                    window.addPost(name, e.target.result);
                    modal.style.display = "none";

                    // 📌 **投稿後にフォームをリセット**
                    document.getElementById("postName").value = "";
                    const oldInput = document.getElementById("postImage");
                    const newInput = oldInput.cloneNode(true);
                    oldInput.parentNode.replaceChild(newInput, oldInput);

                    newInput.addEventListener("change", function (event) {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                if (window.addPost){
                                    const name = document.getElementById("postName").value;
                                    window.addPost(name, e.target.result);
                                    modal.style.display = "none";
                                    document.getElementById("postName"). value = "";
                                }
                            }
                        }
                    })
                        
                } else {
                    alert("投稿処理に失敗しました。");
                }
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    }

    // **スマホ対応: モーダルの外をタップしたら閉じる**
    window.addEventListener("touchstart", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
