 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
 import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
 
 
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


window.goBack = function() {
    window.location.href = "../index.html";
};


/*
document.getElementById("registration-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini önler
  
    // Öğrenci bilgilerini al
    const student = {
        firstName: document.getElementById("student-name").value.trim(),
        lastName: document.getElementById("student-surname").value.trim(),
        dob: document.getElementById("student-dob").value,
        motherName: document.getElementById("mother-name").value,
        fatherName: document.getElementById("father-name").value,
        motherPhone: document.getElementById("mother-phone").value,
        fatherPhone: document.getElementById("father-phone").value,
        address: document.getElementById("student-address").value,
        registrationDate: document.getElementById("registration-date").value,
    };

    // Firebase'deki tüm öğrencileri kontrol et
    const studentsRef = ref(database, "students");
    get(studentsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const students = snapshot.val();
                const isDuplicate = Object.values(students).some(
                    (s) =>
                        s.firstName.toLowerCase() === student.firstName.toLowerCase() &&
                        s.lastName.toLowerCase() === student.lastName.toLowerCase()
                );

                if (isDuplicate) {
                    const confirmOverwrite = confirm(
                        "Bu isim ve soyisimle bir kayıt zaten mevcut. Devam etmek istediğinizden emin misiniz?"
                    );
                    if (!confirmOverwrite) {
                        return; // İşlem durdurulur
                    }
                }
            }

            // Yeni öğrenci kaydı ekle
            const studentRef = push(studentsRef); // "students" referansına yeni bir kayıt ekler
            set(studentRef, student)
                .then(() => {
                    alert("Student Registered Successfully!");
                    document.getElementById("registration-form").reset(); // Formu sıfırla
                })
                .catch((error) => {
                    console.error("Error adding student:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
        });
});
*/

function generateWeeklyCheck() {
    const weeklyCheck = {};

    // 20 hafta için 3 ders
    for (let week = 1; week <= 20; week++) {
        weeklyCheck[`week${week}`] = {
            lesson1: false,
            lesson2: false,
            lesson3: false,
        };
    }

    // 4 haftada bir aylık kontrol
    for (let month = 1; month <= 5; month++) {
        weeklyCheck[`month${month}Control`] = false;
    }

    return weeklyCheck;
}


document.getElementById("registration-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini önler
  
    // Öğrenci bilgilerini al
    const student = {
        firstName: document.getElementById("student-name").value.trim(),
        lastName: document.getElementById("student-surname").value.trim(),
        dob: document.getElementById("student-dob").value,
        motherName: document.getElementById("mother-name").value.trim(),
        fatherName: document.getElementById("father-name").value.trim(),
        motherPhone: document.getElementById("mother-phone").value.trim(),
        fatherPhone: document.getElementById("father-phone").value.trim(),
        address: document.getElementById("student-address").value.trim(),
        registrationDate: document.getElementById("registration-date").value,
        weeklyCheck: generateWeeklyCheck(),
    };

    // İsim ve soyisimde sayısal karakter olmamalı (harf ve boşluk dışında hiçbir karakter)
    const nameRegex = /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/;
    if (!nameRegex.test(student.firstName) || !nameRegex.test(student.lastName)) {
        alert("İsim ve soyisim sadece harflerden oluşmalıdır.");
        return; // Doğrulama başarısızsa işlem durdurulur
    }

    // Telefon numarasının Türkiye formatına uygun olması (10 haneli olmalı)
    const phoneRegex = /^\d{3} \d{3} \d{4}$/;
    if (!phoneRegex.test(student.motherPhone) || !phoneRegex.test(student.fatherPhone)) {
        alert("Telefon numarası (XXX) XXX XXXX  biçiminde olmalıdır! (alan kodu olmadan).");
        return; // Doğrulama başarısızsa işlem durdurulur
    }

    // Firebase'deki tüm öğrencileri kontrol et
    const studentsRef = ref(database, "students");
    get(studentsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const students = snapshot.val();
                const isDuplicate = Object.values(students).some(
                    (s) =>
                        s.firstName.toLowerCase() === student.firstName.toLowerCase() &&
                        s.lastName.toLowerCase() === student.lastName.toLowerCase()
                );

                if (isDuplicate) {
                    const confirmOverwrite = confirm(
                        "Bu isim ve soyisimle bir kayıt zaten mevcut. Devam etmek istediğinizden emin misiniz?"
                    );
                    if (!confirmOverwrite) {
                        return; // İşlem durdurulur
                    }
                }
            }

            // Yeni öğrenci kaydı ekle
            const studentRef = push(studentsRef); // "students" referansına yeni bir kayıt ekler
            set(studentRef, student)
                .then(() => {
                    alert("Öğrenci başarıyla kaydedildi!");
                    document.getElementById("registration-form").reset(); // Formu sıfırla
                })
                .catch((error) => {
                    console.error("Öğrenci eklenirken hata oluştu:", error);
                });
        })
        .catch((error) => {
            console.error("Öğrencileri getirirken hata oluştu:", error);
        });
});


