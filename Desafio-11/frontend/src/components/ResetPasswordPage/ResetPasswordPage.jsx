import { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  console.log("Token recibido:", token); // Agrega este console.log

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    // Lógica para enviar la nueva contraseña al servidor con el token
    try {
      const response = await fetch(
        `http://localhost:8080/api/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ newPassword, confirmPassword }),
        }
      );

      if (response.status === 200) {
        // Restablecimiento exitoso, redirigir a la página de inicio de sesión u otra página
      } else {
        // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <input
        type="password"
        placeholder="Nueva Contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Restablecer Contraseña</button>
    </div>
  );
};

export default ResetPasswordPage;
