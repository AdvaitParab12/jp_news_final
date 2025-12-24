import Clock from "@/components/Clock";
export default function QuickNav() {
  return (
    <div className="top-menu">
      {/* Begin .container */}
      <div className="container">
        {/* Begin .left-top-menu */}
        <ul className="left-top-menu">
          <li>
            {" "}
            <a href="#" className="facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </li>
          <li>
            {" "}
            <a
              href="https://www.youtube.com/@jantaprakashnews"
              target="_blank"
              className="youtube"
            >
              {" "}
              <i className="fa-brands fa-youtube"></i>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a
              href="https://www.instagram.com/jantaprakashnews/?igsh=dThwMjFtb3JldG51"
              target="_blank"
              className="instagram"
            >
              {" "}
              <i className="fa-brands fa-instagram"></i>
            </a>{" "}
          </li>
          <li>
            {" "}
            <a
              href="https://x.com/Janta_Prakash/status/1997920162864038044?s=08"
              target="_blank"
              className="twitter"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>{" "}
          </li>
        </ul>
        {/* End .left-top-menu */}
        {/* Begin .right-top-menu */}
        <ul className="right-top-menu pull-right">
          <Clock />
        </ul>
        {/* End .right-top-menu */}
      </div>
      {/* End .container */}
    </div>
  );
}
