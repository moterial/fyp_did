import * as React from "react";
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

const itemUrl = [`/`,`/dashboard/profile`]

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];
const item = ["Main", "Profile", "1", '2','3'];
const iconUrl = ['https://cdn-icons-png.flaticon.com/512/9069/9069049.png','https://cdn-icons-png.flaticon.com/512/8919/8919107.png',
'https://cdn-icons-png.flaticon.com/512/4400/4400483.png','https://cdn-icons-png.flaticon.com/512/3135/3135768.png','https://cdn-icons-png.flaticon.com/512/3135/3135768.png'];

export const MenuItem = ({ i}) => {
  const style = { border: `2px solid ${colors[i]}` , padding: '12px 7px'};
  const style1 = { padding: '12px 7px'};
  const style2 = { color: `${colors[i]}`};
  const headingstyle = { position: 'relative', left: '10px', bottom: '50px',fontSize: '1.5rem', color: `${colors[i]}` };
  const imgstyle = { backgroundImage : `url(${iconUrl[i]})`, backgroundSize: 'cover', width: '35px', height: '35px', borderRadius: '50%',position: 'relative', right: '6px',bottom: '11px'};
  
  return (
    <>
    {/* {
      i === 0 ? <motion.h1 variants={variants} style={headingstyle} className="fw-bolder">Welcome</motion.h1> : null
    } */}
    <a href={itemUrl[i]}>
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      
    > 
      
      <div className="icon-placeholder" style={style1} >
        <div style={imgstyle}></div>
      </div>
      <div className="text-placeholder" style={style} >
        <div className="menu-url fw-bold" style={style2}>{item[i]}</div>
      </div>
      

    </motion.li>
    </a>
    </>
  );
};
