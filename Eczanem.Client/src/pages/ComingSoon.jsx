import { Link } from "react-router-dom";

export default function ComingSoon({ title }) {
  return (
    <div className="text-center mt-5 pt-5">
      <h1 className="display-1">🚧</h1>
      <h2 className="mb-3">{title}</h2>
      <p className="lead text-muted">Bu modül geliştirme aşamasındadır.</p>
      <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
    </div>
  );
}