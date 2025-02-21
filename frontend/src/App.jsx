import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import ListeningWriting from "./pages/ListeningWriting";
import ListeningSpeaking from "./pages/ListeningSpeaking";
import RankingComponent from "./Components/Ranking/RankingComponent";
import "./global.css";
import TelaFinal from "./Components/Pratica/TelaFinal";
import AuthPage from "./Components/AuthPage/AuthPage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/listening-writing" element={<ListeningWriting />} />
            <Route path="/listening-speaking" element={<ListeningSpeaking />} />
            <Route path="/ranking" element={<RankingComponent />} />{" "}
            <Route path="/tela-final" element={<TelaFinal />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
