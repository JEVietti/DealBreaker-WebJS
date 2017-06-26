import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

class Home extends Component {

    constructor(){
        super();
        this.state = {

        }
    }

    handleSubmit(){


    }

    render(){
        
        return(

           <div className = "jumbotron text-center">
  <div id="index-banner" className="parallax-container">
    <div className="section no-pad-bot no-pad-top">
      <div className="container">
        <br /><br />
          <h1 className= "center">Dealbreaker</h1>
        <div className="row center">
          <h4 className="header slogan"> Know before you start! </h4>
        </div>
        <br /><br />
      </div>
    </div>
    <div className="parallax"><img className=" front-img responsive-img" src="https://static.pexels.com/photos/6541/sea-man-beach-holiday.jpg" alt="Unsplashed background img 1" /></div>
  <div className="row center">
           <button className = "btn btn-primary btn-lg">Register</button> 
            <button className = "btn btn-primary btn-lg">Login</button>  
        </div>
  
  </div>
<div className = "container row-center">
  <div className="">
      <h3 className="center">Community Feedback</h3>      
      <p className="center">Users are able to give Feedback on each other by commenting on the user's profile available for other potential matches to see. This is not a forum for bullying, rather to weed out malicious profiles that are not using the website seriously.
      </p>
  </div>
  <div className="">
      <h3 className="center heading">Find Your Match!</h3>
      <p className="center"> Each person lists their qualities and attributes for the each potential match but only their bad attributes and deal breakers are visible until being confirmed. This lets the user know what they are in for with the added suspense of discovering their matches best attributes, however a short biography is included to give each user's profile a personality.
       </p>
  </div>
  <div className="">
      <h3 className="center"> Quick and Easy </h3>    
      <p className="center "> Simply browse for users to find your potential match, or navigate to their profile by username. Once added you can set up dates through messages or exchange contact information and keep it completly private, as well as sharing private images for each other to see.</p>
      
  </div>
</div>
</div>
                
        );


    }



}

export default Home;