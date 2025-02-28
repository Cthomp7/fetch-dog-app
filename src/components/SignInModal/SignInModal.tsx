import React, { useState } from "react";
import styles from "./SignInModal.module.css";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Handle input fields after Sign In is selected
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    authenticateLogin(name, email);
  };

  // Authenticate user with provided login info
  const authenticateLogin = async (name: string, email: string) => {
    const fetchAPI = "https://frontend-take-home-service.fetch.com/auth/login";
    try {
      const response = await fetch(fetchAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      onSignIn();
    } catch (error) {
      console.error("Failed to fetch auth cookie");
      throw error;
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.headerContainer}>
            <div>
              <div className={styles.header}>
                <h2 className={styles.title}>Sign In</h2>
                <button onClick={onClose} className={styles.closeButton}>
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email address"
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitButton}>
                Sign In
              </button>
            </form>

            <p className={styles.artistAttribute}>
              Photo by{" "}
              <a href="https://commons.wikimedia.org/w/index.php?curid=71569079">
                KensukeKobayashi
              </a>{" "}
              - Own work, CC BY-SA 4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
