const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
    const element = document.createElement("textarea");

element.classList.add("note");
element.value = content;
element.placeholder = "Empty Sticky Note";

element.addEventListener("change", () => {
    updateNote(id, element.value);
});

element.addEventListener("dblclick", () => {
    const doDelete = confirm("Are you sure you wish to delete this sticky note?");
    if (doDelete) {
        deleteNote(id, element);
    }
});

return element;
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton);

    notes.push(noteObject);
    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id == id)[0];

    targetNote.content = newContent;
    saveNotes(notes);
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id != id);

    saveNotes(notes);
    notesContainer.removeChild(element);
}
function createNoteElement(id, content) {
    const container = document.createElement("div"); // A container to hold the textarea and buttons
    container.classList.add("note-container");

    const element = document.createElement("textarea");
    element.classList.add("note");
    element.value = content;
    element.placeholder = "Empty Sticky Note";

    element.addEventListener("change", () => {
        updateNote(id, element.value);
    });

    const colorButton = document.createElement("button");
    colorButton.innerText = "Change Color";
    colorButton.classList.add("note-button");
    colorButton.addEventListener("click", () => {
        element.style.backgroundColor = getRandomColor();
    });

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save to Disk";
    saveButton.classList.add("note-button");
    saveButton.addEventListener("click", () => {
        saveNoteToDisk(id, element.value);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("note-button");
    deleteButton.addEventListener("click", () => {
        const doDelete = confirm("Are you sure you wish to delete this sticky note?");
        if (doDelete) {
            deleteNote(id, container);
        }
    });

    container.appendChild(element);
    container.appendChild(colorButton);
    container.appendChild(saveButton);
    container.appendChild(deleteButton);

    return container;
}

function getRandomColor() {
    const colors = ["#FFDDC1", "#C1FFD7", "#D1C1FF", "#FFC1C1", "#FFFFC1"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function saveNoteToDisk(id, content) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = `note-${id}.txt`;
    a.click();
}
document.getElementById("delete-all").addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete all notes?");
    if (confirmDelete) {
        localStorage.clear(); // Clear notes from localStorage
        
        // Select and remove all notes except the "Add New Note" button
        const notes = document.querySelectorAll(".note-container");
        notes.forEach(note => {
            notesContainer.removeChild(note);
        });
    }
});
