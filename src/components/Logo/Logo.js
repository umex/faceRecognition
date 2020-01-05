import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
//import brain from './brain.png'
import brain2 from './ai.svg'

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner"><img alt='logo' src={brain2}></img></div>
            </Tilt>
        </div>
    );
}


//<div>Icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

export default Logo;