/* =====================================================
   JEE MASTER TRACKER
   JAVASCRIPT
===================================================== */


/* =====================================================
   1. JEE CHAPTER DATA
===================================================== */

const subjects = {

   math: [

    "Sets, Relations & Functions",
    "Basic Math & Logarithms",
    "Quadratic Equations",
    "Sequence & Series",
    "Binomial Theorem",
    "Permutation & Combination",
    "Complex Numbers",
    "Trigonometry & Equations",
    "Straight Lines",
    "Conic Sections (Circle, Parabola, Ellipse, Hyperbola)",
    "Graphs & Transformations",
    "Inverse Trig Functions (ITF)",
    "Matrices & Determinants",
    "Probability",
    "Statistics",
    "LCD (Limits, Continuity & Differentiability)",
    "Differentiation",
    "AOD (Application of Derivatives)",
    "Integration (Indefinite & Definite)",
    "Area Under Curves",
    "Differential Equations",
    "Vector Algebra",
    "3D Geometry"

],

physics: [

    "Maths Tools",
    "1D Kinematics",
    "2D Kinematics",
    "Newton's Laws of Motion (NLM)",
    "Circular Motion",
    "Work, Energy & Power (WEP)",
    "Centre of Mass & Collision",
    "Rotational Motion",
    "Simple Harmonic Motion (SHM)",
    "Kinetic Theory of Gases & Thermodynamics",
    "Mechanical Properties of Solids",
    "Thermal Properties of Matter",
    "Fluid Mechanics",
    "Waves",
    "Wave Optics",
    "Electric Field",
    "Potential & Capacitance",
    "Gravitation",
    "Current Electricity",
    "Moving Charges & Magnetism",
    "Magnetism & Matter",
    "Electromagnetic Induction (EMI)",
    "Alternating Current (AC)",
    "Dual Nature of Matter & Radiation",
    "Atoms",
    "Nuclei",
    "Semiconductors",
    "Electromagnetic Waves",
    "Units & Measurements",
    "Ray Optics"

],

chemistry: [

    "Basic Concepts",
    "Redox Reactions",
    "Solutions",
    "Chemical Kinetics",
    "Thermodynamics",
    "Chemical Equilibrium",
    "Ionic Equilibrium",
    "Atomic Structure",
    "Electrochemistry",
    "Periodic Table",
    "Chemical Bonding",
    "IUPAC Nomenclature",
    "General Organic Chemistry (GOC)",
    "Isomerism",
    "Hydrocarbons",
    "Haloalkanes & Haloarenes",
    "Aldehydes, Ketones & Carboxylic Acids",
    "Amines",
    "Biomolecules",
    "Coordination Chemistry",
    "Qualitative Analysis",
    "P-Block Elements",
    "D-Block & F-Block Elements"

],
};


/* =====================================================
   2. SETTINGS
===================================================== */

const TASKS = [

    "classes",
    "q1",
    "q2",
    "n1",
    "n2"

];


let currentSubject = "math";


/* =====================================================
   3. LOCAL STORAGE
===================================================== */

function storageKey(subject, chapterIndex, task) {

    return `jee_${subject}_${chapterIndex}_${task}`;

}


function getSavedValue(subject, chapterIndex, task) {

    return localStorage.getItem(
        storageKey(subject, chapterIndex, task)
    ) === "true";

}


function saveValue(subject, chapterIndex, task, value) {

    localStorage.setItem(
        storageKey(subject, chapterIndex, task),
        value
    );


    /* SAVE TO FIREBASE */

    if (
        window.firebaseUser &&
        window.saveTrackerToFirebase
    ) {

        window.saveTrackerToFirebase(
            subject,
            chapterIndex,
            task,
            value
        );

    }

}
/* =====================================================
   LOAD FIREBASE PROGRESS
===================================================== */

window.loadFirebaseProgress =
    async function() {

       if (!window.loadTrackerFromFirebase) {
    return;
}

        const cloudData =
            await window.loadTrackerFromFirebase();


        if (!cloudData) {
            return;
        }


        Object.keys(cloudData).forEach(key => {

            const parts =
                key.split("_");


            if (parts.length !== 3) {
                return;
            }


            const subject =
                parts[0];

            const chapterIndex =
                parts[1];

            const task =
                parts[2];


            localStorage.setItem(
                storageKey(
                    subject,
                    chapterIndex,
                    task
                ),
                cloudData[key]
            );

        });


        renderTable();

        calculateAll();


        console.log(
            "☁️ Tracker synchronized from Firebase."
        );

    };



/* =====================================================
   4. CREATE TABLE
===================================================== */
/* =====================================================
   FIREBASE → TRACKER SYNC
===================================================== */

async function syncFromFirebase() {

    if (!window.loadTrackerFromFirebase) {
        return;
    }

    const firebaseData =
        await window.loadTrackerFromFirebase();

    if (!firebaseData || Object.keys(firebaseData).length === 0) {
        return;
    }

    Object.keys(firebaseData).forEach(key => {

        const parts = key.split("_");

        if (parts.length < 3) {
            return;
        }

        const task =
            parts.pop();

        const chapterIndex =
            parts.pop();

        const subject =
            parts.join("_");

        if (
            subjects[subject] &&
            TASKS.includes(task)
        ) {

            localStorage.setItem(
                storageKey(
                    subject,
                    chapterIndex,
                    task
                ),
                firebaseData[key]
            );

        }

    });

    console.log(
        "☁️ Tracker synchronized from Firebase."
    );

    renderTable();
    calculateAll();

}
window.renderTable = function renderTable() {

    const table = document.getElementById("chapterTable");

    const searchText =
        document
            .getElementById("searchBox")
            .value
            .toLowerCase()
            .trim();


    table.innerHTML = "";


    let visible = 0;


    subjects[currentSubject].forEach(
        (chapter, index) => {

            if (
                searchText &&
                !chapter.toLowerCase().includes(searchText)
            ) {

                return;

            }


            visible++;


            const row = document.createElement("tr");


            /*
                Create five checkbox cells
            */

            let checkboxes = "";


            TASKS.forEach(task => {

                const checked =
                    getSavedValue(
                        currentSubject,
                        index,
                        task
                    );
const isOwner =
    window.firebaseUser &&
    window.firebaseUser.uid ===
    "Of8L3iLIUvTbCU1QGjP2BGKWsqV2";

                checkboxes += `

                    <td class="check-cell">

                       <input
    type="checkbox"
    class="check"
    data-subject="${currentSubject}"
    data-chapter="${index}"
    data-task="${task}"
    ${checked ? "checked" : ""}
    ${!isOwner ? "disabled" : ""}
>

                    </td>

                `;

            });


            row.innerHTML = `

                <td class="chapter-number">
                    ${String(index + 1).padStart(2, "0")}
                </td>

                <td class="chapter-name">
                    ${chapter}
                </td>

                ${checkboxes}

            `;


            table.appendChild(row);


            updateRowStatus(row);

        }
    );


    document.getElementById(
        "visibleCount"
    ).textContent =
        `${visible} chapters`;


    attachCheckboxListeners();

}


/* =====================================================
   5. CHECKBOX LISTENERS
===================================================== */

function attachCheckboxListeners() {

    const boxes =
        document.querySelectorAll(
            "#chapterTable .check"
        );


    boxes.forEach(box => {

        box.addEventListener(
            "change",

            function () {
if (
    !window.firebaseUser ||
    window.firebaseUser.uid !==
    "Of8L3iLIUvTbCU1QGjP2BGKWsqV2"
) {

    this.checked = !this.checked;

    alert(
        "🔒 Owner login required to change progress."
    );

    return;
}
                const subject =
                    this.dataset.subject;

                const chapter =
                    this.dataset.chapter;

                const task =
                    this.dataset.task;


                saveValue(
                    subject,
                    chapter,
                    task,
                    this.checked
                );


                updateRowStatus(
                    this.closest("tr")
                );


                calculateAll();

            }
        );

    });

}


/* =====================================================
   6. COMPLETE ROW
===================================================== */

function updateRowStatus(row) {

    if (!row) return;


    const boxes =
        row.querySelectorAll(".check");


    const allComplete =
        boxes.length > 0 &&
        [...boxes].every(
            box => box.checked
        );


    row.classList.toggle(
        "row-complete",
        allComplete
    );

}


/* =====================================================
   7. SUBJECT PROGRESS
===================================================== */

function calculateSubject(subject) {

    let total = 0;

    let checked = 0;


    subjects[subject].forEach(
        (_, chapterIndex) => {

            TASKS.forEach(task => {

                total++;


                if (
                    getSavedValue(
                        subject,
                        chapterIndex,
                        task
                    )
                ) {

                    checked++;

                }

            });

        }
    );


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (checked / total) * 100
            );


    return {
        total,
        checked,
        percentage
    };

}


/* =====================================================
   8. UPDATE SUBJECT BAR
===================================================== */

function updateSubjectUI(
    subject,
    result
) {

    document.getElementById(
        `${subject}Percent`
    ).textContent =
        `${result.percentage}%`;


    document.getElementById(
        `${subject}Bar`
    ).style.width =
        `${result.percentage}%`;


    document.getElementById(
        `${subject}Count`
    ).textContent =
        `${result.checked} / ${result.total}`;

}


/* =====================================================
   9. CALCULATE EVERYTHING
===================================================== */

function calculateAll() {

    const math =
        calculateSubject("math");

    const physics =
        calculateSubject("physics");

    const chemistry =
        calculateSubject("chemistry");


    updateSubjectUI(
        "math",
        math
    );


    updateSubjectUI(
        "physics",
        physics
    );


    updateSubjectUI(
        "chemistry",
        chemistry
    );

const overall =
    Math.round(
        (
            math.percentage +
            physics.percentage +
            chemistry.percentage
        ) / 3
    );
  const total =
    math.total +
    physics.total +
    chemistry.total;


const checked =
    math.checked +
    physics.checked +
    chemistry.checked;

    /* Overall percentage */

    document.getElementById(
        "overallPercent"
    ).textContent =
        `${overall}%`;


    document.getElementById(
        "checkedCount"
    ).textContent =
        checked;


    document.getElementById(
        "totalCount"
    ).textContent =
        total;


    /* Ring */

    const circumference =
        2 * Math.PI * 50;


    const offset =
        circumference -
        (overall / 100) *
        circumference;


    document.getElementById(
        "overallRing"
    ).style.strokeDasharray =
        circumference;


    document.getElementById(
        "overallRing"
    ).style.strokeDashoffset =
        offset;


    calculateQuickStats();

}


/* =====================================================
   10. QUICK STATISTICS
===================================================== */

function calculateQuickStats() {

    let classes = 0;
    let questions = 0;
    let notes = 0;

    let totalChapters = 0;

    Object.keys(subjects).forEach(subject => {
        totalChapters += subjects[subject].length;

        subjects[subject].forEach((_, chapterIndex) => {

            if (getSavedValue(subject, chapterIndex, "classes")) {
                classes++;
            }

            if (getSavedValue(subject, chapterIndex, "q1")) {
                questions++;
            }

            if (getSavedValue(subject, chapterIndex, "n1")) {
                notes++;
            }

            if (getSavedValue(subject, chapterIndex, "n2")) {
                notes++;
            }

        });
    });

    const classTotal = totalChapters;
    const questionTotal = totalChapters;
    const noteTotal = totalChapters * 2;

    const classPercent = classTotal ? Math.round((classes / classTotal) * 100) : 0;
    const questionPercent = questionTotal ? Math.round((questions / questionTotal) * 100) : 0;
    const notePercent = noteTotal ? Math.round((notes / noteTotal) * 100) : 0;

    const updateCircle = (circleId, percentId, countId, percent, checked, total) => {
        const circle = document.getElementById(circleId);
        if (circle) circle.style.setProperty("--progress", `${percent}%`);

        const percentEl = document.getElementById(percentId);
        if (percentEl) percentEl.textContent = `${percent}%`;

        const countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = `${checked} / ${total}`;
    };

    updateCircle("classesCircle", "classesPercent", "classesCircleCount", classPercent, classes, classTotal);
    updateCircle("questionsCircle", "questionsPercent", "questionsCircleCount", questionPercent, questions, questionTotal);
    updateCircle("notesCircle", "notesPercent", "notesCircleCount", notePercent, notes, noteTotal);

}


/* =====================================================
   11. TAB SWITCHING
===================================================== */

document
    .querySelectorAll(".tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".tab")
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                this.classList.add("active");


                currentSubject =
                    this.dataset.subject;


                document.getElementById(
                    "searchBox"
                ).value = "";


                renderTable();

            }
        );

    });


/* =====================================================
   12. SEARCH
===================================================== */

document
    .getElementById("searchBox")
    .addEventListener(
        "input",
        renderTable
    );


/* =====================================================
   13. RESET — LOCKED
===================================================== */

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        async function () {
if (
    !window.firebaseUser ||
    window.firebaseUser.uid !==
    "Of8L3iLIUvTbCU1QGjP2BGKWsqV2"
) {

    alert(
        "🔒 Owner login required to reset progress."
    );

    return;
}
            const lockCode = "082025";

            const enteredCode =
                prompt(
                    "🔒 Enter reset lock code:"
                );


            if (enteredCode === null) {
                return;
            }


            if (enteredCode !== lockCode) {

                alert(
                    "❌ Incorrect lock code. Progress was NOT reset."
                );

                return;
            }


            const confirmReset =
                confirm(
                    "⚠️ Correct code.\n\nAre you sure you want to reset ALL JEE progress?"
                );


            if (!confirmReset) {
                return;
            }


            Object.keys(subjects).forEach(
                subject => {

                    subjects[subject].forEach(
                        (_, chapterIndex) => {

                            TASKS.forEach(task => {

                                localStorage.removeItem(
                                    storageKey(
                                        subject,
                                        chapterIndex,
                                        task
                                    )
                                );

                            });

                        }
                    );

                }
            );


            // Keep the shared Firebase tracker in sync with the local reset.
            if (window.firebaseUser && window.saveTrackerToFirebase) {
                for (const subject of Object.keys(subjects)) {
                    for (let chapterIndex = 0; chapterIndex < subjects[subject].length; chapterIndex++) {
                        for (const task of TASKS) {
                            await window.saveTrackerToFirebase(subject, chapterIndex, task, false);
                        }
                    }
                }
            }

            renderTable();

            calculateAll();


            alert(
                "✅ All JEE progress has been reset everywhere."
            );

        }
    );
const TRACKER_CHAPTER_VERSION = "physics-chemistry-reset-v1";

async function resetPhysicsChemistryProgressForNewChapters() {
    if (localStorage.getItem(TRACKER_CHAPTER_VERSION) === "done") return;

    const tasksToReset = ["classes", "q1", "q2", "n1", "n2"];

    ["physics", "chemistry"].forEach(subject => {
        subjects[subject].forEach((_, chapterIndex) => {
            tasksToReset.forEach(task => {
                localStorage.setItem(storageKey(subject, chapterIndex, task), "false");
            });
        });
    });

    // If the owner is already signed in, also clear the corresponding
    // Firebase fields so the reset is reflected in the shared tracker.
    if (window.firebaseUser && window.saveTrackerToFirebase) {
        for (const subject of ["physics", "chemistry"]) {
            for (let chapterIndex = 0; chapterIndex < subjects[subject].length; chapterIndex++) {
                for (const task of tasksToReset) {
                    await window.saveTrackerToFirebase(subject, chapterIndex, task, false);
                }
            }
        }
    }

    localStorage.setItem(TRACKER_CHAPTER_VERSION, "done");
}

/* =====================================================
   14. INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        renderTable();

        calculateAll();

        if (window.loadFirebaseProgress) {
            await window.loadFirebaseProgress();
        }

        await resetPhysicsChemistryProgressForNewChapters();
        renderTable();
        calculateAll();

    }
);

/* =====================================================
   15. SYLLABUS COMPLETION COUNTDOWN
===================================================== */

const SYLLABUS_COMPLETION_DATE = "2026-12-31T23:59:59";

function updateSyllabusCountdown() {
    const target = new Date(SYLLABUS_COMPLETION_DATE).getTime();
    const difference = target - new Date().getTime();
    const ids = ["mainsDays", "mainsHours", "mainsMinutes", "mainsSeconds", "mainsDate"];
    if (!ids.every(id => document.getElementById(id))) return;
    if (difference <= 0) {
        document.getElementById("mainsDays").textContent = "0";
        document.getElementById("mainsHours").textContent = "00";
        document.getElementById("mainsMinutes").textContent = "00";
        document.getElementById("mainsSeconds").textContent = "00";
    } else {
        document.getElementById("mainsDays").textContent = Math.floor(difference / 86400000);
        document.getElementById("mainsHours").textContent = String(Math.floor(difference / 3600000) % 24).padStart(2, "0");
        document.getElementById("mainsMinutes").textContent = String(Math.floor(difference / 60000) % 60).padStart(2, "0");
        document.getElementById("mainsSeconds").textContent = String(Math.floor(difference / 1000) % 60).padStart(2, "0");
    }
    document.getElementById("mainsDate").textContent = "Target: " + new Date(SYLLABUS_COMPLETION_DATE).toLocaleDateString("en-IN", {day:"numeric", month:"long", year:"numeric"});
}

updateSyllabusCountdown();
setInterval(updateSyllabusCountdown, 1000);
