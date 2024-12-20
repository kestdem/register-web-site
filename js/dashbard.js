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

    document.getElementById("dashboard-page").classList.add("hidden");
    document.getElementById("student-edit-form").classList.add("hidden");
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
            <td> +90 ${student.motherPhone}</td>
            <td> +90 ${student.fatherPhone}</td>
            <td>${student.address}</td>
            <td>${student.registrationDate}</td>
            <td class="action-buttons">
                <button id="delete-btn" class="edite-btn" onclick="deleteStudent('${key}')">
                    <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                </button>   
                <button id="edite-btn" class="edite-btn" onclick="editStudent('${key}')">
                    <img src="../icons/edit-icon.svg" alt="edite" width="20" height="20">
                </button>     
                <button id="edite-btn" class="edite-btn" onclick="addClassStudent('${key}')">
                    <img src="../icons/add-class-icon.svg" alt="edite" width="20" height="20">
                </button>            
            </td>
          `;
          tableBody.appendChild(row);
          rowNumber++; // sayac arttırma    
          console.log("Students loaded:");
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
                loadStudent(); // Reload students if needed to reflect any changes
            })
            .catch(error => {
                console.error("Error creating class:", error);
                alert("An error occurred while creating the class.");
        });


    } else {
        alert("Class name is required.");
    }
};
/*
window.loadClass = function() {

    document.getElementById("dashboard-page").classList.add("hidden");
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
                            <th>${classData.className}</th>
                            <th>
                                <button id="delete-btn" class="edite-btn" onclick="deleteClass('${classKey}')">
                                    <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                                </button> 
                            </th>
                        </tr>
                    </thead>
                    <thead>                   
                        <tr> 
                            <th>Sil</th>                               
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
                        return get(studentRef).then(snapshot => {
                            return { key: studentKey, data: snapshot.val() }; // Anahtarı ve veriyi birlikte döndür
                        });
                    });                   
                    Promise.all(studentPromises)
                        .then(studentSnapshots => {
                            studentSnapshots.forEach(({ key: studentKey, data: student }) => {
                                if (student) { // Öğrenci verisini kontrol edin
                                    const row = document.createElement("tr");
                                    row.innerHTML = `                                        
                                        <td>
                                            <button id="delete-btn" class="edite-btn" onclick="deleteClassStudent('${classKey}', '${studentKey}')">
                                                <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                                            </button>

                                        </td>
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
                                    console.error("Öğrenci bulunamadı:");
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
*/
window.loadClass = function () {
    const hideElements = ["dashboard-page", "student-dashboard", "user-dashboard"];
    hideElements.forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById("class-dashboard").classList.remove("hidden");

    const classesRef = ref(database, "classes");
    onValue(classesRef, (snapshot) => {
        const classes = snapshot.val();
        const classContainer = document.getElementById("class-container");

        classContainer.innerHTML = ""; // Clear previous classes

        if (!classes) {
            classContainer.innerHTML = "<p>Henüz bir sınıf oluşturulmadı.</p>";
            return;
        }

        Object.entries(classes).forEach(([classKey, classData]) => {
            const classDiv = document.createElement("div");
            classDiv.classList.add("class-section");

            const table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>${classData.className}</th>
                        <th>
                            <button class="edite-btn" onclick="deleteClass('${classKey}')">
                                <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th>Sil</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Kayıt Tarihi</th>
                        ${Array.from({ length: 14 }, (_, i) => `<th>Hafta ${i + 1}</th>`).join('')}
                        ${Array.from({ length: 4 }, (_, i) => `<th>Aidat ${i + 1}</th>`).join('')}
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector("tbody");

            if (Array.isArray(classData.students) && classData.students.length > 0) {
                Promise.all(classData.students.map(studentKey => {
                    const studentRef = ref(database, `students/${studentKey}`);
                    return get(studentRef).then(snapshot => ({ key: studentKey, data: snapshot.val() }));
                })).then(studentSnapshots => {
                    studentSnapshots.forEach(({ key: studentKey, data: student }) => {
                        if (student) {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>
                                    <button class="edite-btn" onclick="deleteClassStudent('${classKey}', '${studentKey}')">
                                        <img src="../icons/delete-icon.svg" alt="Delete" width="20" height="20">
                                    </button>
                                </td>
                                <td>${student.firstName}</td>
                                <td>${student.lastName}</td>
                                <td>${student.registrationDate}</td>
                                ${Array.from({ length: 18 }, () => `<td><input type="checkbox" class="approve-checkbox"></td>`).join('')}
                            `;
                            tbody.appendChild(row);
                        }
                    });
                }).catch(console.error);
            } else {
                const emptyRow = document.createElement("tr");
                emptyRow.innerHTML = "<td colspan='22'>Bu sınıfta öğrenci yok.</td>";
                tbody.appendChild(emptyRow);
            }

            classDiv.appendChild(table);
            classContainer.appendChild(classDiv);
        });
    });
};

window.deleteClassStudent = function(classKey, studentKey) {
    if (confirm("Bu öğrenciyi sınıftan çıkarmak istediğinize emin misiniz?")) {
        // Öğrenciyi sınıf altındaki 'students' listesinden kaldırmak için
        const studentRef = ref(database, `classes/${classKey}/students`);
        
        onValue(studentRef, (snapshot) => {
            const students = snapshot.val();
            if (students) {
                // Öğrencinin ID'sini bulmak için dizinin index'ini alıyoruz
                const studentIndex = Object.keys(students).find(key => students[key] === studentKey);
                
                if (studentIndex) {
                    // Öğrenciyi sadece sınıfın öğrenci listesinde silmek
                    const studentToRemoveRef = ref(database, `classes/${classKey}/students/${studentIndex}`);
                    remove(studentToRemoveRef)
                        .then(() => {
                            alert("Öğrenci başarıyla sınıftan çıkarıldı!");
                            loadClass(); // Güncel sınıfı yükle
                        })
                        .catch((error) => {
                            console.error("Öğrenciyi sınıftan silerken hata oluştu:", error);
                        });
                }
            }
        });
    } else {
        console.log("Silme işlemi iptal edildi.");
    }
};
window.deleteClass = function(classID) {
    if (confirm("Bu sınıfı silmek istediğinize emin misiniz?")) {
      const classRef = ref(database, `classes/${classID}`);
      remove(classRef)
        .then(() => {
          alert("Sınıf başarıyla silindi!");
          loadClass(); // Listeyi güncelle
        })
        .catch((error) => {
          console.error("Silme sırasında hata oluştu:", error);
        });
    } else {
      console.log("Silme işlemi iptal edildi.");
    }
};
window.deleteUser = function(usersID) {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      const usersRef = ref(database, `users/${usersID}`);
      remove(usersRef)
        .then(() => {
          alert("Kullanıcı başarıyla silindi!");
          loadUser(); // Listeyi güncelle
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
window.loadUser = function(userKey){

    document.getElementById("dashboard-page").classList.add("hidden");
    document.getElementById("student-edit-form").classList.add("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("class-dashboard").classList.add("hidden");
    document.getElementById("user-dashboard").classList.remove("hidden");

    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
        const users = snapshot.val()
        const tableBody = document.getElementById("users-table-body");
        tableBody.innerHTML = "";
        if(users){
            Object.entries(users).forEach(([key, user]) =>{
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.author.admin}</td>
                <td>${user.author.users}</td>
                <td>${user.author.teacher}</td>
                <td>${user.author.class}</td>
                <td> 
                <button id="author-user-admin" class="edite-btn" onclick="authorUserAdmin('${key}')">
                    <img  alt="Admin" width="20" height="20">
                </button>               
                <button id="author-user-users" class="edite-btn" onclick="authorUserUsers('${key}')">
                    <img  alt="Users" width="20" height="20">
                </button> 
                <button id="author-user-teacher" class="edite-btn" onclick="authorUserTeachers('${key}')">
                    <img  alt="Teacher" width="20" height="20">
                </button> 
                <button id="author-user-class" class="edite-btn" onclick="authorUserClass('${key}')">
                    <img  alt="Class" width="20" height="20">
                </button>
                </td>
                <td>
                <button id="author-user-class" class="edite-btn" onclick="authorUserDown('${key}')">
                    <img src="../icons/down-icon.svg" alt=Down" width="20" height="20">
                </button>
                </td>
                <td>
                <button id="author-user-class" class="edite-btn" onclick="deleteUser('${key}')">
                    <img src="../icons/delete-icon.svg" alt="Down" width="20" height="20">
                </button>
                </td>

                `;
                tableBody.appendChild(row);
                console.log("User loaded:");
            })
        } else {
            console.log("No users found in the database.");
        }
    });
    
};
window.authorUserAdmin = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const authority ={
                    admin: true,
                    teacher: userData.author.teacher,
                    class: userData.author.class,
                    users: userData.author.users,
                };
                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: authority,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        console.log("Kullanıcı yetkilendirildi!");
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
window.authorUserUsers = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const authority ={
                    admin: userData.    author.admin,
                    teacher: userData.author.teacher,
                    class: userData.author.class,
                    users: true,
                };
                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: authority,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        console.log("Kullanıcı yetkilendirildi!");
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
window.authorUserTeachers = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const authority ={
                    admin: userData.author.admin,
                    teacher: true,
                    class: userData.author.class,
                    users: userData.author.users,
                };
                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: authority,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        console.log("Kullanıcı yetkilendirildi!");
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
window.authorUserClass = function(userKey) {
    const userRef = ref(database, `users/${userKey}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                const authority ={
                    admin: userData.author.admin,
                    teacher: userData.author.teacher,
                    class: true,
                    users: userData.author.users,
                };
                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author: authority,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        console.log("Kullanıcı yetkilendirildi!");
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
    const authority ={
        admin: false,
        teacher: false,
        class: false,
        users: false, 
    };
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Author değerini güncelle
                const updatedUser = {
                    ...userData,
                    author:authority,
                };

                // Firebase'de güncelleme yap
                set(userRef, updatedUser)
                    .then(() => {
                        console.log("Kullanıcı yetkisi düşürüldü!");
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
window.editStudent = function(studentId) {

    document.getElementById("dashboard-page").classList.add("hidden");
    document.getElementById("student-edit-form").classList.remove("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("class-dashboard").classList.add("hidden");
    document.getElementById("user-dashboard").classList.add("hidden");


    const studentRef = ref(database, `students/${studentId}`);
    onValue(studentRef, (snapshot) => {
      const student = snapshot.val();

      document.getElementById("student-name").value = student.firstName || "";
      document.getElementById("student-surname").value = student.lastName || "";
      document.getElementById("student-dob").value = student.dob || "";
      document.getElementById("mother-name").value = student.motherName || "";
      document.getElementById("father-name").value = student.fatherName || "";
      document.getElementById("mother-phone").value = student.motherPhone || "";
      document.getElementById("father-phone").value = student.fatherPhone || "";
      document.getElementById("student-address").value = student.address || "";
      document.getElementById("registration-date").value = student.registrationDate || "";
       
    });

    document.getElementById("registration-form").addEventListener("submit", function (e) {
        e.preventDefault();
    const updatedStudent = {
        firstName: document.getElementById("student-name").value,
        lastName: document.getElementById("student-surname").value,
        dob: document.getElementById("student-dob").value,
        motherName: document.getElementById("mother-name").value,
        fatherName: document.getElementById("father-name").value,
        motherPhone: document.getElementById("mother-phone").value,
        fatherPhone: document.getElementById("father-phone").value,
        address: document.getElementById("student-address").value,
        registrationDate: document.getElementById("registration-date").value,
    };


    update(studentRef, updatedStudent)
      .then(() => {
        alert("Öğrenci bilgileri başarıyla güncellendi!");
        loadStudent();
      })
      .catch((error) => {
        console.error("Bilgiler güncellenirken hata oluştu:", error);
        alert("Güncelleme sırasında bir hata oluştu.");
    });

    
})};

const userID = sessionStorage.getItem("userID"); // Kullanıcı ID'sini LocalStorage'dan al

if (userID) {
    // Kullanıcıyı Firebase'den al
    const userRef = ref(database, `users/${userID}`);
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val(); // Kullanıcı verilerini al
                if (userData.author) {
                    const author = userData.author; // Kullanıcının yetkilerini al
                    kontrolEtVeFonksiyonlariAyarla(author); // Yetkilere göre kontrol
                } else {
                    restrictAccess("Yetki bilgisi bulunamadı!"); // Yetki bilgisi yok
                }
            } else {
                restrictAccess("Kullanıcı bilgisi bulunamadı!"); // Kullanıcı yok
            }
        })
        .catch((error) => {
            console.error("Veri çekme hatası:", error);
            restrictAccess("Veri çekme sırasında hata oluştu!");
        });
} else {
    restrictAccess("Kullanıcı ID bulunamadı!");
}

// Fonksiyonlara erişimi düzenleyen fonksiyon
function kontrolEtVeFonksiyonlariAyarla(author) {
    // Admin kontrolü
    if (author.admin) {
        enableAllFunctions(); // Admin her şeye erişebilir
    } else {
        // Admin değilse diğer yetkilere göre ayar yap
        if (author.teacher) {
            enableTeacherFunctions(); // Öğretmen yetkilerine uygun erişim
        } 
        if (author.class) {
            enableClassFunctions(); // Sınıf yetkilerine uygun erişim
        }

        // Yetkilere göre kısıtlı fonksiyonlar
        disableRestrictedFunctions(author);
    }
}

// Kısıtlı fonksiyonları devre dışı bırak
function disableRestrictedFunctions(author) {
    // Eğer kullanıcı admin değilse
    if (!author.admin) {
        // Öğretmenin erişemeyeceği fonksiyonlar
        if (author.teacher) {
            document.getElementById("load-user").style.display = "none";
        }


    }
}

// Admin her şeye erişebilir
function enableAllFunctions() {
    console.log("Admin yetkileri etkinleştirildi.");
    // Tüm panelleri ve fonksiyonları aç
    document.querySelectorAll(".restricted").forEach((element) => {
        element.style.display = "block";
    });
}

// Öğretmen fonksiyonları
function enableTeacherFunctions() {
    console.log("Öğretmen yetkileri etkinleştirildi.");
    document.getElementById("load-student").style.display = "block";
}

// Sınıf fonksiyonları
function enableClassFunctions() {
    console.log("Sınıf yetkileri etkinleştirildi.");
    document.getElementById("load-class").style.display = "block";
}

// Yetkisiz erişim için kısıtlama
function restrictAccess(reason) {
    console.error("Erişim reddedildi:", reason);
    alert("Bu sayfaya erişim yetkiniz yok!");
    window.location.href = "../panels/login-panel.html";
}

// Öğrenci ve sınıf verilerini göstermek için referansları tanımlayın
const studentsRef = ref(database, "students"); // Öğrenci verilerinin olduğu yol
const classesRef = ref(database, "classes"); // Sınıf verilerinin olduğu yol

// Öğrenci sayısını çek ve göster
get(studentsRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const students = snapshot.val();
            const studentCount = Object.keys(students).length; // Öğrenci sayısını hesapla
            document.getElementById("student-count").innerText = studentCount;
        } else {
            console.error("Öğrenci verisi bulunamadı.");
        }
    })
    .catch((error) => {
        console.error("Öğrenci verilerini çekerken hata:", error);
    });

// Sınıf sayısını çek ve göster
get(classesRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const classes = snapshot.val();
            const classCount = Object.keys(classes).length; // Sınıf sayısını hesapla
            document.getElementById("class-count").innerText = classCount;
        } else {
            console.error("Sınıf verisi bulunamadı.");
        }
    })
    .catch((error) => {
        console.error("Sınıf verilerini çekerken hata:", error);
});

window.dashboardLoad = function(){

    document.getElementById("dashboard-page").classList.remove("hidden");
    document.getElementById("student-edit-form").classList.add("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("class-dashboard").classList.add("hidden");
    document.getElementById("user-dashboard").classList.add("hidden");
    
    window.location.href = "../panels/dashboard.html";
};
window.addClassStudent = function (studentID) {
    // Sınıfları çek
    fetchClasses().then((classes) => {
        const classSelector = document.getElementById("classSelector");
        classSelector.innerHTML = ""; // Önce temizle
        
        // Sınıfları dropdown'a ekle
        Object.entries(classes).forEach(([classID, classData]) => {
            const option = document.createElement("option");
            option.value = classID;
            option.textContent = classData.className; // Sınıf adı
            classSelector.appendChild(option);
        });

        // Modal'ı göster
        document.getElementById("classModal").classList.remove("hidden");

        // Kullanıcı onayladığında sınıfa ekle
        document.getElementById("confirmClassButton").onclick = function () {
            const selectedClassID = classSelector.value;
            addStudentToClass(selectedClassID, studentID);
            document.getElementById("classModal").classList.add("hidden");
        };
    });
};

function addStudentToClass(classID, studentID) {
    // Sınıf referansı
    const classRef = ref(database, `classes/${classID}/students`);

    // Sınıftaki mevcut öğrencileri al
    get(classRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const students = snapshot.val(); // Tüm öğrencileri al
                const studentCount = Object.keys(students).length; // Öğrenci sayısını al

                // Öğrenciyi sınıfa eklerken, sırasını tanımlamak yerine doğrudan ID'sini ekle
                const newStudentKey = studentCount; // Öğrencinin sırasını, mevcut öğrenci sayısına göre belirle
                const studentData = studentID; // Öğrencinin ID'sini veriye ekle

                // Öğrenciyi sınıfa ekle
                const newStudentRef = ref(database, `classes/${classID}/students/${newStudentKey}`);
                set(newStudentRef, studentData)
                    .then(() => {
                        alert("Öğrenci sınıfa başarıyla eklendi!");
                    })
                    .catch((error) => {
                        console.error("Sınıfa öğrenci eklenirken hata oluştu:", error);
                    });

            } else {
                // Eğer sınıfın altında öğrenci yoksa, yeni öğrenci ekle
                const studentData = studentID; // İlk öğrenci için ID'yi ekle
                set(ref(database, `classes/${classID}/students/0`), studentData)
                    .then(() => {
                        alert("Öğrenci sınıfa başarıyla eklendi!");
                    })
                    .catch((error) => {
                        console.error("Sınıfa öğrenci eklenirken hata oluştu:", error);
                    });
            }
        })
        .catch((error) => {
            console.error("Sınıftaki öğrenciler alınırken hata oluştu:", error);
        });
}



function fetchClasses() {
    const classRef = ref(database, "classes"); // Firebase'deki "classes" referansı
    return get(classRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Sınıflar varsa döndür
        } else {
            console.error("Sınıf bilgisi bulunamadı!");
            return {}; // Boş bir nesne döndür
        }
    });
}
