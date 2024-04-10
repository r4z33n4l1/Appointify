
'use client'


export default function OnboardingPage() {
    return (
        <>
  <>
  <meta charSet="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, initial-scale=1.0"
  />
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav-bar">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src="assets/logo.png" width={160} height={40} alt="logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact Us
              </a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a
                className="btn btn-primary"
                href="/login"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.89)",
                  color: "black"
                }}
              >
                Login
              </a>
            </li>
            <li className="nav-item">
              <a
                className="btn btn-primary"
                href="/signup"
                style={{ backgroundColor: "#B4326C", color: "white" }}
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>
    </nav>
  </header>
  <main>
    <div
      className="container"
      style={{ background: "linear-gradient(135deg, #528582, #2E475C)" }}
    >
      <div className="row">
        <div className="col-sm text-center">
          <p className="slogan">
            <span className="slogan-0">Booking made easy with</span>
            <span className="slogan-1">Appointify</span>
          </p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
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
          </div>
        </div>
        <div className="col-md-6 text-center">
          <div className="btn-container">
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
          fontFamily: '"Plus Jakarta Sans", "Source Sans Pro"',
          fontWeight: 800,
          textDecoration: "underline"
        }}
      >
        Features
      </h1>
      <div className="row">
        <div className="col-sm-4 text-center">
          <h1>Fast.</h1>
          <img
            src="assets/clock.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
            alt="clock"
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: '"Plus Jakarta Sans", "Source Sans Pro"'
            }}
          >
            Appointify revolutionizes scheduling with lightning-speed
            efficiency. Say goodbye to long waits and cumbersome processes – our
            platform ensures swift and instant appointment bookings, optimizing
            your time management
          </p>
        </div>
        <div className="col-sm-4 text-center">
          <h1>Easy.</h1>
          <img
            src="assets/easy.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
            alt="easy"
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: '"Plus Jakarta Sans", "Source Sans Pro"'
            }}
          >
            Simplicity meets functionality with Appointify's easy-to-use
            interface. Enjoy a hassle-free experience as you effortlessly
            navigate through the intuitive design, making appointment scheduling
            a breeze for users of all backgrounds
          </p>
        </div>
        <div className="col-sm-4 text-center">
          <h1>Efficient.</h1>
          <img
            src="assets/e.png"
            width="100rem"
            height="100rem"
            style={{ margin: "1.5rem" }}
            alt="e"
          />
          <p
            style={{
              textAlign: "justify",
              fontFamily: '"Plus Jakarta Sans", "Source Sans Pro"'
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
              <img src="assets/calendar.png" alt="Step 1" />
              <h6>Create a new Calendar!</h6>
            </li>
            <li>
              <img src="assets/add-user.png" alt="Step 2" />
              <h6>Invite your contacts!</h6>
            </li>
            <li>
              <img src="assets/duration.png" alt="Step 3" />
              <h6>Remind your contacts</h6>
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
      <img src="assets/meeting.gif" alt="meeting" />
    </div>
  </main>
  <footer className="py-3 my-4" id="contact">
    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
      <li className="nav-item">
        <a href="onboarding.html" className="nav-link px-2 text-body-secondary">
          Home
        </a>
      </li>
      <li className="nav-item">
        <a href="#features" className="nav-link px-2 text-body-secondary">
          Features
        </a>
      </li>
      <li className="nav-item">
        <a href="#contact" className="nav-link px-2 text-body-secondary">
          Contact Us
        </a>
      </li>
    </ul>
    <div className="text-center">
      <p className="text-body-secondary">Follow us on social media:</p>
      <div className= "nav justify-content-center border-bottom pb-3 mb-3">
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
</>

    );
}
