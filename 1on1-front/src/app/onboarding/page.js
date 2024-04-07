import Head from 'next/head';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OnboardingPage() {
    return (
        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Onboarding Page</title>
  <link rel="stylesheet" href="assets/onboarding.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Plus+Jakarta+Sans%3A400%2C500%2C700%2C800"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossOrigin="anonymous"
  />
  <header>
    <nav className="navbar navbar-expand-lg" id="nav-bar">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item" id="logo">
            <a className="navbar-brand" href="#">
              <img src="/assets/logo.png" width={160} height={40} alt="" />
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Features
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Pricing
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Contact Us
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.89)",
                width: "7rem",
                color: "black"
              }}
            >
              <a href="/login" style={{ color: "rgb(0, 0, 0)" }}>
                Login
              </a>
            </button>
          </li>
          <li>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: "#B4326C",
                color: "rgb(255, 255, 255)",
                width: "7rem"
              }}
            >
              <a href="/signup" style={{ color: "white" }}>
                Get Started
              </a>
            </button>
          </li>
        </ul>
    </nav>
  </header>
  <main>
    <div className="main-container">
      <div className="row">
        <div className="col-md-12 text-center">
          <p className="slogan">
            <span className="slogan-0">Booking made easy with</span>
            <span className="slogan-1">Appointify</span>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 text-center">
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: "#B4326C",
                color: "rgb(255, 255, 255)",
                borderColor: "white"
              }}
            >
              <a href="/signup" style={{ color: "white" }}>
                Sign Up
              </a>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              style={{ borderColor: "white" }}
            >
              <a href="/login" style={{ color: "rgb(255, 255, 255)" }}>
                Login
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="container" id="features">
      <h1
        style={{
          textAlign: "center",
          fontFamily: 'Plus Jakarta Sans, "Source Sans Pro"',
          fontWeight: 800,
          textDecoration: "underline"
        }}
      >
        Features
      </h1>
      <div className="row">
        <div className="col-sm">
          <h1>Fast.</h1>
          <img
            src="/assets/clock.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: 'Plus Jakarta Sans, "Source Sans Pro"'
            }}
          >
            Appointify revolutionizes scheduling with lightning-speed
            efficiency. Say goodbye to long waits and cumbersome processes – our
            platform ensures swift and instant appointment bookings, optimizing
            your time management
          </p>
        </div>
        <div className="col-sm">
          <h1>Easy.</h1>
          <img
            src="/assets/easy.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: 'Plus Jakarta Sans, "Source Sans Pro"'
            }}
          >
            Simplicity meets functionality with Appointify's easy-to-use
            interface. Enjoy a hassle-free experience as you effortlessly
            navigate through the intuitive design, making appointment scheduling
            a breeze for users of all backgrounds
          </p>
        </div>
        <div className="col-sm">
          <h1>Efficient.</h1>
          <img
            src="assets/e.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: 'Plus Jakarta Sans, "Source Sans Pro'
            }}
          >
            Boost your productivity with Appointify's efficient scheduling
            solutions. Our platform streamlines the entire process, from booking
            to reminders, ensuring optimal time utilization and minimizing
            no-shows. Experience unparalleled efficiency in managing your
            appointments effortlessly
          </p>
        </div>
      </div>
    </div>
    <div className="container" id="how-to">
      <h1 className="app-heading">Discover Appointify!</h1>
      <div className="row" id="how-to-row">
        <div className="col-md-6" id="how-to-col">
          <img src="assets/6234265.jpg" alt="Illustration" />
        </div>
        <div className="col-md-6">
          <ul className="how-to-ul">
            <li>
              {" "}
              <img src="assets/calendar.png" alt="Step 1" />
              <h6>Create a new Calendar!</h6>
            </li>
            <li>
              <img src="assets/add-user.png" alt="Step 2" />
              <h6>Invite your contacts!</h6>
            </li>
            <li>
              {" "}
              <img src="assets/duration.png" alt="Step 3" />
              <h6> Remind your contacts</h6>
            </li>
            <li>
              <img src="assets/schedule.png" alt="Step 4" />
              <h6>Finalize Appointment!</h6>
            </li>
            <li>
              <img src="assets/videoconference.png" alt="Step 5" />
              <h6>Happy Appointment!</h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="meeting-gif">
      <img src="assets/meeting.gif" />
    </div>
  </main>
  <footer className="py-3 my-4">
    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
      <li className="nav-item">
        <a href="#" className="nav-link px-2 text-body-secondary">
          Home
        </a>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link px-2 text-body-secondary">
          Features
        </a>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link px-2 text-body-secondary">
          Pricing
        </a>
      </li>
      <li className="nav-item">
        <a href="#" className="nav-link px-2 text-body-secondary">
          Contact Us
        </a>
      </li>
    </ul>
    <div className="text-center">
      <p className="text-body-secondary">Follow us on social media:</p>
      <div className="nav justify-content-center border-bottom pb-3 mb-3">

      <a href="#" className="social-icon">
        <img
          src="assets/facebook.png"
          alt="Facebook"
          width="40px"
          height="40px"
        />
      </a>
      <a href="#" className="social-icon">
        <img
          src="assets/twitter.png"
          alt="Twitter"
          width="40px"
          height="40px"
        />
      </a>
      <a href="#" className="social-icon">
        <img
          src="assets/instagram.png"
          alt="Instagram"
          width="40px"
          height="40px"
        />
      </a>
      <a href="#" className="social-icon">
        <img
          src="assets/youtube.png"
          alt="Youtube"
          width="40px"
          height="40px"
        />
      </a>
      </div>
    </div>
    <p className="text-center text-body-secondary">© 2024 Appointify, Inc</p>
  </footer>
</>

    );
}
