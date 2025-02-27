import React from "react";
import SignInModal from "../../components/SignInModal/SignInModal.tsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Redirect to /search page after sign in
  const handleOnSignIn = () => {
    navigate("/search");
  };

  return (
    <div>
      <SignInModal
        isOpen={true}
        onClose={() => {}}
        onSignIn={handleOnSignIn}
      ></SignInModal>
    </div>
  );
};

export default Home;
