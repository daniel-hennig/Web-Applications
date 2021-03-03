let quizData = [];
let quizDataCorrect = [];
let selectedAnswers = [];

const quizDataHTML = [
    {
        question : "What is HTML5 used for?",
        a : "It is used to control presentation, formatting and layout.",
        b : "It is used to provide the basic structure of sites.",
        c : "It is used to control the behaviour of different elements.",
        d : "It has no use at all.",
        correct : "b"
    }, {
        question : "What is a <div> tag?",
        a : "It stands for \"Data Insertion Vision\" and controls all data which can be seen in the browser.",
        b : "It devides one web page into two separate MySQL Databases.",
        c : "It describes the difference between HTML tags and CSS properties.",
        d : "It defines a division or a section in an HTML document and is used as a container for HTML elements.",
        correct : "d"
    }, {
        question : "Do all HTML tags come in a pair?",
        a : "No, e.g. the <img> and <br> tags.",
        b : "Yes.",
        c : "What are tags?",
        d : "No, e.g. the <ul> and <ol> tags.",
        correct : "a"
    }/*, {
        question : '',
        a : '',
        b : '',
        c : '',
        d : '',
        correct : ''
    }*/
];

const quizDataCSS = [
    {
        question : 'What is CSS used for?',
        a : 'It is used to control presentation, formatting and layout.',
        b : 'It is used to provide the basic structure of sites.',
        c : 'It is used to control the behaviour of different elements.',
        d : 'It has no use at all.',
        correct : 'a'
    }, {
        question : 'Which property is used to create space around elements, outside of any defined borders?',
        a : 'margin',
        b : 'height',
        c : 'width',
        d : 'padding',
        correct : 'a'
    }, {
        question : 'Which of the following selectors has the strongest priority in CSS?',
        a : 'class',
        b : 'universal selector',
        c : 'id',
        d : 'human instincts',
        correct : 'c'
    }, {
        question : 'Which of the following is a CSS Framework?',
        a : 'Bootstrap',
        b : 'React',
        c : 'Laravel',
        d : 'Django',
        correct : 'a'
    }/*, {
        question : '',
        a : '',
        b : '',
        c : '',
        d : '',
        correct : ''
    }*/
];

const quizDataJS = [
    {
        question : 'How long does it take to learn JavaScript?',
        a : '2 years',
        b : '2 months',
        c : '2 says',
        d : 'It\'s the wrong question.. Move on, please.',
        correct : 'd'
    }, {
        question : 'Is JavaScript similar or related to Java?',
        a : 'No',
        b : 'Yes',
        c : 'Maybe',
        d : 'The sky is green, did you know?',
        correct : 'a'
    }, {
        question : 'Which code is called a function?',
        a : 'alert(\'function\');',
        b : 'consolde.log(\'function\');',
        c : 'noFunction() => { };',
        d : '.function { }',
        correct : 'c'
    }, {
        question : 'What is JavaScript used for?',
        a : 'It is used to control presentation, formatting and layout.',
        b : 'It is used to provide the basic structure of sites.',
        c : 'It is used to control the behaviour of different elements.',
        d : 'It has no use at all.',
        correct : 'c'
    }, {
        question : 'Which of the following is a JavaScript Framework?',
        a : 'Bootstrap',
        b : 'React',
        c : 'Laravel',
        d : 'Django',
        correct : 'b'
    }, {
        question : 'Which of the following code is called an array?',
        a : 'array = { };',
        b : 'array = ( );',
        c : 'document.write(\'array\')',
        d : 'array = [ ];',
        correct : 'd'
    }/*, {
        question : '',
        a : '',
        b : '',
        c : '',
        d : '',
        correct : ''
    }*/
];

const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const startBtn = document.querySelector('#startBtn');
const quizHeader = document.getElementById('quiz-header');
const catHeader = document.getElementById('cat-header');

let currentQuiz = 0;
let score = 0;

function getSelectedCat(category) {
    const checkboxes = document.querySelectorAll(`input[name="${category}"]:checked`);

    let categories = [];
    checkboxes.forEach((checkbox) => { 
    categories.push(checkbox.value);
    });
    return categories;
}

function loadQuiz() {
    deselectAnswers()

    const currentQuizData = quizData[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function getSelected() {
    let answer = undefined;

    answerEls.forEach((answerEl) => {
        if(answerEl.checked) {
            answer = answerEl.id;
        }
    });
    
    return answer;
}

function deselectAnswers() {
    answerEls.forEach((answerEl) => {
        answerEl.checked = false;
    });
}

// showing options + answers of each resultsQuestion
function showOptions(resultsQ, optionsUls) {
    for (let j=0; j<quizData.length; j++) {
        $( optionsUls[j] ).hide();

        $(resultsQ[j]).click(function (event) {
            if(optionsUls[j].classList.contains('toggle')) {
                $( optionsUls[j] ).removeClass('toggle');
                $( optionsUls[j] ).slideDown( "slow", function() {
                    // Animation complete
                  });
            } else {
                $( optionsUls[j] ).slideUp( "slow", function() {
                    // Animation complete.
                  });
                $( optionsUls[j] ).addClass('toggle');
            }
        });
    }
}

// showing the results at the end of the quiz
function showResults() {
    quiz.innerHTML = `<h2 style="color: rgb(56, 56, 56); border-bottom: 2px solid rgb(196, 196, 196);">You answered correctly at <span style="color: green;">${score}</span>/${quizData.length} questions.</h2>`;
    quiz.innerHTML += `<div class="results_overview" id="results-overview"></div>`;
            
    const resultsOverview = document.getElementById('results-overview');

    for (let j=0; j<quizData.length; j++) {
        const resultsQuestionDiv = document.createElement('div');
        resultsQuestionDiv.classList.add('results_question_div');
        resultsQuestionDiv.setAttribute('id', 'results-question-div');

        const resultsQuestion = document.createElement('h2');
        resultsQuestion.classList.add('resultsQ', 'resultsQ_false');
        resultsQuestion.innerText = quizData[j].question;

        // creating option-variables
        const optionsUl = document.createElement('ul');
        optionsUl.classList.add('options_Ul', 'toggle');
        const optionsLi1 = document.createElement('li');
        const optionsLi2 = document.createElement('li');
        const optionsLi3 = document.createElement('li');
        const optionsLi4 = document.createElement('li');
        const optionsInput1 = document.createElement('input');
        const optionsInput2 = document.createElement('input');
        const optionsInput3 = document.createElement('input');
        const optionsInput4 = document.createElement('input');
        const optionsLabel1 = document.createElement('label');
        const optionsLabel2 = document.createElement('label');
        const optionsLabel3 = document.createElement('label');
        const optionsLabel4 = document.createElement('label');

        // styling option-variables by giving them its properties
        $(optionsInput1).attr(
            {
              'type': 'radio', 
              'id': 'a', 
              'name': '', 
              'class': 'answer radio'
            });
        $(optionsInput2).attr(
            {
              'type': 'radio', 
              'id': 'b',
              'name': '', 
              'class': 'answer radio'
            });
        $(optionsInput3).attr(
            {
              'type': 'radio', 
              'id': 'c', 
              'name': '', 
              'class': 'answer radio'
            });
        $(optionsInput4).attr(
            {
              'type': 'radio', 
              'id': 'd', 
              'name': '', 
              'class': 'answer radio'
            });

        $(optionsLabel1).attr(
            {
              'id': 'a_text', 
              'for': 'a',
              'class': 'radio'
            });
        $(optionsLabel2).attr(
            {
              'id': 'b_text', 
              'for': 'b',
              'class': 'radio'
            });
        $(optionsLabel3).attr(
            {
              'id': 'c_text', 
              'for': 'c',
              'class': 'radio'
            });
        $(optionsLabel4).attr(
            {
              'id': 'd_text', 
              'for': 'd',
              'class': 'radio'
            });

        // pushing option-variables into option-arrays
        let ul_Arr = [];
        ul_Arr.push(optionsLi1, optionsLi2, optionsLi3, optionsLi4);

        let li1_Arr = [];
        li1_Arr.push(optionsInput1, optionsLabel1);

        let li2_Arr = [];
        li2_Arr.push(optionsInput2, optionsLabel2);

        let li3_Arr = [];
        li3_Arr.push(optionsInput3, optionsLabel3);

        let li4_Arr = [];
        li4_Arr.push(optionsInput4, optionsLabel4);

        let optInp_Arr = [];
        optInp_Arr.push(optionsInput1, optionsInput2, optionsInput3, optionsInput4);

        let optLab_Arr = [];
        optLab_Arr.push(optionsLabel1, optionsLabel2, optionsLabel3, optionsLabel4);

        // giving data to options
        optionsLabel1.innerText = quizData[j].a;
        optionsLabel2.innerText = quizData[j].b;
        optionsLabel3.innerText = quizData[j].c;
        optionsLabel4.innerText = quizData[j].d;

        // renaming variable for comparing object-equality
        const a = quizData[j];

        // showing selected answers at the end
        for (let a=0; a<selectedAnswers.length; a++) {
            if (j === a) {
                if (selectedAnswers[a] == optionsInput1.id) {
                    optionsInput1.setAttribute("checked", "checked");
                } else if (selectedAnswers[a] == optionsInput2.id) {
                    optionsInput2.setAttribute("checked", "checked");
                } else if (selectedAnswers[a] == optionsInput3.id) {
                    optionsInput3.setAttribute("checked", "checked");
                } else if (selectedAnswers[a] == optionsInput4.id) {
                    optionsInput4.setAttribute("checked", "checked");
                }
            }
        }

        // selecting all correct answers at the end
        for (let x=0; x<4; x++) {
            if (optInp_Arr[x].id === quizData[j].correct) {
                optLab_Arr[x].style.color = 'green';
            }
        }

        // comparing object-equality
        for (let k=0; k<quizDataCorrect.length; k++) {
            const b = quizDataCorrect[k];
    
            function isEquivalent(a, b) {
                    // Create arrays of property names
                    let aProps = Object.getOwnPropertyNames(a);
                    let bProps = Object.getOwnPropertyNames(b);
    
                    // If number of properties is different,
                    // objects are not equivalent
                    if (aProps.length != bProps.length) {
                    return false;
                    }
    
                    for (let i = 0; i < aProps.length; i++) {
                        let propName = aProps[i];
    
                        // If values of same property are not equal,
                        // objects are not equivalent
                        if (a[propName] !== b[propName]) {
                            return false;
                        }
                    }
    
                    // If we made it this far, objects
                    // are considered equivalent
                    return true;
            }
    
            // Outputs: true
            const tester = isEquivalent(a,b);
            // console.log(tester);

            switch (tester) {
                case (true):
                    $( resultsQuestion ).addClass(" resultsQ_correct");
                    $( resultsQuestion ).removeClass("resultsQ_false");
                    break;
            }
        }

        ////////////// APPENDING RESULTS //////////////
        resultsOverview.appendChild(resultsQuestionDiv);
        resultsQuestionDiv.appendChild(resultsQuestion);
        resultsQuestionDiv.appendChild(optionsUl);

        // looping and appending the option-arrays
        for (let i=0; i<ul_Arr.length; i++) {
            optionsUl.appendChild(ul_Arr[i]);

            for (let j=0; j<li1_Arr.length; j++) {
                ul_Arr[0].appendChild(li1_Arr[j]);
            }
            for (let k=0; k<li2_Arr.length; k++) {
                ul_Arr[1].appendChild(li2_Arr[k]);
            }
            for (let l=0; l<li3_Arr.length; l++) {
                ul_Arr[2].appendChild(li3_Arr[l]);
            }
            for (let m=0; m<li4_Arr.length; m++) {
                ul_Arr[3].appendChild(li4_Arr[m]);
            }
        }
    }
    
    quiz.innerHTML +=  `<button onClick="location.reload()">Reload</button>`;
    
    const resultsQ = document.querySelectorAll('.resultsQ');
    const optionsUls = document.querySelectorAll('.options_Ul');

    showOptions(resultsQ, optionsUls);
}

startBtn.addEventListener('click', () => {
    let getCat = getSelectedCat('category');
    getCat = getCat.toString();

    switch (getCat) {
        case ('html5'):
            quizData = quizData.concat(quizDataHTML);
            break;
        case ('css3'):
            quizData = quizData.concat(quizDataCSS);
            break;
        case ('js'):
            quizData = quizData.concat(quizDataJS);
            break;
        case ('html5,css3'):
            quizData = quizData.concat(quizDataHTML, quizDataCSS);
            break;
        case ('html5,js'):
            quizData = quizData.concat(quizDataHTML, quizDataJS);
            break;
        case ('css3,js'):
            quizData = quizData.concat(quizDataCSS, quizDataJS);
            break;
        case ('html5,css3,js'):
            quizData = quizData.concat(quizDataHTML, quizDataCSS, quizDataJS);
            break;
    }
    if (getCat != '') {
        quizHeader.classList.remove('hidden');
        submitBtn.classList.remove('hidden');
        catHeader.classList.add('hidden');
        startBtn.classList.add('hidden');
        loadQuiz();
    }
});

submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if(answer) {
        if(answer === quizData[currentQuiz].correct) {
            score++;
            quizDataCorrect.push(quizData[currentQuiz]);
        }

        selectedAnswers.push(answer);

        currentQuiz++;

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            showResults();
        }  
    }
});

// CHECKBOX STYLES
let checkbox = document.getElementById('cb');
let checkbox2 = document.getElementById('cb2');
let checkbox3 = document.getElementById('cb3');
let svg = document.getElementById('checkbox');
let svg2 = document.getElementById('checkbox2');
let svg3 = document.getElementById('checkbox3');

svg.addEventListener('click', () => {
    if(checkbox.checked)
        svg.classList.add('reverse');
    else 
        svg.classList.remove('reverse');

});
svg2.addEventListener('click', () => {
    if(checkbox2.checked)
        svg2.classList.add('reverse');
    else 
        svg2.classList.remove('reverse');

});
svg3.addEventListener('click', () => {
    if(checkbox3.checked)
        svg3.classList.add('reverse');
    else 
        svg3.classList.remove('reverse');
});
