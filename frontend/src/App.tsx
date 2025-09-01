import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api'; // Backend API base URL

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  level: string;
}

interface Answer {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  subjectId: number;
  gradeId: number;
  type: 'single-choice' | 'multiple-choice';
  Answers: Answer[];
  Subject?: { name: string }; // For display
  Grade?: { level: string }; // For display
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Panel de Administración del Generador de Exámenes</h1>
      <p>Bienvenido. Utiliza la navegación para gestionar asignaturas, grados y preguntas.</p>
      <nav>
        <ul>
          <li><Link to="/subjects">Gestionar Asignaturas y Grados</Link></li>
          <li><Link to="/questions">Gestionar Banco de Preguntas</Link></li>
          <li><a href="http://localhost:3000/home" target="_blank" rel="noopener noreferrer">Ir a la Aplicación Principal (EJS)</a></li>
        </ul>
      </nav>
      {localStorage.getItem('token') && <button onClick={handleLogout}>Cerrar Sesión</button>}
    </div>
  );
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de inicio de sesión');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
};

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password, role });
      setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de registro');
    }
  };

  return (
    <div className="container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div>
          <label>Nombre de Usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean } > = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // A more robust check would involve decoding the token and verifying the role
  // For simplicity, we'll assume a token means authenticated, and for adminOnly, we'll rely on backend's check.

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    // If adminOnly, we expect the backend to enforce it. Frontend provides UI, backend provides security.
  }, [token, navigate]);

  if (!token) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

const SubjectGradeManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchSubjectsAndGrades = async () => {
    try {
      const subjectRes = await axios.get(`${API_BASE_URL}/subjects`, { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(subjectRes.data);
      const gradeRes = await axios.get(`${API_BASE_URL}/subjects/grades`, { headers: { Authorization: `Bearer ${token}` } });
      setGrades(gradeRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar asignaturas/grados');
    }
  };

  useEffect(() => {
    fetchSubjectsAndGrades();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_BASE_URL}/subjects`, { name: newSubjectName }, { headers: { Authorization: `Bearer ${token}` } });
      setNewSubjectName('');
      setSuccess('Asignatura creada con éxito');
      fetchSubjectsAndGrades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear asignatura');
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_BASE_URL}/subjects/grades`, { level: newGradeLevel }, { headers: { Authorization: `Bearer ${token}` } });
      setNewGradeLevel('');
      setSuccess('Grado creado con éxito');
      fetchSubjectsAndGrades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear grado');
    }
  };

  const handleDeleteSubject = async (id: number) => {
    setError('');
    setSuccess('');
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignatura?')) {
      try {
        await axios.delete(`${API_BASE_URL}/subjects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess('Asignatura eliminada con éxito');
        fetchSubjectsAndGrades();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar asignatura');
      }
    }
  };

  const handleDeleteGrade = async (id: number) => {
    setError('');
    setSuccess('');
    if (window.confirm('¿Estás seguro de que quieres eliminar este grado?')) {
      try {
        await axios.delete(`${API_BASE_URL}/subjects/grades/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess('Grado eliminado con éxito');
        fetchSubjectsAndGrades();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar grado');
      }
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="container">
        <h2>Gestionar Asignaturas y Grados</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <h3>Asignaturas</h3>
        <form onSubmit={handleAddSubject}>
          <input
            type="text"
            placeholder="Nueva Asignatura"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            required
          />
          <button type="submit">Añadir Asignatura</button>
        </form>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id}>
              {subject.name}
              <button onClick={() => handleDeleteSubject(subject.id)} className="btn-danger">Eliminar</button>
            </li>
          ))}
        </ul>

        <h3>Grados</h3>
        <form onSubmit={handleAddGrade}>
          <input
            type="text"
            placeholder="Nuevo Grado (ej. Primero)"
            value={newGradeLevel}
            onChange={(e) => setNewGradeLevel(e.target.value)}
            required
          />
          <button type="submit">Añadir Grado</button>
        </form>
        <ul>
          {grades.map((grade) => (
            <li key={grade.id}>
              {grade.level}
              <button onClick={() => handleDeleteGrade(grade.id)} className="btn-danger">Eliminar</button>
            </li>
          ))}
        </ul>
        <Link to="/">Volver al Inicio</Link>
      </div>
    </ProtectedRoute>
  );
};

const QuestionBankManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionSubjectId, setNewQuestionSubjectId] = useState<number | ''>('');
  const [newQuestionGradeId, setNewQuestionGradeId] = useState<number | ''>('');
  const [newQuestionType, setNewQuestionType] = useState<'single-choice' | 'multiple-choice'>('single-choice');
  const [newAnswers, setNewAnswers] = useState<Answer[]>(
    Array(5).fill({ text: '', isCorrect: false })
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const token = localStorage.getItem('token');

  const fetchQuestionsSubjectsAndGrades = async () => {
    try {
      const questionsRes = await axios.get(`${API_BASE_URL}/questions`, { headers: { Authorization: `Bearer ${token}` } });
      setQuestions(questionsRes.data);

      const subjectRes = await axios.get(`${API_BASE_URL}/subjects`, { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(subjectRes.data);

      const gradeRes = await axios.get(`${API_BASE_URL}/subjects/grades`, { headers: { Authorization: `Bearer ${token}` } });
      setGrades(gradeRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    }
  };

  useEffect(() => {
    fetchQuestionsSubjectsAndGrades();
  }, []);

  const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };

    // If single-choice, ensure only one is correct
    if (newQuestionType === 'single-choice' && field === 'isCorrect' && value === true) {
      updatedAnswers.forEach((ans, i) => {
        if (i !== index) ans.isCorrect = false;
      });
    }
    setNewAnswers(updatedAnswers);
  };

  const resetForm = () => {
    setNewQuestionText('');
    setNewQuestionSubjectId('');
    setNewQuestionGradeId('');
    setNewQuestionType('single-choice');
    setNewAnswers(Array(5).fill({ text: '', isCorrect: false }));
    setEditingQuestion(null);
  };

  const handleAddUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = {
      text: newQuestionText,
      subjectId: newQuestionSubjectId,
      gradeId: newQuestionGradeId,
      type: newQuestionType,
      answers: newAnswers,
    };

    try {
      if (editingQuestion) {
        await axios.put(`${API_BASE_URL}/questions/${editingQuestion.id}`, data, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess('Pregunta actualizada con éxito');
      } else {
        await axios.post(`${API_BASE_URL}/questions`, data, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess('Pregunta creada con éxito');
      }
      resetForm();
      fetchQuestionsSubjectsAndGrades();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar pregunta');
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestionText(question.text);
    setNewQuestionSubjectId(question.subjectId);
    setNewQuestionGradeId(question.gradeId);
    setNewQuestionType(question.type);
    // Ensure there are always 5 answers for editing, pad or slice if necessary
    const answersToEdit = [...question.Answers];
    while (answersToEdit.length < 5) answersToEdit.push({ text: '', isCorrect: false });
    setNewAnswers(answersToEdit.slice(0, 5));
  };

  const handleDeleteQuestion = async (id: number) => {
    setError('');
    setSuccess('');
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      try {
        await axios.delete(`${API_BASE_URL}/questions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess('Pregunta eliminada con éxito');
        fetchQuestionsSubjectsAndGrades();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar pregunta');
      }
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="container">
        <h2>Gestionar Banco de Preguntas</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <h3>{editingQuestion ? 'Editar Pregunta' : 'Añadir Nueva Pregunta'}</h3>
        <form onSubmit={handleAddUpdateQuestion}>
          <div>
            <label>Texto de la Pregunta:</label>
            <textarea value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} required />
          </div>
          <div>
            <label>Asignatura:</label>
            <select value={newQuestionSubjectId} onChange={(e) => setNewQuestionSubjectId(Number(e.target.value))} required>
              <option value="">Selecciona una asignatura</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Grado:</label>
            <select value={newQuestionGradeId} onChange={(e) => setNewQuestionGradeId(Number(e.target.value))} required>
              <option value="">Selecciona un grado</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>{grade.level}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Tipo de Pregunta:</label>
            <select value={newQuestionType} onChange={(e) => setNewQuestionType(e.target.value as 'single-choice' | 'multiple-choice')} required>
              <option value="single-choice">Una respuesta correcta</option>
              <option value="multiple-choice">Varias respuestas correctas</option>
            </select>
          </div>
          <h4>Opciones de Respuesta (5 opciones)</h4>
          {newAnswers.map((answer, index) => (
            <div key={index} className="answer-option">
              <input
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                required
              />
              <label>
                <input
                  type={newQuestionType === 'single-choice' ? 'radio' : 'checkbox'}
                  name={`correct_answer_${editingQuestion?.id || 'new'}`}
                  checked={answer.isCorrect}
                  onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                />
                Correcta
              </label>
            </div>
          ))}
          <button type="submit">{editingQuestion ? 'Actualizar Pregunta' : 'Añadir Pregunta'}</button>
          {editingQuestion && <button type="button" onClick={resetForm} className="btn-secondary">Cancelar Edición</button>}
        </form>

        <h3>Preguntas Existentes</h3>
        <ul>
          {questions.map((question) => (
            <li key={question.id} className="question-item">
              <div>
                <strong>{question.text}</strong>
                <p>Asignatura: {question.Subject?.name || 'N/A'}, Grado: {question.Grade?.level || 'N/A'}</p>
                <p>Tipo: {question.type === 'single-choice' ? 'Una respuesta' : 'Varias respuestas'}</p>
                <ul>
                  {question.Answers.map((answer) => (
                    <li key={answer.id} style={{ color: answer.isCorrect ? 'green' : 'inherit' }}>
                      {answer.text} {answer.isCorrect && '(Correcta)'}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={() => handleEditQuestion(question)} className="btn-warning">Editar</button>
                <button onClick={() => handleDeleteQuestion(question.id)} className="btn-danger">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/">Volver al Inicio</Link>
      </div>
    </ProtectedRoute>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/subjects" element={<SubjectGradeManagement />} />
        <Route path="/questions" element={<QuestionBankManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
