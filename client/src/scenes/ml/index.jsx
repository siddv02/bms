import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import Header from "components/Header";

const MLPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/ml/run")
      .then((res) => res.json())
      .then((data) => setData(data.result ? JSON.parse(data.result) : null))
      .catch(console.error);
  }, []);

  if (!data) return <CircularProgress />;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ML Analytics" subtitle="Insights from ML Models" />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Sales Prediction MSE</Typography>
        <Typography>{data.sales_mse}</Typography>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Trending Products (Top 5)</Typography>
        {data.top_trending.map((item, idx) => (
          <Typography key={idx}>{item.subcategory} - {item.category} ({item.price_count})</Typography>
        ))}
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Cluster Centers</Typography>
        <pre>{JSON.stringify(data.cluster_centers, null, 2)}</pre>
      </Paper>
    </Box>
  );
};

export default MLPage;
