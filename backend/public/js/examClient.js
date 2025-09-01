document.addEventListener('DOMContentLoaded', () => {
    const questions = examData.Questions;
    const examId = examData.id;
    let currentQuestionIndex = 0;
    const userAnswers = []; // Store answers: [{ questionId: 1, selectedAnswerIds: [2, 3] }, ...]

    const questionsContainer = document.getElementById('questionsContainer');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitExamButton = document.getElementById('submitExamButton');
    const timerDisplay = document.getElementById('timer');

    const examDurationMinutes = 30; // Example: 30 minutes
    let timeLeft = examDurationMinutes * 60; // in seconds
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('¡Tiempo agotado! Tu examen ha sido enviado automáticamente.');
                submitExam();
            } else {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `Tiempo restante: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    function renderQuestion(index) {
        questionsContainer.innerHTML = '';
        const question = questions[index];
        if (!question) return;

        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.dataset.questionId = question.id;

        const questionText = document.createElement('p');
        questionText.textContent = `Pregunta ${index + 1}: ${question.text}`;
        questionCard.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        const answerType = question.type === 'multiple-choice' ? 'checkbox' : 'radio';

        question.Answers.forEach(answer => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = answerType;
            input.name = `question_${question.id}`;
            input.value = answer.id;
            input.dataset.answerId = answer.id; // Store answer ID

            label.appendChild(input);
            label.appendChild(document.createTextNode(answer.text));
            optionsDiv.appendChild(label);
        });

        questionCard.appendChild(optionsDiv);
        questionsContainer.appendChild(questionCard);

        // Load previously selected answers for this question
        const existingAnswer = userAnswers.find(ua => ua.questionId === question.id);
        if (existingAnswer) {
            existingAnswer.selectedAnswerIds.forEach(selectedId => {
                const input = questionCard.querySelector(`input[data-answer-id="${selectedId}"]`);
                if (input) input.checked = true;
            });
        }

        updateNavigationButtons();
    }

    function saveCurrentAnswer() {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswerIds = [];
        const inputs = questionsContainer.querySelectorAll(`input[name="question_${currentQuestion.id}"]:checked`);
        inputs.forEach(input => selectedAnswerIds.push(parseInt(input.value)));

        // Update or add the answer for the current question
        const existingAnswerIndex = userAnswers.findIndex(ua => ua.questionId === currentQuestion.id);
        if (existingAnswerIndex !== -1) {
            userAnswers[existingAnswerIndex].selectedAnswerIds = selectedAnswerIds;
        } else {
            userAnswers.push({ questionId: currentQuestion.id, selectedAnswerIds });
        }
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.style.display = 'none';
            submitExamButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block';
            submitExamButton.style.display = 'none';
        }
    }

    prevButton.addEventListener('click', () => {
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
        }
    });

    nextButton.addEventListener('click', () => {
        saveCurrentAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        }
    });

    async function submitExam() {
        clearInterval(timerInterval);
        saveCurrentAnswer(); // Save the answer for the last question

        try {
            const response = await fetch(`/api/exams/${examId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token is stored in localStorage
                },
                body: JSON.stringify({ userAnswers })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit exam');
            }

            const result = await response.json();
            alert(`Examen finalizado! Tu puntuación: ${result.score} / ${result.totalQuestions}`);
            window.location.href = `/reports/${result.resultId}`; // Redirect to feedback/report page

        } catch (error) {
            console.error('Error submitting exam:', error);
            alert(`Error al enviar el examen: ${error.message}`);
        }
    }

    document.getElementById('examForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const confirmSubmit = confirm('¿Estás seguro de que quieres finalizar el examen?');
        if (confirmSubmit) {
            submitExam();
        }
    });

    // Initial render
    if (questions.length > 0) {
        renderQuestion(currentQuestionIndex);
        startTimer();
    } else {
        questionsContainer.innerHTML = '<p>No hay preguntas para este examen.</p>';
        nextButton.disabled = true;
        submitExamButton.style.display = 'none';
    }
});
