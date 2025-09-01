```
.
├── .github
│   └── workflows
│       └── ci.yml
├── PROJECT_PLAN.md
├── README.md
├── backend
│   ├── package.json
│   ├── public
│   │   └── js
│   │       └── examClient.js
│   └── src
│       ├── app.js
│       ├── config
│       │   └── database.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── examController.js
│       │   ├── feedbackController.js
│       │   ├── questionController.js
│       │   ├── reportController.js
│       │   └── subjectController.js
│       ├── middleware
│       │   └── authMiddleware.js
│       ├── models
│       │   ├── Answer.js
│       │   ├── Exam.js
│       │   ├── ExamQuestion.js
│       │   ├── ExamResult.js
│       │   ├── Grade.js
│       │   ├── Question.js
│       │   ├── Subject.js
│       │   ├── User.js
│       │   └── index.js
│       ├── public
│       │   └── css
│       │       └── style.css
│       ├── routes
│       │   ├── auth.js
│       │   ├── exams.js
│       │   ├── questions.js
│       │   ├── reports.js
│       │   └── subjects.js
│       ├── services
│       │   ├── examGenerator.js
│       │   ├── feedbackService.js
│       │   └── scoreCalculator.js
│       └── views
│           ├── examResult.ejs
│           ├── examTaking.ejs
│           ├── home.ejs
│           └── performanceReport.ejs
├── database
│   └── schema.sql
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── services.json
```