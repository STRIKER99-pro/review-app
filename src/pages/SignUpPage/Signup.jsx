
import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaPhone, FaEnvelope, FaUser, FaArrowLeft } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [signUpMethod, setSignUpMethod] = useState("choose");
  const [step, setStep] = useState("input");

  // Phone verification states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState("");

  // Email verification states
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [generatedEmailCode, setGeneratedEmailCode] = useState("");

  // User profile
  const [username, setUsername] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingIdentifier, setPendingIdentifier] = useState("");

  // SIMPLE CODE GENERATOR 
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  //HANDLE PHONE VERIFICATION REQUEST
  const handlePhoneRequest = (e) => {
    e.preventDefault();

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!cleanPhone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (cleanPhone.length < 9) {
      toast.error("Please enter a valid phone number with at least 10 digits");
      return;
    }

    setIsSubmitting(true);

    //Just generate and show code
    const code = generateCode();
    setGeneratedPhoneCode(code);
    setPendingIdentifier(phoneNumber);

    // Show code to user (simulating SMS)
    toast.success(`Your verification code is: ${code}`);

    setStep("verify");
    setIsSubmitting(false);
  };

  // 
  const handleEmailRequest = (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Just generate and show code
    const code = generateCode();
    setGeneratedEmailCode(code);
    setPendingIdentifier(email);

    // Show code to user (simulating email)
    toast.success(`Your verification code is: ${code}`);

    setStep("verify");
    setIsSubmitting(false);
  };

  // HANDLE VERIFICATION
  const handleVerify = (e) => {
    e.preventDefault();

    let isValid = false;

    if (signUpMethod === "phone") {
      isValid = phoneCode === generatedPhoneCode;
    } else {
      isValid = emailCode === generatedEmailCode;
    }

    if (!isValid) {
      toast.error("Invalid verification code");
      return;
    }

    setIsSubmitting(true);

    //Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    let user;

    if (signUpMethod === "phone") {
      user = users.find((u) => u.phoneNumber === pendingIdentifier);
    } else {
      user = users.find((u) => u.email === pendingIdentifier);
    }

    if (!user) {
      // Create new user
      user = {
        id: Date.now(),
        ...(signUpMethod === "phone"
          ? { phoneNumber: pendingIdentifier }
          : { email: pendingIdentifier }),
        username:
          username ||
          (signUpMethod === "phone"
            ? `User${pendingIdentifier.slice(-4)}`
            : pendingIdentifier.split("@")[0]),
        verifiedMethods: [signUpMethod],
        createdAt: new Date().toLocaleDateString(),
      };

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Log user in
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
      }),
    );

    toast.success("Logged in successfully!");
    setIsSubmitting(false);

    // Redirect to search page
    setTimeout(() => navigate("/SearchVendor"), 1500);
  };

  // continue as guest
  const handleContinueAsGuest = () => {
    localStorage.setItem("guestSession", "true");
    toast.success("Continuing as guest");
    navigate("/SearchVendor");
  };

  // back arrow
  const handleBack = () => {
    if (step === "verify") {
      setStep("input");
      setPhoneCode("");
      setEmailCode("");
    } else {
      setSignUpMethod("choose");
      setPhoneNumber("");
      setEmail("");
      setPhoneCode("");
      setEmailCode("");
    }
  };

  // render choose method 
  const renderChooseMethod = () => (
    <div className="auth-container">
      <h2 className="auth-title">Welcome to ReviewIt</h2>
      <p className="auth-subtitle">Choose how to verify your identity</p>

      <button
        onClick={() => {
          setSignUpMethod("phone");
          setStep("input");
        }}
        className="auth-method-button"
      >
        <FaPhone className="method-icon" />
        <div className="method-text">
          <strong>Continue with Phone</strong>
          <small>Receive SMS verification code</small>
        </div>
      </button>

      <button
        onClick={() => {
          setSignUpMethod("email");
          setStep("input");
        }}
        className="auth-method-button"
      >
        <FaEnvelope className="method-icon" />
        <div className="method-text">
          <strong>Continue with Email</strong>
          <small>Receive email verification code</small>
        </div>
      </button>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button onClick={handleContinueAsGuest} className="guest-button-large">
        <FaUser className="guest-icon" />
        Continue as Guest
      </button>

      <div className="guest-permissions-panel">
        <p className="guest-permissions-title">Guest access includes:</p>
        <ul className="guest-permissions-list">
          <li>✓ View all vendors and reviews</li>
          <li>✓ Search for vendors</li>
          <li className="restricted">✗ Create new vendors</li>
          <li className="restricted">✗ Leave reviews</li>
        </ul>
      </div>
    </div>
  );

  // render input
  const renderInput = () => (
    <div className="auth-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Back
      </button>

      <h2 className="auth-title">
        {signUpMethod === "phone" ? "Verify with Phone" : "Verify with Email"}
      </h2>

      <form
        onSubmit={
          signUpMethod === "phone" ? handlePhoneRequest : handleEmailRequest
        }
      >
        {signUpMethod === "phone" ? (
          <div className="form-group">
            <label className="form-label">
              <FaPhone className="form-icon" /> Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., 680752477"
              className="form-input"
              disabled={isSubmitting}
              autoFocus
            />
            <small className="input-hint">
              We'll show you a 6-digit code (simulating SMS)
            </small>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">
              <FaEnvelope className="form-icon" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input"
              disabled={isSubmitting}
              autoFocus
            />
            <small className="input-hint">
              We'll show you a 6-digit code (simulating email)
            </small>
          </div>
        )}

        {/* Optional username for first-time users */}
        <div className="form-group">
          <label className="form-label">
            <FaUser className="form-icon" /> Display Name (optional)
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="How should we call you?"
            className="form-input"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Verification Code"}
        </button>
      </form>
    </div>
  );

  // render verification
  const renderVerify = () => (
    <div className="auth-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Back
      </button>

      <h2 className="auth-title">Enter Verification Code</h2>

      <p className="verify-instruction">
        We've sent a 6-digit code to:
        <br />
        <strong>{pendingIdentifier}</strong>
      </p>

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="form-label">Verification Code</label>
          <input
            type="text"
            value={signUpMethod === "phone" ? phoneCode : emailCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              if (signUpMethod === "phone") {
                setPhoneCode(value);
              } else {
                setEmailCode(value);
              }
            }}
            placeholder="000000"
            className="form-input code-input"
            maxLength="6"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={
            isSubmitting ||
            (signUpMethod === "phone"
              ? phoneCode.length !== 6
              : emailCode.length !== 6)
          }
        >
          {isSubmitting ? "Verifying..." : "Verify & Login"}
        </button>
      </form>

      <div className="resend-section">
        <button
          onClick={() => {
            if (signUpMethod === "phone") {
              const newCode = generateCode();
              setGeneratedPhoneCode(newCode);
              toast.success(`New code: ${newCode}`);
            } else {
              const newCode = generateCode();
              setGeneratedEmailCode(newCode);
              toast.success(`New code: ${newCode}`);
            }
          }}
          className="resend-button"
          disabled={isSubmitting}
        >
          Resend Code
        </button>
      </div>
    </div>
  );

  // main render
  return (
    <div
      className="review-card"
      style={{ maxWidth: "450px", margin: "0 auto" }}
    >
      <Toaster position="top-center" />

      <div>
        {/* Header */}
        <div className="brand-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">Check before you buy</div>
        </div>

        {/* Auth Content */}
        {signUpMethod === "choose" && renderChooseMethod()}
        {signUpMethod !== "choose" && step === "input" && renderInput()}
        {signUpMethod !== "choose" && step === "verify" && renderVerify()}
      </div>

      {/* Footer */}
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Signup;


