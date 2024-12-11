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
 
window.loadStudent = function() {
    document.getElementById("student-dashboard").classList.remove("hidden");
    document.getElementById("class-dashboard").classList.add("hidden");
    document.getElementById("user-dashboard").classList.add("hidden");

    const studentRef = ref(database, "students");
    onValue(studentRef, (snapshot) => {
      const students = snapshot.val();
      const tableBody = document.getElementById("students-table-body");
      tableBody.innerHTML = ""; // Tabloyu temizle
  
      if (students) {

        let rowNumber = 1; // sayac
        // Verileri tabloya ekle
        Object.entries(students).forEach(([key, student]) => {
          const row = document.createElement("tr");
          row.setAttribute("data-key", key); // sınıf olusturmak icin eklendi
          row.innerHTML = `
            <td><input type="checkbox" class="approve-checkbox"></td>
            <td>${rowNumber}</td> <!-- Row number -->
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.dob}</td>
            <td>${student.motherName}</td>
            <td>${student.fatherName}</td>
            <td>${student.motherPhone}</td>
            <td>${student.fatherPhone}</td>
            <td>${student.address}</td>
            <td>${student.registrationDate}</td>
            <td class="action-buttons">
                <button id="delete-btn" class="edite-btn" onclick="deleteStudent('${key}')">
                    <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                </button>               
            </td>
          `;
          tableBody.appendChild(row);
          rowNumber++; // sayac arttırma    
          console.log("Students loaded:", students);
        });
      } else {
        console.log("No students found in the database.");
      }
    });
};

window.deleteStudent = function(studentId) {
    if (confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
      const studentRef = ref(database, `students/${studentId}`);
      remove(studentRef)
        .then(() => {
          alert("Öğrenci başarıyla silindi!");
          loadStudents(); // Listeyi güncelle
        })
        .catch((error) => {
          console.error("Silme sırasında hata oluştu:", error);
        });
    } else {
      console.log("Silme işlemi iptal edildi.");
    }
};

window.getSelectedStudents = function() {
    const checkboxes = document.querySelectorAll('.approve-checkbox:checked');
    const selectedStudentKeys = [];
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const studentKey = row.getAttribute('data-key'); // Assuming you set a 'data-key' attribute on each row
        selectedStudentKeys.push(studentKey);
    });
    return selectedStudentKeys;
};
// Tablodaki checkbox'ları dinle


window.createClass = function() {
    const selectedStudents = getSelectedStudents();

    if (selectedStudents.length === 0) {
        alert("Please select students to create a class.");
        return;
    }

    // Ask the admin for the class name
    const className = prompt("Enter a name for the new class:");

    if (className) {
        const newClassRef = ref(database, "classes"); // Firebase path where classes are stored

        // Create a new class entry in Firebase
        const newClassKey = push(newClassRef).key; // Generate a new unique class ID

        // Create an object with the selected students' keys
        const classData = {
            className: className,
            students: selectedStudents,
            createdAt: new Date().toISOString(), // Add the class creation time
        };

        // Save the new class to Firebase
        const updates = {};
        updates[`/classes/${newClassKey}`] = classData;

        // Update Firebase with the new class
        update(ref(database), updates)
            .then(() => {
                alert("Class created successfully!");
                loadStudents(); // Reload students if needed to reflect any changes
            })
            .catch(error => {
                console.error("Error creating class:", error);
                alert("An error occurred while creating the class.");
        });


    } else {
        alert("Class name is required.");
    }showAdminPanel
};


window.loginClass = function() {

    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("class-dashboard").classList.remove("hidden");
    document.getElementById("user-dashboard").classList.add("hidden");


    const classesRef = ref(database, "classes"); // Firebase'den sınıfları çek
    onValue(classesRef, (snapshot) => {
        const classes = snapshot.val();
        const classContainer = document.getElementById("class-container");
        const classDisplay = document.getElementById("class-dashboard");

        // Yönetim panelini gizle ve sınıfları göster

       // classDisplay.style.display="block";

        classContainer.innerHTML = ""; // Mevcut sınıf içeriklerini temizle

        if (classes) {
            Object.entries(classes).forEach(([classKey, classData]) => {
                // Sınıf için bir container oluştur
                const classDiv = document.createElement("div");
                classDiv.classList.add("class-section");

                const classTitle = document.createElement("h3");
                //classTitle.innerText = `Sınıf: ${classData.className}`;

                // Tablo oluştur
                const table = document.createElement("table");
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Sınıf: ${classData.className}</th>
                            <th>
                                <button id="delete-btn" class="edite-btn" onclick="deleteClass('${classKey}')">
                                    <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                                </button> 
                            </th>
                        </tr>
                    </thead>
                    <thead>                   
                        <tr>                                 
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Kayıt Tarihi</th>
                            <th>Hafta 1</th>
                            <th>Hafta 2</th>
                            <th>Hafta 3</th>
                            <th>Hafta 4</th>
                            <th>Aidat 1</th>
                            <th>Hafta 5</th>
                            <th>Hafta 6</th>
                            <th>Hafta 7</th>
                            <th>Hafta 8</th>
                            <th>Aidat 2</th>
                            <th>Hafta 9</th>
                            <th>Hafta 10</th>
                            <th>Hafta 11</th>
                            <th>Hafta 12</th>
                            <th>Aidat 3</th>
                            <th>Hafta 13</th>
                            <th>Hafta 14</th>
                             <th>Aidat 4</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tbody = table.querySelector("tbody");

                // **Öğrencilerin varlığını kontrol edin**
                if (classData.students && Array.isArray(classData.students) && classData.students.length > 0) {
                    const studentPromises = classData.students.map(studentKey => {
                        const studentRef = ref(database, `students/${studentKey}`);
                        return get(studentRef); // Öğrenci verilerini al
                    });

                    Promise.all(studentPromises)
                        .then(studentSnapshots => {
                            studentSnapshots.forEach(snapshot => {
                                if (snapshot.exists()) { // Öğrenci verisini kontrol edin
                                    const student = snapshot.val();
                                    const row = document.createElement("tr");
                                    row.innerHTML = `                                        
                                        <td>${student.firstName}</td>
                                        <td>${student.lastName}</td>
                                        <td>${student.registrationDate}</td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>
                                        <td><input type="checkbox" class="approve-checkbox"><input type="checkbox" class="approve-checkbox"></td>                                        
                                        <td><input type="checkbox" class="approve-checkbox"></td>
                                    `;
                                    tbody.appendChild(row);
                                } else {
                                    console.error("Öğrenci bulunamadı:", snapshot.key);
                                }
                            });
                        })
                        .catch(error => {
                            console.error("Promise içinde hata oluştu:", error);
                        });
                } else {
                    // Öğrenci yok mesajı ekleyin
                    const emptyRow = document.createElement("tr");
                    emptyRow.innerHTML = `
                        <td colspan="3">Bu sınıfta öğrenci yok.</td>
                    `;
                    tbody.appendChild(emptyRow);
                }

                classDiv.appendChild(classTitle);
                classDiv.appendChild(table);
                classContainer.appendChild(classDiv);
            });
        } else {
            classContainer.innerHTML = "<p>Henüz bir sınıf oluşturulmadı.</p>";
        }
    });
};

window.deleteClass = function(classID) {
    if (confirm("Bu sınıfı silmek istediğinize emin misiniz?")) {
      const classRef = ref(database, `classes/${classID}`);
      remove(classRef)
        .then(() => {
          alert("Sınıf başarıyla silindi!");
          loginClass(); // Listeyi güncelle
        })
        .catch((error) => {
          console.error("Silme sırasında hata oluştu:", error);
        });
    } else {
      console.log("Silme işlemi iptal edildi.");
    }
};

window.logout = function(){
    window.location.href = "../index.html";
};

window.loadUser = function(){

    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("class-dashboard").classList.add("hidden");
    document.getElementById("user-dashboard").classList.remove("hidden");

    const userRef = ref(database, "users"
    )
    onValue(userRef, (snapshot) => {
        const users = snapshot.val()
        const tableBody = document.getElementById("users-table-body");
        tableBody.innerHTML = "";
        if(users){
            Object.entries(users).forEach(([key, user]) =>{
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.author}</td>
                <td> 
                <button id="author-user" class="edite-btn" onclick="authorUserUp('${key}')">
                    <img src="../icons/up-icon.svg" alt="true" width="20" height="20">
                </button> 
                <button id="author-user" class="edite-btn" onclick="authorUserDown('${key}')">
                    <img src="../icons/down-icon.svg" alt="false" width="20" height="20">
                </button>
                
                </td>

                `;
                tableBody.appendChild(row);
                console.log("User loaded:", users);
            })
        } else {
            console.log("No users found in the database.");
        }
    });
    
}

window.authorUserUp = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: true,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        alert("Kullanıcı yetkilendirildi!");
                    })
                    .catch((error) => {
                        console.error("Kullanıcı güncellenirken hata oluştu:", error);
                    });
            } else {
                console.error("Kullanıcı bulunamadı:", userKey);
            }
        })
        .catch((error) => {
            console.error("Kullanıcıyı getirirken hata oluştu:", error);
        });
};

window.authorUserDown = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: false,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        alert("Kullanıcı yetkisi düşürüldü!");
                    })
                    .catch((error) => {
                        console.error("Kullanıcı güncellenirken hata oluştu:", error);
                    });
            } else {
                console.error("Kullanıcı bulunamadı:", userKey);
            }
        })
        .catch((error) => {
            console.error("Kullanıcıyı getirirken hata oluştu:", error);
        });
}




