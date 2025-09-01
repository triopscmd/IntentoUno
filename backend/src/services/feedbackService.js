/**
 * Generates a general feedback message based on exam performance.
 * @param {number} score - The score percentage (0-100).
 * @param {number} totalQuestions - Total number of questions.
 * @returns {string} The feedback message.
 */
exports.generateGeneralFeedback = (score, totalQuestions) => {
    if (score === 100) {
        return '¡Felicidades! Un desempeño perfecto. ¡Sigue así!';
    } else if (score >= 80) {
        return '¡Excelente trabajo! Has demostrado un gran conocimiento. Revisa tus errores para mejorar aún más.';
    } else if (score >= 60) {
        return 'Buen esfuerzo. Hay áreas donde puedes mejorar. Repasa los temas de las preguntas incorrectas.';
    } else if (score >= 40) {
        return 'Necesitas repasar más a fondo. Concentra tu estudio en los temas que te resultaron más difíciles.';
    } else {
        return 'Tu resultado sugiere que necesitas un repaso completo. No te desanimes, ¡cada error es una oportunidad para aprender!';
    }
};

/**
 * Generates detailed feedback for each question.
 * @param {Array<Object>} detailedQuestionResults - Array of objects from scoreCalculator.calculateScore.detailedFeedback.
 * @param {Array<Object>} allAnswers - All possible answers for the questions, including their text and correctness.
 * @returns {Array<Object>} Detailed feedback per question with answer texts.
 */
exports.generateDetailedQuestionFeedback = (detailedQuestionResults, allAnswers) => {
    return detailedQuestionResults.map(qResult => {
        const questionAnswers = allAnswers.filter(a => a.questionId === qResult.questionId);
        const correctTexts = questionAnswers
            .filter(a => qResult.correctAnswerIds.includes(a.id))
            .map(a => a.text);
        const userSelectedTexts = questionAnswers
            .filter(a => qResult.userSelectedAnswerIds.includes(a.id))
            .map(a => a.text);

        return {
            questionText: qResult.questionText,
            isCorrect: qResult.isCorrect,
            feedbackMessage: qResult.isCorrect ? 'Correcto' : 'Incorrecto',
            correctAnswers: correctTexts,
            yourAnswers: userSelectedTexts
        };
    });
};
