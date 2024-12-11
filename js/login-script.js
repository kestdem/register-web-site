 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
 import { getDatabase, ref, push, set, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
 
 
 const firebaseConfig = {
     apiKey: "AIzaSyA7M2kt98Sjb1ubprbcnUgtryBzXnl3m0M",
     authDomain: "stdn-register.firebaseapp.com",
     databaseURL: "https://stdn-register-default-rtdb.firebaseio.com",
     projectId: "stdn-register",
     storageBucket: "stdn-register.firebasestorage.app",
     messagingSenderId: "67392988868",
     appId: "1:67392988868:web:62607a4210df6a17dd0b91"
     };
             // Initialize Firebase
const app = initializeApp(firebaseConfig);
       // Realtime Database başlatılıyor
const database = getDatabase(app);
 

window.toggleForms = function() {
    const registerContainer = document.querySelectorAll(".container")[0];
    const loginContainer = document.querySelectorAll(".container")[1];

    // Görünürlükleri değiştir
    if (registerContainer.style.display === "block") {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    } else {
        registerContainer.style.display = "block";
        loginContainer.style.display = "none";
    }
};


window.goBack = function() {
    window.location.href = "../index.html";
};


/*
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const userRef = ref(database, "users"); // 'users' düğümü altında veri saklanacak

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Mevcut kullanıcıları al
                const isDuplicate = Object.values(users).some(
                    (user) => user.email.toLowerCase() === email.toLowerCase()
                );

                if (isDuplicate) {
                    alert("Bu email zaten kayıtlı! Farklı bir email deneyin.");
                    return; // İşlem durdurulur
                }
            }

            // Yeni kullanıcı kaydı oluştur
            const newUserRef = push(userRef); // Benzersiz bir anahtar oluştur

            set(newUserRef, {
                email: email,
                password: password // Şifreyi düz metin olarak saklamak güvenli değildir!
            })
                .then(() => {
                    alert("Kullanıcı başarıyla kaydedildi!");
                    document.getElementById("registerForm").reset();
                })
                .catch((error) => {
                    console.error("Hata oluştu:", error);
                });
        })
        .catch((error) => {
            console.error("Hata oluştu:", error);
        });
});
*/

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const userRef = ref(database, "users"); // 'users' düğümü altında veri saklanacak
    const authority = false;

    // E-posta formatını doğrulamak için regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // E-posta formatı kontrolü
    if (!emailRegex.test(email)) {
        alert("Lütfen geçerli bir e-posta adresi girin.");
        return; // Geçersiz e-posta formatı durumunda işlem durdurulur
    }

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Mevcut kullanıcıları al
                const isDuplicate = Object.values(users).some(
                    (user) => user.email.toLowerCase() === email.toLowerCase()
                );

                if (isDuplicate) {
                    alert("Bu email zaten kayıtlı! Farklı bir email deneyin.");
                    return; // İşlem durdurulur
                }
            }

            // Yeni kullanıcı kaydı oluştur
            const newUserRef = push(userRef); // Benzersiz bir anahtar oluştur

            set(newUserRef, {
                email: email,
                password: password, // Şifreyi düz metin olarak saklamak güvenli değildir!
                author: authority

            })
                .then(() => {
                    alert("Kullanıcı başarıyla kaydedildi!");
                    document.getElementById("registerForm").reset();
                })
                .catch((error) => {
                    console.error("Hata oluştu:", error);
                });
        })
        .catch((error) => {
            console.error("Hata oluştu:", error);
        });
});


document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const authority = true;
    const userRef = ref(database, "users");

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Tüm kullanıcıları al
                const user = Object.values(users).find(
                    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.author == true
                );

                if (user) {
                    alert("Giriş başarılı!");
                    // Başarılı giriş sonrası yönlendirme
                    localStorage.setItem("authenticated", "true");
                    window.location.href = "dashboard.html"; // Yönetim paneline yönlendirme
                } else {
                    alert("Hatalı email veya şifre!");
                }
            } else {
                alert("Kayıtlı kullanıcı bulunamadı!");
            }
        })
        .catch((error) => {
            console.error("Giriş sırasında hata oluştu:", error);
        });
});
