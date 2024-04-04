function generateWeightData() {
  const startDate = new Date("2022-01-01T00:00:00");
  const data = [];
  let currentWeight = Math.floor(Math.random() * (160 - 120 + 1)) + 120;

  for (let day = 0; day < 365 * 2; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dateString = currentDate.toISOString().split("T")[0];
    const weightChange = Math.floor(Math.random() * 5) - 2; // Generates a number between -2 and 2
    currentWeight = Math.max(120, Math.min(160, currentWeight + weightChange));

    data.push({ date: dateString, weight: currentWeight });
  }

  return data;
}

const WEIGHTDATA = generateWeightData(); //seperate the data into two arrays
const dates: string[] = [];
const weights: number[] = [];

WEIGHTDATA.forEach((data) => {
  dates.push(data.date);
  weights.push(data.weight);
});

const options = {
  title: {
    text: "Weight Progress",
    align: "center",
    subtext: "Jan 2022 - Jan 2024",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    nameLocation: "middle",
    data: dates,
    nameGap: 30,
    maxInterval: 3600 * 24 * 1000,
  },
  yAxis: {
    type: "value",
    name: "Weight (lbs)",
    nameLocation: "middle",
    nameGap: 40,
    min: Math.min(...weights) - 5,
    max: Math.max(...weights) + 5,
    //add some padding to make sure last point is visible
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      type: "line",
      data: weights,
      name: "Weight",
      encode: {
        x: "timestamp",
      },
      smooth: true,
    },
  ],
};

export default options;
