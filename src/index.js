const submit = document.querySelector("#submit");
const reset = document.querySelector("#reset");

// Colleceting all the form Elements
const formRegNo= document.querySelector("#regNo");
const formFullName = document.querySelector("#fullName");
const formEmailID = document.querySelector("#emailID");
const formPhNo = document.querySelector("#phNo");

// Collecting Table element
const tbody = document.querySelector(".tbody");
const popUp = document.querySelector("#popUp");
const editRegNo = document.querySelector("#editRegNo");
const editFullName = document.querySelector("#editFullName");
const editEmailID = document.querySelector("#editEmailID");
const editPhNo = document.querySelector("#editPhNo");
const editSubmitBtn = document.querySelector("#editSubmit");
const closePopupBtn = document.querySelector("#editClose");
const wrapperTable = document.querySelector("#wrapperTable");

let editIndex=null;

// popup elements
const validationPopup = document.querySelector("#validationPopup");
const validationHeading = document.querySelector("#validationHeading");
const validationMessage = document.querySelector("#validationMessage");
const validationClose = document.querySelector("#validationClose");
const overlay = document.querySelector("#overlay");


// Vertical  Scrollbar 
const updateVerticalScroll = () => {
  const maxHeight = 500;

  if (wrapperTable.scrollHeight > maxHeight) {
    wrapperTable.style.maxHeight = maxHeight + "px";
    wrapperTable.style.overflowY = "auto";
  } else {
    wrapperTable.style.maxHeight = "none";
    wrapperTable.style.overflowY = "hidden";
  }
};


// Validation Functions
const isValidName = (name) => {
  return /^[A-Za-z ]{3,}$/.test(name.trim());
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.trim());
};

// Rendering error POPUP




// Validating the form
const validateForm = () => {

   let heading="Validation Error"
    // if Fullname is empty
  if (!formFullName.value.trim()) {
    showValidation(heading, "Full Name is required", formFullName);
    return false;
  }
  
  // Validating fullName
  if (!isValidName(formFullName.value)) {
    showValidation( heading,
      "Full Name must contain only letters and be at least 3 characters",
      formFullName
    );
    return false;
  }

  // If email id is empty
  if (!formEmailID.value.trim()) {
    showValidation(heading, "Email ID is required", formEmailID);
    return false;
  }

// Validating Email
  if (!isValidEmail(formEmailID.value)) {
    showValidation(heading, "Please enter a valid Email ID", formEmailID);
    return false;
  }

  // Phone number empty
  if (!formPhNo.value.trim()) {
    showValidation(heading, "Phone Number is required", formPhNo);
    return false;
  }

  // validating phone number
  if (!isValidPhone(formPhNo.value)) {
    showValidation( heading,
      "Phone Number must be a valid 10-digit Indian mobile number",
      formPhNo
    );
    return false;
  }

  return true;
};



//Display Error popUp
const showValidation = (heading,  message, focusEl) => {
validationHeading.textContent=heading
  validationMessage.textContent = message;
  validationPopup.classList.add("popUp-close");
    overlay.classList.add("active");

  validationClose.onclick = () => {
    validationPopup.classList.remove("popUp-close");
    overlay.classList.remove("active");
    if (focusEl) focusEl.focus();
  };
};

// reseting the form 
const resetForm=()=>{
    formFullName.value="";
    formEmailID.value="";
    formPhNo.value = "";
    formRegNo.value = peekRegNo();
}

// Generating Registration Number ans saving it in LS
const getNextRegNo = () => {
    let lastRegNo = Number(localStorage.getItem("lastRegNo")) || 202600;
    lastRegNo++;
    localStorage.setItem("lastRegNo", lastRegNo);
    return lastRegNo;
};
// To render it on the form
const peekRegNo = function(){
    let lastRegNo =Number( localStorage.getItem("lastRegNo")) || 202600;
    lastRegNo++
    return lastRegNo;
}


// setting items to LS for table 
const setItems = function(students){
    localStorage.setItem("studentData", JSON.stringify(students));
}


// Getting items from LS for table | returns students array
const getItems=function(){
    let studentData= JSON.parse( localStorage.getItem("studentData")) || [];
    console.log(studentData);
    return studentData;
}


//  Creating Dynamic Table
const createTBE= function(students){
    tbody.innerHTML="";
    students.forEach((obj, index)=>{
        const row = `
        <tr class="${index % 2 ? "bg-green-200" : ""}">
        <td class="p-2">${obj.regNo}</td>
        <td class="p-2">${obj.fullName}</td>
        <td class="p-2">${obj.emailID}</td>
        <td class="p-2">${obj.PhoneNumber}</td>
        <td class="p-2">
        <div class="flex items-center justify-center gap-2">
        <button class="btn-edit" data-index="${index}">
        <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="btn-delete" data-index="${index}">
        <i class="fa-regular fa-trash-can"></i>
        </button>
        </div>
        </td>
        </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    })
    
}
const addToTable =function(e) { 
    e.preventDefault();
    
    if (!validateForm()) return; // calling form validation
    
    const student = {
        regNo: getNextRegNo(),
        fullName: formFullName.value,
        emailID: formEmailID.value,
        PhoneNumber: formPhNo.value,
    };
    const students =getItems();
    students.push(student);
    setItems(students);
    createTBE(students);
    updateVerticalScroll();
    resetForm();
    formRegNo.value = peekRegNo();
}

// Listing the click from editbutton
tbody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  const deleteBtn = e.target.closest(".btn-delete");

  if (editBtn) handleEdit(editBtn.dataset.index);
  if (deleteBtn) handleDelete(deleteBtn.dataset.index);
});

// Loading The Values in the popUp form
const handleEdit = (index) => {
  editIndex = Number(index); // this is a global variable look at the top
  const students = getItems();
  const student = students[editIndex];

  editRegNo.value = student.regNo;
  editFullName.value = student.fullName;
  editEmailID.value = student.emailID;
  editPhNo.value = student.PhoneNumber;

  popUp.classList.add("popUp-close");
  overlay.classList.add("active");
};

//  EditPop Up validations 
const validateEditForm = () => {
    let heading = "Vaildation Error"
  if (!editFullName.value.trim()) {
    showValidation(heading, "Full Name is required", editFullName);
    return false;
  }

  if (!isValidName(editFullName.value)) {
    showValidation(heading, 
      "Full Name must contain only letters and be at least 3 characters",
      editFullName
    );
    return false;
  }

  if (!editEmailID.value.trim()) {
    showValidation(heading, "Email ID is required", editEmailID);
    return false;
  }

  if (!isValidEmail(editEmailID.value)) {
    showValidation(heading, "Please enter a valid Email ID", editEmailID);
    return false;
  }

  if (!editPhNo.value.trim()) {
    showValidation(heading, "Phone Number is required", editPhNo);
    return false;
  }

  if (!isValidPhone(editPhNo.value)) {
    showValidation(heading, 
      "Phone Number must be a valid 10-digit Indian mobile number",
      editPhNo
    );
    return false;
  }

  return true;
};




// Updating the Values
editSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

 if (!validateEditForm()) return; // form validation
  const students = getItems();

  students[editIndex] = {
    regNo: editRegNo.value, 
    fullName: editFullName.value.trim(),
    emailID: editEmailID.value.trim(),
    PhoneNumber: editPhNo.value.trim(),
  };

  setItems(students);
  createTBE(students);
  updateVerticalScroll();
  popUp.classList.remove("popUp-close");
  overlay.classList.remove("active");
});

// Closing popUp form
closePopupBtn.addEventListener("click",()=>{
      popUp.classList.remove("popUp-close");
  overlay.classList.remove("active");
})


// Deletion fucntion
const handleDelete = (index) => {
  showValidation("Confirmation", "Are you sure you want to delete this record?");

  validationClose.onclick = () => {
    const students = getItems();
    students.splice(index, 1);

    setItems(students);
    createTBE(students);
    updateVerticalScroll();
    validationPopup.classList.remove("popUp-close");
    overlay.classList.remove("active");
  };
};


submit.addEventListener("click", addToTable);
reset.addEventListener("click", resetForm);




const getStudents = () => JSON.parse(localStorage.getItem("studentData")) || [];
window.addEventListener("DOMContentLoaded", () => {
    createTBE(getStudents());
    formRegNo.value = peekRegNo(); 
});