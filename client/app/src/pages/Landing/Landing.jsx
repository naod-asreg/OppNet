import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import "./landing.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import ImageConnect from '../../assets/pexels-christina-morillo-1181715.jpg';
import ImageCollaborate from '../../assets/pexels-fauxels-3184291.jpg'
import Button from "../../components/Button/Button";
function Landing() {
  return (
    <div className="Landing">
      <div className="landing_topBar">
        <TopBar loggedIn={true}/>
      </div>

      <div className="landing_section">
        <div className="landing_section_board-1">
          <div className="landing_section_board-1_section">
            <div className="landing_section_board-1_title">
              Track your college and job applications easily
            </div>
            <div className="landing_section_board-1_subTitle">
              Never miss a deadline and stay organized with our application
              tracking system.
            </div>
            <div className="landing_section_board-1_buttons">
              <SearchBar style={{ width: "75%" }} />
              <Button content={"Sign Up"} color={"black"} />
            </div>
            <div className="landing_section_board-1_footer">
              By signing up, you agree to our Terms and Conditions.
            </div>
          </div>
        </div>
      </div>

      <div className="landing_section">
        <div className="landing_section_board-2">

            <div className="landing_section_board-2_image">
             <img src={ImageConnect}/>
            </div>
        
          <div className="landing_section_board-2_section">
            <div className="landing_section_board-2_title">
            Connect with Peers Applying to Similar Positions
            </div>
            <div className="landing_section_board-2_subTitle">
            Join a group chat with other applicants who are applying to similar positions. Share experiences, ask questions, and support each other throughout the application process.
            </div>
            <div className="landing_section_board-2_buttons">
              <Button content={"Learn More"} width={'8em'}/>
              Sign up &gt;
            </div>
            <div className="landing_section_board-1_footer">
              By signing up, you agree to our Terms and Conditions.
            </div>
          </div>
        </div>
      </div>

      <div className="landing_section">
        <div className="landing_section_board-2">
        
          <div className="landing_section_board-2_section">
            <div className="landing_section_board-2_title">
            Uncover Insights with Application Analytics
            </div>
            <div className="landing_section_board-2_subTitle">
                Discover valuable data and trends about your college and job applications. Gain valuable insights to optimize your application strategy and increase your chances of success.
            </div>
            <div className="landing_section_board-2_buttons">
              <Button content={"Learn More"} width={'8em'}/>
              Sign up &gt;
            </div>
            <div className="landing_section_board-1_footer">
              By signing up, you agree to our Terms and Conditions.
            </div>
          </div>

          <div className="landing_section_board-2_image">
             <img src={ImageCollaborate}/>
            </div>
        </div>
      </div>

      <div className="landing_footer">

      </div>
    </div>
  );
}

export default Landing;
