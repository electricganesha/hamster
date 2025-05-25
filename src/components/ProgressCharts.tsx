import { Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

export function ProgressCharts({ chartData }: { chartData: any }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Progress Charts</Typography>
      <LineChart
        height={300}
        series={[
          { data: chartData.distance, label: "Distance (m)" },
          { data: chartData.avgTemp, label: "Avg Temp (°C)" },
          { data: chartData.avgHumidity, label: "Avg Humidity (%)" },
        ]}
        xAxis={[{ scaleType: "point", data: chartData.days }]}
      />
    </Paper>
  );
}
