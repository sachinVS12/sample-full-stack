import NodeForm from "../components/NodeForm";
import { useNavigate } from "react-router-dom";

export default function NodeCreation() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>➕ Create New Sensor Node</h1>
      <div className="card">
        <NodeForm onCreated={() => navigate("/table")} />
      </div>
    </div>
  );
}
