import { useState, useEffect } from "react";

import "./Slide.css"
export default function MainView ({selectedIndex, listOfSlides}) {
    const len = listOfSlides.length;
    
    useEffect(() => {
        if(len > 0)
        {
            
        }
    }, [])
    
    return (
        <div className="boxSlide" style={{marginTop: "5px"}}>
            {len > 0 &&
                <div>
                    {listOfSlides[selectedIndex].types_id === 0 &&
                        <div>
                            Blank
                        </div>
                    }
                    {listOfSlides[selectedIndex].types_id === 1 &&
                        <div>
                            Multiple
                        </div>
                    }
                </div>
            }
        </div>
    )
}