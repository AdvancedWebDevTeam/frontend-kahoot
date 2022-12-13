import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import "./Slide.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MainView({ selectedIndex, listOfSlides }) {
  const len = listOfSlides.length;

  useEffect(() => {
    if (len > 0) {
    }
  }, []);

  return (
    <div className="boxSlide main-view" style={{ marginTop: "5px" }}>
      {len > 0 && (
        <>
          {listOfSlides[selectedIndex].types_id === 0 && null}
          {listOfSlides[selectedIndex].types_id === 1 && (
            <Bar
              className="bar"
              data={{
                labels: Object.keys(listOfSlides[selectedIndex].options),
                datasets: [
                  {
                    label: listOfSlides[selectedIndex].question,
                    backgroundColor: ["#3e95cd", "#8e5ea2"],
                    data: Object.values(listOfSlides[selectedIndex].options)
                  }
                ]
              }}
              options={{
                responsive: true,
                legend: { display: false },
                maintainAspectRatio: false
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
