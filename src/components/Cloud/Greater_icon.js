import React from 'react'
import '../styling/childfolder.css'
import {Link} from 'react-router-dom'
export default function Greater_icon({element=null,pathId = null}) 
{   
    if(element == null)
    {
        return (
            <span className="material-icons me-1">navigate_next</span>
        )
    }

    else{
        return (
            <>
            <Link to = {pathId} className="me-1 routing">{element}</Link>
            <span className="material-icons me-1">navigate_next</span> 
            </>
        )
    }
}
