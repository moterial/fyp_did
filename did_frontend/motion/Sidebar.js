import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { useEffect,useState} from "react";
import jwt_decode from "jwt-decode";
import Balance from "../component/balance";



const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    },
    zIndex: 1
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    },
    zIndex: 1

  }
};

const sign = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    },
    zIndex: 1
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }

}

export const Sidebar = (props) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [user,setUser] = useState('');
  const [pressLogout,setPressLogout] = useState(false);

  //when isOpen is true pass the state to props
  useEffect(() => {
    props.setSidebar(isOpen)
  }, [isOpen])

  


  useEffect(() => { 


    if(pressLogout){    
        console.log('logout ing')

        fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+localStorage.getItem('token')
            },
            body: JSON.stringify({
                username: user
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == "success"){
                
                localStorage.removeItem('token')
                console.log(data)
                setPressLogout(false)
                window.location.href = '/login'
            }else{
                console.log(data)
            }
        })

        
    }
    }, [pressLogout])

  useEffect(() => {
    //get token from local storage
    
    const token = localStorage.getItem('token');

    //decode token
    if(token == null){
      setUser('');
      console.log('token expired');
      
    }else{
      const decoded = jwt_decode(token);
      setUser(decoded);
      console.log(decoded);
      //get the expiration time
      const exp = decoded.exp;
      //get the current time
      const currentTime = Date.now() / 1000;
      //check if the token is expired
      if(currentTime > exp){
        console.log('token expired');
        setUser('');
      }else{
        console.log('token not expired');
        console.log(decoded.username.username);
        setUser(decoded.username.username);
      }
    }



  }, [])

  return (
    <>
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className="sidebar"
    >
       
      <motion.div className="background" variants={sidebar} />
      <Navigation />
      <motion.div variants={sign} style={{position: "relative", top: "9.5%", left:"10%" , width:'200px',height:'30px',zIndex:'-1'}} className="text-placeholder">
        
        <div className="menu-url fw-bold" style={{color:'#FF008C',fontSize:"20px"}} >
          Welcome {
            user ? user : "Guest" 
          }
        </div>
      </motion.div >
      <MenuToggle toggle={() => toggleOpen()} />
      <motion.div variants={sign} style={{position: "relative", top: "800px", left: "60%",border:'2px solid #FF008C', padding: '12px 7px',width:'85px',height:'30px',cursor:"pointer",zIndex:'-1'}} className="text-placeholder">
        
        <div className="menu-url fw-bold" style={{color:'#FF008C'}} >
          {
            user ? <div onClick={() => setPressLogout(true)}>Logout</div> : <div onClick={() => window.location.href = '/login'}>Login</div>
          }
        </div>
      </motion.div >
          {
            user &&
            <Balance user={user} balance={props.balance} account={props.account}/>
          }
     
    </motion.nav>

    
    </>

  );
};
