import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "components/Header";

// Importing PNG images from assets
import predictedSalesBar from "assets/output/predicted_sales_bar.png";
import salesTrendHeatmap from "assets/output/sales_trend_heatmap.png";
import salesForecast from "assets/output/sales_forecast_accessories.png";
import salesClothing from "assets/output/sales_forecast_clothing.png";
import salesMisc from "assets/output/sales_forecast_misc.png";
import salesShoes from "assets/output/sales_forecast_shoes.png";


const Performance = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="PERFORMANCE"
        subtitle="Visual Results from ML Model Outputs"
      />

      {/* Bar Plot */}
      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Top Predicted Sales by Subcategory
        </Typography>
        <img
          src={predictedSalesBar}
          alt="Predicted Sales Bar"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

      {/* Heatmap */}
      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Sales Trend Heatmap
        </Typography>
        <img
          src={salesTrendHeatmap}
          alt="Sales Heatmap"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Sales Forecast for Accessories
        </Typography>
        <img
          src={salesForecast}
          alt="Predicted Sales Accessories"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Top Predicted Sales by Subcategory
        </Typography>
        <img
          src={salesClothing}
          alt="Predicted Sales Clothing"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Top Predicted Sales by Subcategory
        </Typography>
        <img
          src={salesMisc}
          alt="Predicted Sales Misc"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

      <Box mt="2rem">
        <Typography variant="h5" gutterBottom>
          Top Predicted Sales by Subcategory
        </Typography>
        <img
          src={salesShoes}
          alt="Predicted Sales Shoes"
          style={{ width: "100%", maxWidth: "1000px", borderRadius: "12px" }}
        />
      </Box>

    </Box>
  );
};

export default Performance;
