import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/authService"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(username, password);

      // Kullanıcıyı kaydet
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Hoşgeldiniz, ${user.name}! 👋`);

      // --- DÜZELTME BURADA ---
      // Rol kontrolü yapıp doğru sayfaya yönlendiriyoruz
      if (user.role === 'admin') {
        navigate("/"); // Admin ise Dashboard'a
      } else {
        navigate("/medicines"); // Diğerleri İlaç Yönetimine
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error(error);
      toast.error("❌ Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center text-primary mb-4">🔐 Eczane Girişi</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Giriş Yap 🚀
          </button>
        </form>
      </div>
    </div>
  );
}