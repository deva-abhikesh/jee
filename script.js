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

        "Basic Math & Vector Tools",
        "Kinematics (1D & 2D)",
        "Geometrical Optics (Ray Optics)",
        "Newton's Laws of Motion (NLM)",
        "Work, Power & Energy (WPE)",
        "Circular Motion",
        "Center of Mass & Collision",
        "Rotational Motion",
        "Simple Harmonic Motion (SHM)",
        "Electrostatics",
        "Conductors",
        "Gravitation",
        "Current Electricity",
        "Heat Transfer",
        "Capacitance",
        "Magnetic Effect of Current (EMF)",
        "Magnetic Properties of Matter",
        "Electromagnetic Induction (EMI)",
        "Alternating Current (AC)",
        "Electromagnetic Waves (EMW)",
        "Modern Physics",
        "Fluid Mechanics",
        "Viscosity",
        "Elasticity",
        "Kinetic Theory of Gases (KTG)",
        "Calorimetry",
        "Thermal Expansion",
        "Thermodynamics",
        "Wave on a String",
        "Sound Waves",
        "Wave Optics",
        "Optical Instruments",
        "Semiconductors",
        "Communication System",
        "Errors & Measurements",
        "Surface Tension"

    ],


    chemistry: [

        "Introduction to Chemistry",
        "Atomic Structure",
        "Mole Concept",
        "Periodic Table & Periodicity",
        "Basic Inorganic Nomenclature (BIN)",
        "Gaseous State",
        "Chemical Bonding",
        "Chemical Equilibrium",
        "Thermodynamics",
        "Thermochemistry",
        "Ionic Equilibrium",
        "Equivalent Concept",
        "s-Block Elements",
        "p-Block Elements",
        "Hydrogen",
        "Solutions & Colligative Properties",
        "Coordination Compounds",
        "Solid State",
        "Electrochemistry",
        "General Inorganic Chemistry (GIC)",
        "Metallurgy",
        "Qualitative Analysis (Salt Analysis)",
        "Chemical Kinetics",
        "Surface Chemistry",
        "d & f Block Elements",
        "GOC & Isomerism",
        "Hydrocarbons",
        "Haloalkanes & Haloarenes",
        "Alcohols, Phenols & Ethers",
        "Aldehydes, Ketones & Carboxylic Acids",
        "Amines (Nitrogen Compounds)",
        "Biomolecules"

    ]

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

        if (
            !window.firebaseUser ||
            !window.loadTrackerFromFirebase
        ) {
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
function renderTable() {

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


                checkboxes += `

                    <td class="check-cell">

                        <input
                            type="checkbox"
                            class="check"
                            data-subject="${currentSubject}"
                            data-chapter="${index}"
                            data-task="${task}"
                            ${checked ? "checked" : ""}
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

    let chaptersStarted = 0;

    let classes = 0;

    let questions = 0;

    let notes = 0;


    Object.keys(subjects).forEach(
        subject => {

            subjects[subject].forEach(
                (_, chapterIndex) => {

                    const chapterTasks =
                        TASKS.map(
                            task =>
                                getSavedValue(
                                    subject,
                                    chapterIndex,
                                    task
                                )
                        );


                    if (
                        chapterTasks.some(
                            value => value
                        )
                    ) {

                        chaptersStarted++;

                    }


                    if (
                        getSavedValue(
                            subject,
                            chapterIndex,
                            "classes"
                        )
                    ) {

                        classes++;

                    }


                    if (
                        getSavedValue(
                            subject,
                            chapterIndex,
                            "q1"
                        )
                    ) {

                        questions++;

                    }


                    if (
                        getSavedValue(
                            subject,
                            chapterIndex,
                            "q2"
                        )
                    ) {

                        questions++;

                    }


                    if (
                        getSavedValue(
                            subject,
                            chapterIndex,
                            "n1"
                        )
                    ) {

                        notes++;

                    }


                    if (
                        getSavedValue(
                            subject,
                            chapterIndex,
                            "n2"
                        )
                    ) {

                        notes++;

                    }

                }
            );

        }
    );


    document.getElementById(
        "completedChapters"
    ).textContent =
        chaptersStarted;


    document.getElementById(
        "completedClasses"
    ).textContent =
        classes;


    document.getElementById(
        "completedQuestions"
    ).textContent =
        questions;


    document.getElementById(
        "completedNotes"
    ).textContent =
        notes;

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
        function () {

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


            renderTable();

            calculateAll();


            alert(
                "✅ All JEE progress has been reset."
            );

        }
    );
/* =====================================================
   14. INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        renderTable();

        calculateAll();

        await syncFromFirebase();

    }
);

/* =====================================================
   15. JEE 2027 COUNTDOWN
===================================================== */

/*
   IMPORTANT:
   Replace these two dates when the official
   JEE 2027 dates are announced.

   Format:
   YYYY-MM-DDTHH:MM:SS
*/

const JEE_MAIN_DATE = "2026-12-01T09:00:00";

const JEE_ADVANCED_DATE = "2027-01-20T09:00:00";


function updateCountdown(
    targetDate,
    daysId,
    hoursId,
    minutesId,
    secondsId
) {

    const target =
        new Date(targetDate).getTime();

    const now =
        new Date().getTime();

    const difference =
        target - now;


    if (difference <= 0) {

        document.getElementById(daysId).textContent = "0";
        document.getElementById(hoursId).textContent = "00";
        document.getElementById(minutesId).textContent = "00";
        document.getElementById(secondsId).textContent = "00";

        return;

    }


    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (difference / (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    document.getElementById(daysId).textContent =
        days;

    document.getElementById(hoursId).textContent =
        String(hours).padStart(2, "0");

    document.getElementById(minutesId).textContent =
        String(minutes).padStart(2, "0");

    document.getElementById(secondsId).textContent =
        String(seconds).padStart(2, "0");

}


function updateExamDateLabels() {

    const mainsDate =
        new Date(JEE_MAIN_DATE);

    const advancedDate =
        new Date(JEE_ADVANCED_DATE);


    document.getElementById("mainsDate").textContent =
        "Target: " +
        mainsDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("advancedDate").textContent =
        "Target: " +
        advancedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


function updateJEECountdowns() {

    updateCountdown(
        JEE_MAIN_DATE,
        "mainsDays",
        "mainsHours",
        "mainsMinutes",
        "mainsSeconds"
    );


    updateCountdown(
        JEE_ADVANCED_DATE,
        "advancedDays",
        "advancedHours",
        "advancedMinutes",
        "advancedSeconds"
    );

}


updateExamDateLabels();

updateJEECountdowns();


setInterval(
    updateJEECountdowns,
    1000
);
