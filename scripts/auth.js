document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const username = email.split("@")[0]; // 仮のユーザー名（メールの@前部分）
        
        if (email && password) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            localStorage.setItem("username", username);

            // ユーザーごとのURLを生成
            const userUrl = `https://iranai.com/${username}`;
            localStorage.setItem("userUrl", userUrl);

            // URLページに遷移する
            window.location.href = `profile.html?user=${username}`;
        }
    });
});
