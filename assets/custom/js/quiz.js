const QUESTIONS = [
    {
        label: 'How old are you?',
        answers: ['18-25', '25-35', '35-45', '45-55', '55+'],
    },
    {
        label: 'Why would you consider adding gold to your investment portfolio?',
        answers: [
            'To protect against economic downturns',
            'To earn high annual dividends',
            'Because it’s a trendy investment',
            'To diversify into digital currencies',
        ],
    },
    {
        label: 'When do you feel most confident about investing in gold?',
        answers: [
            'During periods of rising inflation',
            'When stock markets are booming',
            'Gold exchange-traded funds (ETFs)',
            'When gold prices are at their highest',
            'After consulting social media opinions',
        ],
    },
    {
        label: 'If you were to invest in gold today, would you prefer to own physical gold or trade gold futures?',
        answers: [
            'Physical gold, because I like to own tangible assets',
            'Gold futures, for the potential to leverage my investment',
            'Both, for a balanced approach',
        ],
    },
    {
        label: 'When comparing gold to other investments, what appeals to you most about it?',
        answers: [
            'Its long-term stability',
            'The thrill of short-term price swings',
            'The fact that it’s a physical, tangible asset',
            'I don’t see much appeal in gold',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="quiz-wrapper">
            <div class="quiz-content">
                <div class="content">
                    <h2 class="title">Test Your Knowledge on Gold Investing & Trading</h2>
                    <h4 class="sub-title">Discover how much you really know about gold markets, investing strategies, and trading insights.</h4>
                    <h5>Are you an expert in gold investing or just starting out? This quiz is designed to challenge your understanding of the gold market, from its historical value to modern-day trading strategies.</h5>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Start</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
            <div class="quiz-content text-center quiz-start">
                <div class="question-wrapper">
                    <div class="" style="width: 100%; padding-left: 20px; padding-right: 20px">
                        <div class="progress" style="padding-left: 0 !important; padding-right: 0 !important;">
                            <div class="progress-bar" style="width: ${questionsStep.getProgress()}%"></div>
                        </div>
                    </div>

                    <h3 class="question mt-4">${question.label}</h3>
                </div>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>
            </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToNextQuestion':
                return questionsStep.goToNextQuestion();
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        questionsStep.questionIndex -= 1;
        questionsStep.render();
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
            <div class="row quiz-content form-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                    <h2 class="title">Form of communication</h2>
                    <h3 class="mb-4">Please fill out the feedback form</h3>
                    <form>
                        <input class="form-control" name="name" type="name" placeholder="Name" required>
                        <input class="form-control" name="Surname" type="name" placeholder="Surname" required>
                        <input class="form-control" name="email" type="email" placeholder="E-Mail" required>
                        <input class="form-control" name="phone" type="phone" placeholder="Phone" required>
                        <div id="checkbox">
                            <input type="checkbox">
                            <label>I agree with the <a class="form-link" href="terms-of-use.html">terms of use and the privacy policy</a></label>
                        </div>
                         <div id="checkbox">
                            <input type="checkbox" checked disabled>
                            <label>I agree to the email newsletter</label>
                        </div>

                        
                        ${Object.keys(quiz.answers)
                            .map(
                                (question) =>
                                    `<input name="${question}" value="${quiz.answers[question]}" hidden>`,
                            )
                            .join('')}
                
                        <button data-action="submitAnswers" class="btn btn-primary w-100 py-3 first-button">Send</button>
                    </form>
                </div>
            </div>
      `;
    },
    onClick: (el) => {
        const newPath = 'thanks.html';
        if (el.getAttribute('data-action') === 'submitAnswers') {
            localStorage.setItem('quizDone', true);
            document.getElementById('main-page').classList.remove('hide');
            document.getElementById('quiz-page').classList.add('hide');
            document.getElementById('footer').classList.add('hide');
            window.location.href = newPath;
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
