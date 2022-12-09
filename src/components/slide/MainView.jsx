import "./Slide.css"
export default function MainView ({selectedIndex, listOfSlides}) {
    //console.log({selectedIndex, listOfSlides})
    const len = listOfSlides.length;
    return (
        <div className="boxSlide" style={{marginTop: "5px"}}>
            {len > 0 &&
                <h5>{listOfSlides[selectedIndex].slides_id}</h5>
            }
        </div>
    )
}