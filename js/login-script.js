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
 
window.loginForm = function(){
    document.getElementById("container-registerForm").style.display = "none";    
    document.getElementById("container-loginForm").style.display = "block";
    document.getElementById("container-updatePassword").style.display = "none";    
};
window.registerForm = function(){
    document.getElementById("container-registerForm").style.display = "block";    
    document.getElementById("container-loginForm").style.display = "none";
    document.getElementById("container-updatePassword").style.display = "none";    
};
window.updatePassword = function() {
    document.getElementById("container-registerForm").style.display = "none";    
    document.getElementById("container-loginForm").style.display = "none";
    document.getElementById("container-updatePassword").style.display = "block";    
};
window.goBack = function() {
    window.location.href = "../index.html";
};
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("loginPassword");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // İkon rengi/durumu değiştirmek için:
    this.classList.toggle("active");
});
document.getElementById("toggleOldPassword").addEventListener("click", function () {
    const passwordField = document.getElementById("oldPassword");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // İkon rengi/durumu değiştirmek için:
    this.classList.toggle("active");
});
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const userRef = ref(database, "users"); // 'users' düğümü altında veri saklanacak
    const authority ={
        admin: false,
        teacher: false,
        class: false,
        users: false,
    };
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
                    toggleForms();  

                })
                .catch((error) => {
                    console.error("Hata oluştu:", error);
                });
        })
        .catch((error) => {
            console.error("Hata oluştu:", error);
        });
});
/*
document.getElementById("updatePassword").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("oldPassword").value.trim();
    const newpassword = document.getElementById("newPassword").value.trim();
    const renewpassword = document.getElementById("reNewPassword").value.trim();

    const userRef = ref(database, "users");

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Tüm kullanıcıları al
                //const userID = Object.entries(users).forEach([key,users])
                const user = Object.values(users).find(
                    (u) => u.email.toLowerCase() === email.toLowerCase() && 
                    u.password === password 
                );
                const authority = ref(database,`users/athor`)
                console.error("kullanıcı yetkisi", authority);            
                if (user) {
                    if(newpassword.toLowerCase() === renewpassword.toLowerCase()){
                        update(user, {
                            email: email,
                            password:newpassword,
                            author: authority
                        } )
                    }else{
                        alert("Şifreler eşleşmiyor!");
                    };

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
*/
document.getElementById("updatePassword").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("oldPassword").value.trim();
    const newpassword = document.getElementById("newPassword").value.trim();
    const renewpassword = document.getElementById("reNewPassword").value.trim();

    const userRef = ref(database, "users");

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Tüm kullanıcıları al
                const userKey = Object.keys(users).find(
                    (key) =>
                        users[key].email.toLowerCase() === email.toLowerCase() &&
                        users[key].password === password
                );
                
                if (userKey) {
                    const user = users[userKey]; // Bulunan kullanıcı nesnesi
                    console.error("sa",user);
                    // Şifrelerin eşleşip eşleşmediğini kontrol et
                    if (newpassword === renewpassword) {
                        // Güncellenmiş kullanıcı verileri
                        const updatedUser = {
                            ...user, // Mevcut kullanıcı bilgilerini koru
                            password: newpassword, // Yeni şifreyi güncelle
                        };

                        // Firebase'de kullanıcıyı güncelle
                        const userUpdateRef = ref(database, `users/${userKey}`);
                        update(userUpdateRef, updatedUser)
                            .then(() => {
                                alert("Şifre başarıyla güncellendi!");
                            })
                            .catch((error) => {
                                console.error("Güncelleme sırasında hata oluştu:", error);
                            });
                    } else {
                        alert("Şifreler eşleşmiyor!");
                    }
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

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const userRef = ref(database, "users"); // Tüm kullanıcıların olduğu referans

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val(); // Firebase'den kullanıcı verilerini al

                // Kullanıcıyı ve ID'sini bul
                let userID = null; // Kullanıcı ID'sini saklamak için değişken
                const user = Object.entries(users).find(([key, user]) => {
                    if (
                        user.email.toLowerCase() === email.toLowerCase() &&
                        user.password === password &&
                        (user.author?.teacher === true ||
                            user.author?.admin === true ||
                            user.author?.class === true ||
                            user.author?.users === true)
                    ) {
                        userID = key; // Kullanıcı ID'sini sakla
                        return true; // Kullanıcıyı bul
                    }
                    return false; // Devam et
                });

                if (user) {
                    // Başarılı giriş sonrası yönlendirme ve bilgileri saklama
                    localStorage.setItem("authenticated", "true");
                    sessionStorage.setItem("userID", userID);
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
